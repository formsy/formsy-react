import { InputRegistration, ValidationError } from './interfaces';
import * as utils from './utils';
import { validationRules } from './validationRules';

export interface FormState {
  values: Map<string, any>;
  initialValues: Map<string, any>;
  errors: Map<string, ValidationError[]>;
  isPristine: Map<string, boolean>;
  isValid: Map<string, boolean>;
  isRequired: Map<string, boolean>;
  inputs: Map<string, InputRegistration>;
  formSubmitted: boolean;
  formIsValid: boolean;
  isSubmitting: boolean;
  canChange: boolean;
  externalValidationErrors: Map<string, any>;
  preventExternalInvalidation: boolean;
}

export type FormAction =
  | { type: 'REGISTER'; name: string; config: InputRegistration; initialValue: any }
  | { type: 'UNREGISTER'; name: string }
  | { type: 'SET_VALUE'; name: string; value: any; validate: boolean }
  | { type: 'SET_VALUES'; values: Map<string, any>; validate: boolean }
  | { type: 'SET_SUBMITTED'; submitted: boolean }
  | { type: 'SET_EXTERNAL_ERRORS'; errors: Map<string, any>; preventInvalidation: boolean }
  | { type: 'SET_CAN_CHANGE'; canChange: boolean }
  | { type: 'VALIDATE' }
  | { type: 'RESET'; values?: Map<string, any> }
  | { type: 'UPDATE_VALIDATIONS'; name: string; config: InputRegistration };

function runSingleValidation(
  value: any,
  allValues: Map<string, any>,
  input: InputRegistration,
  externalError?: ValidationError
): { isRequired: boolean; isValid: boolean; validationError: ValidationError[] } {
  const currentValues = Object.fromEntries(allValues);
  const validationResults = utils.runRules(value, currentValues, input.validations || {}, validationRules);
  const requiredResults = utils.runRules(value, currentValues, input.requiredValidations || {}, validationRules);
  const isRequired = Object.keys(input.requiredValidations || {}).length ? !!requiredResults.success.length : false;
  const isCustomValid = !validationResults.failed.length;
  const isValid = isRequired ? false : isCustomValid && !externalError;
  const validationErrors = input.validationErrors || ({} as Record<string, ValidationError>);
  const componentValidationError = input.validationError;

  const validationError: ValidationError[] = (() => {
    if (isValid && !isRequired) {
      return [];
    }

    if (validationResults.errors.length) {
      return validationResults.errors;
    }

    if (externalError) {
      return utils.isString(externalError) ? [externalError] : [externalError];
    }

    if (isRequired) {
      const error = validationErrors[requiredResults.success[0]] || componentValidationError;
      return error ? [error] : (null as any);
    }

    if (validationResults.failed.length) {
      return validationResults.failed
        .map((failed) => (validationErrors[failed] ? validationErrors[failed] : componentValidationError))
        .filter((x, pos, arr) => arr.indexOf(x) === pos);
    }

    return [] as ValidationError[];
  })();

  return {
    isRequired,
    isValid,
    validationError: validationError || [],
  };
}

function validateAll(state: FormState): FormState {
  const newErrors = new Map<string, ValidationError[]>();
  const newIsValid = new Map<string, boolean>();
  const newIsRequired = new Map<string, boolean>();
  let formIsValid = true;

  state.inputs.forEach((input, name) => {
    const value = state.values.get(name);
    const externalError = state.externalValidationErrors.get(name);
    const result = runSingleValidation(value, state.values, input, externalError);
    const prevented = state.preventExternalInvalidation && state.externalValidationErrors.has(name);
    newErrors.set(name, result.validationError);
    newIsValid.set(name, prevented ? true : result.isValid);
    newIsRequired.set(name, result.isRequired);
    if (!newIsValid.get(name)) {
      formIsValid = false;
    }
  });

  return {
    ...state,
    errors: newErrors,
    isValid: newIsValid,
    isRequired: newIsRequired,
    formIsValid,
  };
}

