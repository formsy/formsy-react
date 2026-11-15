import { get, has, set } from 'lodash';
import React, {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { FormsyActionsContext, FormsyStateStore, FormsyStateStoreContext } from './FormsyContext';
import {
  FormsyImperativeAPI,
  IModel,
  InputRegistration,
  IResetModel,
  IUpdateInputsWithError,
  ValidationError,
} from './interfaces';
import * as utils from './utils';
import { formsyReducer, FormState } from './formsyReducer';
import { validationRules } from './validationRules';

type FormHTMLAttributesCleaned = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'>;

type OnSubmitCallback = (
  model: IModel,
  resetModel: IResetModel,
  updateInputsWithError: IUpdateInputsWithError,
  event: React.SyntheticEvent<HTMLFormElement>
) => void;

type FormElementType =
  | string
  | React.ComponentType<
      PropsWithChildren<{
        onReset?: (e: React.SyntheticEvent) => void;
        onSubmit?: (e: React.SyntheticEvent) => void;
        disabled?: boolean;
      }>
    >;

export interface FormsyProps extends FormHTMLAttributesCleaned {
  disabled?: boolean;
  mapping?: null | ((model: IModel) => IModel);
  onChange?: (model: IModel, isChanged: boolean) => void;
  onInvalid?: () => void;
  onReset?: () => void;
  onSubmit?: OnSubmitCallback;
  onValidSubmit?: OnSubmitCallback;
  onInvalidSubmit?: OnSubmitCallback;
  onValid?: () => void;
  preventDefaultSubmit?: boolean;
  preventExternalInvalidation?: boolean;
  validationErrors?: null | object;
  formElement?: FormElementType;
}

function getInitialState(): FormState {
  return {
    values: new Map(),
    initialValues: new Map(),
    errors: new Map(),
    isPristine: new Map(),
    isValid: new Map(),
    isRequired: new Map(),
    inputs: new Map(),
    formSubmitted: false,
    formIsValid: true,
    externalValidationErrors: new Map(),
    preventExternalInvalidation: false,
  };
}

function FormsyInner(props: PropsWithChildren<FormsyProps>, ref: React.Ref<FormsyImperativeAPI>) {
  const {
    children,
    mapping,
    onChange,
    onInvalid,
    onInvalidSubmit,
    onReset,
    onSubmit,
    onValid,
    onValidSubmit,
    preventDefaultSubmit = true,
    preventExternalInvalidation = false,
    validationErrors,
    disabled = false,
    formElement = 'form',
    ...nonFormsyProps
  } = props;

  const [formState, dispatch] = useReducer(formsyReducer, undefined, getInitialState);
  const stateStoreRef = useRef<
    FormsyStateStore & { state: FormState; disabled: boolean; listeners: Set<() => void> }
  >();
  if (!stateStoreRef.current) {
    const listeners = new Set<() => void>();
    stateStoreRef.current = {
      state: formState,
      disabled,
      listeners,
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      getState: () => stateStoreRef.current!.state,
      getDisabled: () => stateStoreRef.current!.disabled,
    };
  }
  const stateStore = stateStoreRef.current;
  const prevValidationErrorsRef = useRef<Record<string, ValidationError> | null | undefined>(null);
  const onChangeRef = useRef(onChange);
  const onValidRef = useRef(onValid);
  const onInvalidRef = useRef(onInvalid);
  const mappingRef = useRef(mapping);
  const disabledRef = useRef(disabled);
  const formStateRef = useRef(formState);

  onChangeRef.current = onChange;
  onValidRef.current = onValid;
  onInvalidRef.current = onInvalid;
  mappingRef.current = mapping;
  disabledRef.current = disabled;
  formStateRef.current = formState;

  const mapModel = useCallback((model: Record<string, any>): IModel => {
    const mappingFn = mappingRef.current;
    if (typeof mappingFn === 'function') {
      return mappingFn(model);
    }
    const returnModel: Record<string, any> = {};
    Object.keys(model).forEach((key) => {
      set(returnModel, key, model[key]);
    });
    return returnModel;
  }, []);

  const getPristineValues = useCallback((): Record<string, any> => {
    return Object.fromEntries(formState.initialValues);
  }, [formState.initialValues]);

  const handleReset = useCallback((model?: IModel) => {
    if (model) {
      const modelMap = new Map<string, any>();
      formStateRef.current.inputs.forEach((_input, name) => {
        if (has(model, name)) {
          modelMap.set(name, get(model, name));
        }
      });
      dispatch({ type: 'RESET', values: modelMap });
    } else {
      dispatch({ type: 'RESET' });
    }
  }, []);

  const handleUpdateInputsWithError: IUpdateInputsWithError = useCallback(
    (errors, invalidate) => {
      const errorsMap = new Map<string, any>();
      Object.entries(errors).forEach(([name, error]) => {
        if (!formStateRef.current.inputs.has(name) && invalidate === true) {
          throw new Error(
            `You are trying to update an input that does not exist. Verify errors object with input names. ${JSON.stringify(errors)}`
          );
        }
        errorsMap.set(name, error);
      });
      dispatch({
        type: 'SET_EXTERNAL_ERRORS',
        errors: errorsMap,
        preventInvalidation: preventExternalInvalidation,
      });
    },
    [preventExternalInvalidation]
  );

  const handleUpdateInputsWithValue = useCallback(
    (data: Record<string, any>, validate = true) => {
      const valuesToSet = new Map<string, any>();
      formState.inputs.forEach((_input, name) => {
        if (data && has(data, name)) {
          valuesToSet.set(name, get(data, name));
        }
      });
      if (valuesToSet.size > 0) {
        dispatch({ type: 'SET_VALUES', values: valuesToSet, validate });
      }
    },
    [formState.inputs]
  );

  const handleSubmit = useCallback(
    (event?: React.SyntheticEvent<HTMLFormElement>) => {
      const currentState = formStateRef.current;
      const { formIsValid } = currentState;

      if (preventDefaultSubmit && event?.preventDefault) {
        event.preventDefault();
      }

      dispatch({ type: 'SET_SUBMITTED', submitted: true });

      const model = mapModel(Object.fromEntries(currentState.values));
      const submitEvent = event as React.SyntheticEvent<HTMLFormElement>;
      onSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);

      if (formIsValid) {
        onValidSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);
      } else {
        onInvalidSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);
      }
    },
    [preventDefaultSubmit, onSubmit, onValidSubmit, onInvalidSubmit, handleReset, handleUpdateInputsWithError, mapModel]
  );

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: handleReset,
    updateInputsWithValue: handleUpdateInputsWithValue,
    updateInputsWithError: handleUpdateInputsWithError,
    isChanged: () => !utils.isSame(getPristineValues(), Object.fromEntries(formStateRef.current.values)),
    getModel: () => mapModel(Object.fromEntries(formStateRef.current.values)),
    getPristineValues: () => getPristineValues(),
    getCurrentValues: () => Object.fromEntries(formStateRef.current.values),
  }));

  const canChangeRef = useRef(false);
  const initialEventsFired = useRef(false);

  // Set canChange after mount to prevent initial registrations from firing onChange.
  useEffect(() => {
    canChangeRef.current = true;
  }, []);

  // Each committed registration, validation change, or removal completes a
  // validation pass. Notify consumers once that pass has committed.
  useEffect(() => {
    if (formState.inputs.size > 0) {
      initialEventsFired.current = true;
      if (formState.formIsValid) {
        onValidRef.current?.();
      } else {
        onInvalidRef.current?.();
      }
    } else if (initialEventsFired.current) {
      onValidRef.current?.();
    }
  }, [formState.inputs, formState.formIsValid]);

  useLayoutEffect(() => {
    // Publish only committed state. Mutating an external store during render
    // can expose an abandoned concurrent render to subscribers.
    stateStore.state = formState;
    stateStore.disabled = disabled;
    stateStore.listeners.forEach((listener) => listener());
  }, [stateStore, formState, disabled]);

  const handleSetValue = useCallback(
    (name: string, value: any, validate: boolean = true) => {
      dispatch({ type: 'SET_VALUE', name, value, validate });
      if (canChangeRef.current) {
        const state = formStateRef.current;
        const newValues = new Map(state.values);
        newValues.set(name, value);
        const model = mapModel(Object.fromEntries(newValues));
        const changed = !utils.isSame(Object.fromEntries(state.initialValues), Object.fromEntries(newValues));
        onChangeRef.current?.(model, changed);
      }
    },
    [mapModel]
  );

  const handleRegisterInput = useCallback(
    (name: string, config: InputRegistration, initialValue: any) => {
      dispatch({ type: 'REGISTER', name, config, initialValue });
      if (canChangeRef.current) {
        const state = formStateRef.current;
        const newValues = new Map(state.values);
        newValues.set(name, initialValue);
        const newInitialValues = new Map(state.initialValues);
        if (!newInitialValues.has(name)) {
          newInitialValues.set(name, initialValue);
        }
        const model = mapModel(Object.fromEntries(newValues));
        const changed = !utils.isSame(Object.fromEntries(newInitialValues), Object.fromEntries(newValues));
        onChangeRef.current?.(model, changed);
      }
    },
    [mapModel]
  );

  const handleUnregisterInput = useCallback(
    (name: string) => {
      dispatch({ type: 'UNREGISTER', name });
      if (canChangeRef.current) {
        const state = formStateRef.current;
        const newValues = new Map(state.values);
        newValues.delete(name);
        const model = mapModel(Object.fromEntries(newValues));
        onChangeRef.current?.(model, true);
      }
    },
    [mapModel]
  );

  const handleResetValue = useCallback((name: string) => {
    const currentState = formStateRef.current;
    const modelMap = new Map<string, any>();
    modelMap.set(name, currentState.initialValues.get(name));
    dispatch({ type: 'RESET', values: modelMap });
  }, []);

  const handleUpdateValidations = useCallback((name: string, config: InputRegistration) => {
    dispatch({ type: 'UPDATE_VALIDATIONS', name, config });
  }, []);

  const handleIsValidValue = useCallback((name: string, value: any): boolean => {
    const state = formStateRef.current;
    const input = state.inputs.get(name);
    if (!input) return true;
    const allValues = Object.fromEntries(new Map(state.values).set(name, value));
    const results = utils.runRules(value, allValues, input.validations || {}, validationRules);
    return !results.failed.length;
  }, []);

  useEffect(() => {
    if (validationErrors && utils.isObject(validationErrors) && Object.keys(validationErrors).length > 0) {
      prevValidationErrorsRef.current = validationErrors as Record<string, ValidationError>;
      const errorsMap = new Map<string, any>();
      Object.keys(validationErrors).forEach((key) => {
        errorsMap.set(key, (validationErrors as Record<string, any>)[key]);
      });
      dispatch({
        type: 'SET_EXTERNAL_ERRORS',
        errors: errorsMap,
        preventInvalidation: preventExternalInvalidation,
      });
    } else if (prevValidationErrorsRef.current) {
      prevValidationErrorsRef.current = null;
      dispatch({
        type: 'SET_EXTERNAL_ERRORS',
        errors: new Map(),
        preventInvalidation: preventExternalInvalidation,
      });
    }
  }, [validationErrors, preventExternalInvalidation]);

  const actions = useMemo(
    () => ({
      setValue: handleSetValue,
      registerInput: handleRegisterInput,
      unregisterInput: handleUnregisterInput,
      resetValue: handleResetValue,
      updateValidations: handleUpdateValidations,
      isValidValue: handleIsValidValue,
    }),
    [
      handleIsValidValue,
      handleRegisterInput,
      handleResetValue,
      handleSetValue,
      handleUnregisterInput,
      handleUpdateValidations,
    ]
  );

  const FormElement = formElement;
  return (
    <FormsyActionsContext.Provider value={actions}>
      <FormsyStateStoreContext.Provider value={stateStore}>
        <FormElement
          onReset={(e: React.SyntheticEvent) => {
            e.preventDefault();
            handleReset();
            onReset?.();
          }}
          onSubmit={handleSubmit}
          {...nonFormsyProps}
          disabled={disabled}
        >
          {children}
        </FormElement>
      </FormsyStateStoreContext.Provider>
    </FormsyActionsContext.Provider>
  );
}

FormsyInner.displayName = 'Formsy';

const Formsy = forwardRef<FormsyImperativeAPI, PropsWithChildren<FormsyProps>>(FormsyInner);
Formsy.displayName = 'Formsy';

export default Formsy;
export { FormsyInner as Formsy };
