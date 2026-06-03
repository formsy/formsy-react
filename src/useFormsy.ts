import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { FormsyContext } from './FormsyContext';
import { RequiredValidation, ValidationError, Validations } from './interfaces';
import { InjectedProps, WrapperProps, WrapperState } from './withFormsy';
import * as utils from './utils';
import { isDefaultRequiredValue } from './validationRules';
import { isString } from './utils';

// Replicates the private helper from withFormsy
const convertValidationsToObject = <V>(validations: false | Validations<V>): Validations<V> => {
  if (isString(validations)) {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((acc, validation) => {
      let args: string[] = validation.split(':');
      const validateMethod: string = args.shift() || '';

      args = args.map((arg) => {
        try {
          return JSON.parse(arg);
          // oxlint-disable-next-line no-unused-vars
        } catch (_e) {
          return arg;
        }
      });

      if (args.length > 1) {
        throw new Error(
          'Formsy does not support multiple args on string validations. Use object format of validations instead.',
        );
      }

      const copy: Validations<V> = { ...acc };
      copy[validateMethod] = args.length ? args[0] : true;
      return copy;
    }, {});
  }

  return validations || {};
};

export interface UseFormsyOptions<V> extends WrapperProps<V> {}

export type UseFormsyResult<V> = InjectedProps<V> & { value: V };

/**
 * Hook alternative to the `withFormsy` HOC.
 *
 * Registers a field with the nearest `<Formsy>` form and returns the same
 * injected props that `withFormsy` would provide (value, setValue, errorMessage, …).
 *
 * @example
 * ```tsx
 * function MyInput({ name, label }: { name: string; label: string }) {
 *   const { value, setValue, showError, errorMessage } = useFormsy<string>({ name });
 *   return (
 *     <div>
 *       <label>{label}</label>
 *       <input value={value ?? ''} onChange={(e) => setValue(e.target.value)} />
 *       {showError && <span>{errorMessage}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFormsy<V>(options: UseFormsyOptions<V>): UseFormsyResult<V> {
  const { name, value: valueProp, validations: validationsProp, required: requiredProp } = options;

  const context = useContext(FormsyContext);

  const [state, setStateInternal] = useState<WrapperState<V>>(() => ({
    formSubmitted: false,
    isPristine: true,
    isRequired: false,
    isValid: true,
    pristineValue: valueProp as V,
    validationError: [],
    value: valueProp as V,
  }));

  // The form context calls setState / reads state on the component ref directly.
  // We create a mutable ref that mimics a class component instance.
  const componentRef = useRef<any>(null);

  if (componentRef.current === null) {
    componentRef.current = {
      props: { name, ...context },
      state: undefined as unknown as WrapperState<V>,
      // setState implementation that mirrors React class component behaviour,
      // including the optional callback argument the form uses internally.
      setState(updater: Partial<WrapperState<V>> | ((prev: WrapperState<V>) => Partial<WrapperState<V>>), callback?: () => void) {
        setStateInternal((prev) => {
          const patch = typeof updater === 'function' ? updater(prev) : updater;
          const next = { ...prev, ...patch };
          componentRef.current.state = next;
          return next;
        });
        if (callback) {
          // Schedule callback after the state update has been flushed.
          // We use a microtask so it runs after React has batched the update.
          Promise.resolve().then(callback);
        }
      },
      validations: {} as Validations<V>,
      requiredValidations: {} as Validations<V>,
    };
  }

  // Keep context props in sync on every render
  componentRef.current.props = { ...options, ...context };

  // Stable setValidations (matches the class method)
  const setValidations = useCallback(
    (validations: Validations<V> | undefined, required: RequiredValidation<V> | undefined): void => {
      componentRef.current.validations = convertValidationsToObject(validations as Validations<V>) || {};
      componentRef.current.requiredValidations =
        required === true
          ? { isDefaultRequiredValue: required }
          : convertValidationsToObject(required as Validations<V>);
    },
    [],
  );

  // Stable setValue (matches the class method)
  const setValue = useCallback(
    (value: V, validate = true): void => {
      if (!validate) {
        componentRef.current.setState({ value });
      } else {
        componentRef.current.setState({ value, isPristine: false }, () => {
          context.validate(componentRef.current);
        });
      }
    },
    [context],
  );

  const resetValue = useCallback((): void => {
    componentRef.current.setState(
      { value: componentRef.current.state.pristineValue, isPristine: true },
      () => {
        context.validate(componentRef.current);
      },
    );
  }, [context]);

  // Mount: initialise validations, run first validation, attach to form
  useEffect(() => {
    if (!name) {
      throw new Error('useFormsy requires a name option');
    }

    setValidations(validationsProp, requiredProp);

    // Seed the ref state with the initial value so runValidation can read it
    componentRef.current.state = {
      formSubmitted: false,
      isPristine: true,
      isRequired: false,
      isValid: true,
      pristineValue: valueProp as V,
      validationError: [],
      value: valueProp as V,
    };

    const initialValidation = context.runValidation(componentRef.current);
    const initialState: WrapperState<V> = {
      formSubmitted: false,
      isPristine: true,
      pristineValue: valueProp as V,
      value: valueProp as V,
      ...initialValidation,
    };
    componentRef.current.state = initialState;
    setStateInternal(initialState);

    context.attachToForm(componentRef.current);

    return () => {
      context.detachFromForm(componentRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (mirrors componentDidUpdate value check)
  const prevValueRef = useRef<V | undefined>(valueProp);
  useEffect(() => {
    if (!utils.isSame(valueProp, prevValueRef.current)) {
      prevValueRef.current = valueProp;
      setValue(valueProp as V);
    }
  }, [valueProp, setValue]);

  // Sync validations / required changes (mirrors componentDidUpdate validations check)
  const prevValidationsRef = useRef(validationsProp);
  const prevRequiredRef = useRef(requiredProp);
  useEffect(() => {
    if (
      !utils.isSame(validationsProp, prevValidationsRef.current) ||
      !utils.isSame(requiredProp, prevRequiredRef.current)
    ) {
      prevValidationsRef.current = validationsProp;
      prevRequiredRef.current = requiredProp;
      setValidations(validationsProp, requiredProp);
      context.validate(componentRef.current);
    }
  }, [validationsProp, requiredProp, setValidations, context]);

  // Keep componentRef.state in sync with React state so form reads are always fresh
  useEffect(() => {
    componentRef.current.state = state;
  }, [state]);

  // Derived values (mirrors the class getters)
  const errorMessages: ValidationError[] =
    !state.isValid || state.isRequired ? state.validationError || [] : [];
  const errorMessage: ValidationError = errorMessages.length ? errorMessages[0] : null;
  const showRequired = state.isRequired;
  const showError = !showRequired && !state.isValid;

  return {
    errorMessage,
    errorMessages,
    hasValue: isDefaultRequiredValue(state.value),
    isFormDisabled: context.isFormDisabled,
    isFormSubmitted: state.formSubmitted,
    isPristine: state.isPristine,
    isRequired: state.isRequired,
    isValid: state.isValid,
    isValidValue: (value: V) => context.isValidValue(componentRef.current, value),    resetValue,
    setValidations,
    setValue,
    showError,
    showRequired,
    value: state.value,
  };
}
