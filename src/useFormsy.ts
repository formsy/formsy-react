import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { FormsyActionsContext, FormsyStateStoreContext } from './FormsyContext';
import { InputRegistration, ValidationError, Validations, RequiredValidation } from './interfaces';
import * as utils from './utils';
import { isDefaultRequiredValue, validationRules } from './validationRules';

const EMPTY_ERRORS: ValidationError[] = [];

interface InputSnapshot {
  value: any;
  errors: ValidationError[];
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
}

function areSnapshotsEqual(a: InputSnapshot, b: InputSnapshot) {
  return (
    Object.is(a.value, b.value) &&
    a.isPristine === b.isPristine &&
    a.isRequired === b.isRequired &&
    a.isValid === b.isValid &&
    a.isFormDisabled === b.isFormDisabled &&
    a.isFormSubmitted === b.isFormSubmitted &&
    a.errors.length === b.errors.length &&
    a.errors.every((error, index) => error === b.errors[index])
  );
}

interface UseFormsyProps<V = any> {
  name: string;
  value?: V;
  validations?: Validations<V>;
  required?: RequiredValidation<V>;
  validationError?: ValidationError;
  validationErrors?: { [key: string]: ValidationError };
}

export interface UseFormsyOutput<V = any> {
  value: V;
  setValue: (value: V, validate?: boolean) => void;
  errorMessage: ValidationError | null;
  errorMessages: ValidationError[];
  hasValue: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isValidValue: (value: V) => boolean;
  resetValue: () => void;
  setValidations: (validations: Validations<V>, required: RequiredValidation<V>) => void;
  showError: boolean;
  showRequired: boolean;
}

const convertValidationsToObject = <V>(validations: false | Validations<V>): Validations<V> => {
  if (utils.isString(validations)) {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation) => {
      let args: string[] = validation.split(':');
      const validateMethod: string = args.shift() || '';
      args = args.map((arg) => {
        try {
          return JSON.parse(arg);
        } catch {
          return arg;
        }
      });
      if (args.length > 1) {
        throw new Error(
          'Formsy does not support multiple args on string validations. Use object format of validations instead.'
        );
      }
      const validationsAccumulatorCopy: Validations<V> = { ...validationsAccumulator };
      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }
  return validations || {};
};

const convertRequired = <V>(required: RequiredValidation<V>): Validations<V> => {
  if (required === true) {
    return { isDefaultRequiredValue: true };
  }
  return convertValidationsToObject(required);
};

function computeLocalValidation<V>(
  value: V,
  validations: Validations<V>,
  requiredValidations: Validations<V>,
  validationError?: ValidationError,
  validationErrors?: Record<string, ValidationError>
): { isRequired: boolean; isValid: boolean; errors: ValidationError[] } {
  const currentValues: Record<string, any> = {};
  const validationResults = utils.runRules(value, currentValues, validations || {}, validationRules);
  const requiredResults = utils.runRules(value, currentValues, requiredValidations || {}, validationRules);
  const isRequired = Object.keys(requiredValidations || {}).length ? !!requiredResults.success.length : false;
  const isCustomValid = !validationResults.failed.length;
  const isValid = isRequired ? false : isCustomValid;

  const errors: ValidationError[] = (() => {
    if (isValid && !isRequired) {
      return [];
    }

    if (validationResults.errors.length) {
      return validationResults.errors;
    }

    if (isRequired) {
      const error = (validationErrors || {})[requiredResults.success[0]] || validationError;
      return error ? [error] : [];
    }

    if (validationResults.failed.length) {
      return validationResults.failed
        .map((failed) => (validationErrors || {})[failed] || validationError)
        .filter((x, pos, arr) => arr.indexOf(x) === pos)
        .filter(Boolean) as ValidationError[];
    }

    return [];
  })();

  return { isRequired, isValid, errors };
}