export function formsyReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'REGISTER': {
      if (!action.name) {
        return state;
      }
      if (state.inputs.has(action.name)) {
        return state;
      }
      const newInputs = new Map(state.inputs).set(action.name, action.config);
      const newValues = new Map(state.values).set(action.name, action.initialValue);
      const newInitialValues = new Map(state.initialValues).set(action.name, action.initialValue);
      const newPristine = new Map(state.isPristine).set(action.name, true);
      let newState: FormState = {
        ...state,
        inputs: newInputs,
        values: newValues,
        initialValues: newInitialValues,
        isPristine: newPristine,
      };
      newState = validateAll(newState);
      return newState;
    }

    case 'UNREGISTER': {
      if (!state.inputs.has(action.name)) {
        return state;
      }
      const newInputs = new Map(state.inputs);
      newInputs.delete(action.name);
      const newValues = new Map(state.values);
      newValues.delete(action.name);
      const newInitialValues = new Map(state.initialValues);
      newInitialValues.delete(action.name);
      const newErrors = new Map(state.errors);
      newErrors.delete(action.name);
      const newPristine = new Map(state.isPristine);
      newPristine.delete(action.name);
      const newIsValid = new Map(state.isValid);
      newIsValid.delete(action.name);
      const newIsRequired = new Map(state.isRequired);
      newIsRequired.delete(action.name);
      let newState: FormState = {
        ...state,
        inputs: newInputs,
        values: newValues,
        initialValues: newInitialValues,
        errors: newErrors,
        isPristine: newPristine,
        isValid: newIsValid,
        isRequired: newIsRequired,
      };
      newState = validateAll(newState);
      return newState;
    }

    case 'SET_VALUE': {
      const newValues = new Map(state.values).set(action.name, action.value);
      const newPristine = action.validate ? new Map(state.isPristine).set(action.name, false) : state.isPristine;
      const newExternalErrors = new Map(state.externalValidationErrors);
      newExternalErrors.delete(action.name);
      let newState: FormState = {
        ...state,
        values: newValues,
        isPristine: newPristine,
        externalValidationErrors: newExternalErrors,
      };
      if (action.validate) {
        newState = validateAll(newState);
      }
      return newState;
    }

    case 'SET_VALUES': {
      const newValues = new Map(state.values);
      action.values.forEach((value, name) => {
        newValues.set(name, value);
      });
      const newState = { ...state, values: newValues };
      return action.validate ? validateAll(newState) : newState;
    }

    case 'SET_SUBMITTED': {
      return { ...state, formSubmitted: action.submitted };
    }

    case 'SET_EXTERNAL_ERRORS': {
      const { errors, preventInvalidation } = action;
      return validateAll({
        ...state,
        externalValidationErrors: errors,
        preventExternalInvalidation: preventInvalidation,
      });
    }

    case 'SET_CAN_CHANGE': {
      return { ...state, canChange: action.canChange };
    }

    case 'VALIDATE': {
      return validateAll(state);
    }

    case 'RESET': {
      const newValues = new Map(state.values);
      const newPristine = new Map(state.isPristine);
      if (action.values) {
        action.values.forEach((value, name) => {
          newValues.set(name, value);
          newPristine.set(name, true);
        });
      } else {
        state.inputs.forEach((_input, name) => {
          newValues.set(name, state.initialValues.get(name));
          newPristine.set(name, true);
        });
      }
      let newState: FormState = {
        ...state,
        values: newValues,
        isPristine: newPristine,
        formSubmitted: action.values ? state.formSubmitted : false,
      };
      newState = validateAll(newState);
      return newState;
    }

    case 'UPDATE_VALIDATIONS': {
      if (!state.inputs.has(action.name)) {
        return state;
      }
      const newInputs = new Map(state.inputs).set(action.name, action.config);
      return validateAll({ ...state, inputs: newInputs });
    }

    default:
      return state;
  }
}
