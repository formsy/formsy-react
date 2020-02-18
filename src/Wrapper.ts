import React from 'react';
import PropTypes from 'prop-types';

import * as utils from './utils';
import FormsyContext from './FormsyContext';
import {
  ComponentWithStaticAttributes,
  RequiredValidation,
  ValidationError,
  Validations,
  WrappedComponentClass,
} from './interfaces';
import { isString } from './utils';

/* eslint-disable react/default-props-match-prop-types */

const convertValidationsToObject = <V>(validations: false | Validations<V>): Validations<V> => {
  if (isString(validations)) {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation) => {
      let args: string[] = validation.split(':');
      const validateMethod: string = args.shift();

      args = args.map(arg => {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error(
          'Formsy does not support multiple args on string validations. Use object format of validations instead.',
        );
      }

      // Avoid parameter reassignment
      const validationsAccumulatorCopy: Validations<V> = { ...validationsAccumulator };
      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

const propTypes = {
  innerRef: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]),
  validations: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export interface WrapperProps<V> {
  innerRef?: (ref: React.Ref<any>) => void;
  name: string;
  required?: RequiredValidation<V>;
  validationError?: ValidationError;
  validationErrors?: { [key: string]: ValidationError };
  validations?: Validations<V>;
  value?: V;
}

export interface WrapperState<V> {
  [key: string]: unknown;
  formSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  pristineValue: V;
  validationError: ValidationError[];
  value: V;
}

export interface InjectedProps<V> {
  errorMessage: ValidationError;
  errorMessages: ValidationError[];
  hasValue: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isValidValue: (value: V) => boolean;
  ref?: React.Ref<any>;
  resetValue: () => void;
  setValidations: (validations: Validations<V>, required: RequiredValidation<V>) => void;
  setValue: (value: V) => void;
  showError: boolean;
  showRequired: boolean;
}

export interface WrapperInstanceMethods<V> {
  getErrorMessage: () => null | ValidationError;
  getErrorMessages: () => ValidationError[];
  getValue: () => V;
  isFormDisabled: () => boolean;
  isValid: () => boolean;
  setValue: (value: V) => void;
}

export type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;

export { propTypes };

function getDisplayName(component: WrappedComponentClass) {
  return component.displayName || component.name || (utils.isString(component) ? component : 'Component');
}

export default function<T, V>(
  WrappedComponent: React.ComponentType<T & PassDownProps<V>>,
): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>> {
  return class extends React.Component<T & WrapperProps<V>, WrapperState<V>> implements WrapperInstanceMethods<V> {
    // eslint-disable-next-line react/sort-comp
    public static contextType = FormsyContext;

    public validations?: Validations<V>;

    public requiredValidations?: Validations<V>;

    public context: React.ContextType<typeof FormsyContext>;

    public static displayName = `Formsy(${getDisplayName(WrappedComponent)})`;

    public static propTypes: any = propTypes;

    public static defaultProps: any = {
      innerRef: null,
      required: false,
      validationError: '',
      validationErrors: {},
      validations: null,
      value: (WrappedComponent as ComponentWithStaticAttributes).defaultValue,
    };

    public constructor(props) {
      super(props);
      this.state = {
        formSubmitted: false,
        isPristine: true,
        isRequired: false,
        isValid: true,
        pristineValue: props.value,
        validationError: [],
        value: props.value,
      };
    }

    public componentDidMount() {
      const { validations, required, name } = this.props;
      const { attachToForm } = this.context;

      if (!name) {
        throw new Error('Form Input requires a name property when used');
      }

      this.setValidations(validations, required);

      // Pass a function instead?
      attachToForm(this);
    }

    public shouldComponentUpdate(nextProps, nextState, nextContext) {
      const { props, state, context } = this;
      const isChanged = (a: object, b: object): boolean => Object.keys(a).some(k => a[k] !== b[k]);
      const isPropsChanged = isChanged(props, nextProps);
      const isStateChanged = isChanged(state, nextState);
      const isFormsyContextChanged = isChanged(context, nextContext);

      return isPropsChanged || isStateChanged || isFormsyContextChanged;
    }

    public componentDidUpdate(prevProps) {
      const { value, validations, required } = this.props;
      const { validate } = this.context;

      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(value, prevProps.value)) {
        this.setValue(value);
      }

      // If validations or required is changed, run a new validation
      if (!utils.isSame(validations, prevProps.validations) || !utils.isSame(required, prevProps.required)) {
        this.setValidations(validations, required);
        validate(this);
      }
    }

    // Detach it when component unmounts
    public componentWillUnmount() {
      const { detachFromForm } = this.context;
      detachFromForm(this);
    }

    public getErrorMessage = (): ValidationError | null => {
      const messages = this.getErrorMessages();
      return messages.length ? messages[0] : null;
    };

    public getErrorMessages = (): ValidationError[] => {
      const { validationError } = this.state;

      if (!this.isValid() || this.showRequired()) {
        return validationError || [];
      }
      return [];
    };

    // eslint-disable-next-line react/destructuring-assignment
    public getValue = (): V => this.state.value;

    public setValidations = (validations: Validations<V>, required: RequiredValidation<V>): void => {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations =
        required === true ? { isDefaultRequiredValue: required } : convertValidationsToObject(required);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    public setValue = (value: V, validate = true): void => {
      const { validate: validateForm } = this.context;

      if (!validate) {
        this.setState({ value });
      } else {
        this.setState(
          {
            value,
            isPristine: false,
          },
          () => {
            validateForm(this);
          },
        );
      }
    };

    // eslint-disable-next-line react/destructuring-assignment
    public hasValue = () => {
      const { value } = this.state;
      if (isString(value)) {
        return value !== '';
      }
      return value !== undefined;
    };

    // eslint-disable-next-line react/destructuring-assignment
    public isFormDisabled = (): boolean => this.context.isFormDisabled;

    // eslint-disable-next-line react/destructuring-assignment
    public isFormSubmitted = (): boolean => this.state.formSubmitted;

    // eslint-disable-next-line react/destructuring-assignment
    public isPristine = (): boolean => this.state.isPristine;

    // eslint-disable-next-line react/destructuring-assignment
    public isRequired = (): boolean => !!this.props.required;

    // eslint-disable-next-line react/destructuring-assignment
    public isValid = (): boolean => this.state.isValid;

    // eslint-disable-next-line react/destructuring-assignment
    public isValidValue = (value: V) => this.context.isValidValue(this, value);

    public resetValue = () => {
      const { pristineValue } = this.state;
      const { validate } = this.context;

      this.setState(
        {
          value: pristineValue,
          isPristine: true,
        },
        () => {
          validate(this);
        },
      );
    };

    public showError = (): boolean => !this.showRequired() && !this.isValid();

    // eslint-disable-next-line react/destructuring-assignment
    public showRequired = (): boolean => this.state.isRequired;

    public render() {
      const { innerRef } = this.props;
      const propsForElement: T & PassDownProps<V> = {
        ...this.props,
        errorMessage: this.getErrorMessage(),
        errorMessages: this.getErrorMessages(),
        hasValue: this.hasValue(),
        isFormDisabled: this.isFormDisabled(),
        isFormSubmitted: this.isFormSubmitted(),
        isPristine: this.isPristine(),
        isRequired: this.isRequired(),
        isValid: this.isValid(),
        isValidValue: this.isValidValue,
        resetValue: this.resetValue,
        setValidations: this.setValidations,
        setValue: this.setValue,
        showError: this.showError(),
        showRequired: this.showRequired(),
        value: this.getValue(),
      };

      if (innerRef) {
        propsForElement.ref = innerRef;
      }

      return React.createElement(WrappedComponent, propsForElement);
    }
  };
}