export function useFormsy<V = any>(props: UseFormsyProps<V>): UseFormsyOutput<V> {
  const actions = useContext(FormsyActionsContext);
  const stateStore = useContext(FormsyStateStoreContext);
  const {
    isValidValue: validateValue,
    registerInput,
    resetValue: resetFieldValue,
    setValue: setFieldValue,
    unregisterInput,
    updateValidations,
  } = actions;
  const { name, value: externalValue, validations, required, validationError, validationErrors } = props;
  const prevExternalValue = useRef(externalValue);
  const previousSnapshot = useRef<InputSnapshot | null>(null);
  const registrationRef = useRef<InputRegistration>();
  const localValCacheRef = useRef({ isRequired: false, isValid: true, errors: EMPTY_ERRORS });

  const parsedValidations = useMemo(() => convertValidationsToObject(validations), [validations]);
  const parsedRequired = useMemo(() => convertRequired(required), [required]);

  if (!name) {
    throw new Error('Form Input requires a name property when used');
  }

  if (!registrationRef.current) {
    registrationRef.current = {
      validations: parsedValidations,
      requiredValidations: parsedRequired,
      validationError,
      validationErrors,
    };
  }

  const getSnapshot = useCallback((): InputSnapshot | null => {
    const state = stateStore.getState();
    if (!state.inputs.has(name)) {
      previousSnapshot.current = null;
      return null;
    }

    const snapshot: InputSnapshot = {
      value: state.values.get(name),
      errors: state.errors.get(name) || EMPTY_ERRORS,
      isPristine: state.isPristine.get(name) ?? true,
      isRequired: state.isRequired.get(name) ?? false,
      isValid: state.isValid.get(name) ?? true,
      isFormDisabled: stateStore.getDisabled(),
      isFormSubmitted: state.formSubmitted,
    };
    if (previousSnapshot.current && areSnapshotsEqual(previousSnapshot.current, snapshot)) {
      return previousSnapshot.current;
    }
    previousSnapshot.current = snapshot;
    return snapshot;
  }, [name, stateStore]);

  const fieldState = useSyncExternalStore(stateStore.subscribe, getSnapshot, getSnapshot);

  useLayoutEffect(() => {
    registerInput(name, registrationRef.current!, prevExternalValue.current);
    prevExternalValue.current = externalValue;
    return () => {
      unregisterInput(name);
    };
    // Input registration is intentionally mount-only; prop changes use the
    // value and validation effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    if (!utils.isSame(externalValue, prevExternalValue.current)) {
      prevExternalValue.current = externalValue;
      if (externalValue !== undefined) {
        // Skip echoes of our own setValue: when a form is controlled through
        // onChange, the value we just set is passed back via the `value` prop
        // in the same commit. Pushing it again would fire a duplicate
        // onChange for an unchanged value.
        const formValue = stateStore.getState().values.get(name);
        if (formValue !== undefined && utils.isSame(formValue, externalValue)) {
          return;
        }
        setFieldValue(name, externalValue);
      }
    }
  }, [externalValue, name, setFieldValue, stateStore]);

  useLayoutEffect(() => {
    updateValidations(name, {
      validations: parsedValidations,
      requiredValidations: parsedRequired,
      validationError,
      validationErrors,
    });
  }, [updateValidations, name, parsedValidations, parsedRequired, validationError, validationErrors]);

  // Only compute local validation while the input is not registered with the
  // form yet; afterwards the reducer-driven snapshot is authoritative.
  const localVal = useMemo((): { isRequired: boolean; isValid: boolean; errors: ValidationError[] } => {
    if (fieldState) {
      return localValCacheRef.current;
    }
    localValCacheRef.current = computeLocalValidation(
      externalValue,
      parsedValidations,
      parsedRequired,
      validationError,
      validationErrors as Record<string, ValidationError>
    );
    return localValCacheRef.current;
  }, [fieldState, externalValue, parsedValidations, parsedRequired, validationError, validationErrors]);

  const inputValue = fieldState ? fieldState.value : externalValue;
  const errors = fieldState ? fieldState.errors : localVal.errors;
  const isPristine = fieldState ? fieldState.isPristine : true;
  const isValid = fieldState ? fieldState.isValid : localVal.isValid;
  const isRequired = fieldState ? fieldState.isRequired : localVal.isRequired;

  const setValue = useCallback(
    (value: V, validate = true) => {
      setFieldValue(name, value, validate);
    },
    [name, setFieldValue]
  );

  const resetValue = useCallback(() => {
    resetFieldValue(name);
  }, [name, resetFieldValue]);

  const isValidValue = useCallback((value: V) => validateValue(name, value), [name, validateValue]);

  const setValidations = useCallback(
    (validations: Validations<V>, required: RequiredValidation<V>) => {
      updateValidations(name, {
        validations: convertValidationsToObject(validations),
        requiredValidations: convertRequired(required),
        validationError,
        validationErrors,
      });
    },
    [name, updateValidations, validationError, validationErrors]
  );

  return {
    value: inputValue as V,
    setValue,
    errorMessage: errors.length ? errors[0] : null,
    errorMessages: errors.length ? errors : EMPTY_ERRORS,
    hasValue: !isDefaultRequiredValue(inputValue),
    isFormDisabled: fieldState?.isFormDisabled ?? stateStore.getDisabled(),
    isFormSubmitted: fieldState?.isFormSubmitted ?? false,
    isPristine,
    isRequired,
    isValid,
    isValidValue,
    resetValue,
    setValidations,
    showError: !isRequired && !isValid,
    showRequired: isRequired,
  };
}
