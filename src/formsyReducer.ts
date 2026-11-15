import { InputRegistration, Validations, ValidationError } from './interfaces';
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
  | { type: 'VALIDATE' }
  | { type: 'RESET'; values?: Map<string, any> }
  | { type: 'UPDATE_VALIDATIONS'; name: string; config: InputRegistration };

function runSingleValidation(
  value: any,
  currentValues: Record<string, any>,
  input: InputRegistration,
  externalError?: ValidationError
): { isRequired: boolean; isValid: boolean; validationError: ValidationError[] } {
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
      return [externalError];
    }

    if (isRequired) {
      const error = validationErrors[requiredResults.success[0]] || componentValidationError;
      return error ? [error] : [];
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

function validateFields(state: FormState, names: Iterable<string>): FormState {
  const newErrors = new Map(state.errors);
  const newIsValid = new Map(state.isValid);
  const newIsRequired = new Map(state.isRequired);
  let formIsValid = true;

  if (state.inputs.size > 0) {
    const currentValues = Object.fromEntries(state.values);
    for (const name of names) {
      const input = state.inputs.get(name);
      if (!input) {
        continue;
      }
      const value = state.values.get(name);
      const externalError = state.externalValidationErrors.get(name);
      const result = runSingleValidation(value, currentValues, input, externalError);
      const prevented = state.preventExternalInvalidation && state.externalValidationErrors.has(name);
      newErrors.set(name, result.validationError);
      newIsValid.set(name, prevented ? true : result.isValid);
      newIsRequired.set(name, result.isRequired);
    }
  }

  state.inputs.forEach((_input, inputName) => {
    if (newIsValid.get(inputName) === false) {
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

function validateAll(state: FormState): FormState {
  return validateFields(state, state.inputs.keys());
}

/**
 * Inputs whose validation results can depend on values other than their own:
 * `equalsField`, custom function rules, and rules registered through
 * `addValidationRule` (which may read the full values object) all receive the
 * values object. Built-in rules otherwise only read the field's own value, so
 * a change to one field does not require revalidating them.
 */
const BUILT_IN_RULES = new Set(Object.keys(validationRules));
const dynamicInputCache = new WeakMap<InputRegistration, boolean>();

function hasCrossFieldRules(validations: Validations<any>): boolean {
  if (!validations || typeof validations !== 'object') {
    return false;
  }
  return Object.keys(validations).some(
    (ruleName) =>
      ruleName === 'equalsField' ||
      !BUILT_IN_RULES.has(ruleName) ||
      utils.isFunction((validations as Record<string, unknown>)[ruleName])
  );
}

function isDynamicInput(input: InputRegistration): boolean {
  let dynamic = dynamicInputCache.get(input);
  if (dynamic === undefined) {
    dynamic = hasCrossFieldRules(input.validations) || hasCrossFieldRules(input.requiredValidations);
    dynamicInputCache.set(input, dynamic);
  }
  return dynamic;
}

/** Names to revalidate after `changedNames` received new values. */
function namesToValidate(state: FormState, changedNames: Iterable<string>): string[] {
  const names = Array.from(changedNames);
  const changed = new Set(names);
  state.inputs.forEach((input, name) => {
    if (!changed.has(name) && isDynamicInput(input)) {
      names.push(name);
    }
  });
  return names;
}

function isSameErrorsMap(a: Map<string, any>, b: Map<string, any>): boolean {
  if (a === b) {
    return true;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (const [key, value] of b) {
    if (!a.has(key) || !utils.isSame(a.get(key), value)) {
      return false;
    }
  }
  return true;
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
      let externalValidationErrors = state.externalValidationErrors;
      if (externalValidationErrors.has(action.name)) {
        externalValidationErrors = new Map(externalValidationErrors);
        externalValidationErrors.delete(action.name);
      }
      const newState: FormState = {
        ...state,
        values: newValues,
        isPristine: newPristine,
        externalValidationErrors,
      };
      if (!action.validate) {
        return newState;
      }
      return validateFields(newState, namesToValidate(newState, [action.name]));
    }

    case 'SET_VALUES': {
      const newValues = new Map(state.values);
      action.values.forEach((value, name) => {
        newValues.set(name, value);
      });
      const newState = { ...state, values: newValues };
      if (!action.validate) {
        return newState;
      }
      return validateFields(newState, namesToValidate(newState, action.values.keys()));
    }

    case 'SET_SUBMITTED': {
      return { ...state, formSubmitted: action.submitted };
    }

    case 'SET_EXTERNAL_ERRORS': {
      const { errors, preventInvalidation } = action;
      if (
        preventInvalidation === state.preventExternalInvalidation &&
        isSameErrorsMap(state.externalValidationErrors, errors)
      ) {
        // Value-equal errors (e.g. from an inline object literal re-render)
        // must not trigger a full revalidation pass.
        return state;
      }
      return validateAll({
        ...state,
        externalValidationErrors: errors,
        preventExternalInvalidation: preventInvalidation,
      });
    }

    case 'VALIDATE': {
      return validateAll(state);
    }

    case 'RESET': {
      const newValues = new Map(state.values);
      const newPristine = new Map(state.isPristine);
      let changedNames: Iterable<string> | undefined;
      if (action.values) {
        changedNames = action.values.keys();
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
      const newState: FormState = {
        ...state,
        values: newValues,
        isPristine: newPristine,
        formSubmitted: action.values ? state.formSubmitted : false,
      };
      return changedNames ? validateFields(newState, namesToValidate(newState, changedNames)) : validateAll(newState);
    }

    case 'UPDATE_VALIDATIONS': {
      const existing = state.inputs.get(action.name);
      if (!existing) {
        return state;
      }
      // Value-equal configs (e.g. from inline object literals on re-render)
      // must not trigger a full revalidation pass.
      if (utils.isSame(existing, action.config)) {
        return state;
      }
      const newInputs = new Map(state.inputs).set(action.name, action.config);
      return validateAll({ ...state, inputs: newInputs });
    }

    default:
      return state;
  }
}
