import React from 'react';
import PropTypes from 'prop-types';

import * as utils from './utils';
import { RequiredValidation, Validations, WrappedComponentClass } from './interfaces';
import FormsyContext from './FormsyContext';

/* eslint-disable react/default-props-match-prop-types */

const convertValidationsToObject = <V>(validations: false | Validations<V>): Validations<V> => {
  if (typeof validations === 'string') {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation) => {
      let args = validation.split(':');
      const validateMethod = args.shift();

      if (typeof validateMethod !== 'string') {
        throw new Error('Formsy encountered unexpected problem parsing validation string');
      }

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
  innerRef?: (ref: any) => void;
  name: string;
  required?: RequiredValidation<V>;
  validationError?: any;
  validationErrors?: any;
  validations?: Validations<V>;
  value?: V;
}

export interface WrapperState<V> {
  [key: string]: unknown;
  externalError: null;
  formSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  pristineValue: any;
  validationError: any[];
  value: V;
}

export interface InjectedProps<V> {
  errorMessage: any;
  errorMessages: any;
  hasValue: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isValidValue: (value: V) => boolean;
  ref?: any;
  resetValue: any;
  setValidations: any;
  setValue: (value: V) => void;
  showError: boolean;
  showRequired: boolean;
}

export type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;

export { propTypes };

function getDisplayName(component: WrappedComponentClass) {
  return (
    (component as { displayName?: string }).displayName ||
    component.name ||
    (typeof component === 'string' ? component : 'Component')
  );
}

export default function<T, V>(
  WrappedComponent: React.ComponentType<T & PassDownProps<V>>,
): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>> {
  return class extends React.Component<T & WrapperProps<V>, WrapperState<V>> {
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
      value: (WrappedComponent as any).defaultValue,
    };

    public constructor(props) {
      super(props);
      this.state = {
        externalError: null,
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
      const isPropsChanged = Object.keys(props).some(k => props[k] !== nextProps[k]);

      const isStateChanged = Object.keys(state).some(k => state[k] !== nextState[k]);

      const isFormsyContextChanged = Object.keys(context).some(k => context[k] !== nextContext[k]);

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
    // eslint-disable-next-line react/sort-comp
    public componentWillUnmount() {
      const { detachFromForm } = this.context;
      detachFromForm(this);
    }

    public getErrorMessage = () => {
      const messages = this.getErrorMessages();
      return messages.length ? messages[0] : null;
    };

    public getErrorMessages = () => {
      const { externalError, validationError } = this.state;

      if (!this.isValid() || this.showRequired()) {
        return externalError || validationError || [];
      }
      return [];
    };

    // eslint-disable-next-line react/destructuring-assignment
    public getValue = () => this.state.value;

    public setValidations = (validations: Validations<V>, required: RequiredValidation<V>) => {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations =
        required === true ? { isDefaultRequiredValue: required } : convertValidationsToObject(required);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    public setValue = (value: any, validate = true) => {
      if (!validate) {
        this.setState({
          value,
        });
      } else {
        this.setState(
          {
            value,
            isPristine: false,
          },
          () => {
            this.context.validate(this); //eslint-disable-line
          },
        );
      }
    };

    // eslint-disable-next-line react/destructuring-assignment
    public hasValue = () => {
      const { value } = this.state;
      if (typeof value === 'string') {
        return value !== '';
      }
      return value !== undefined;
    };

    // eslint-disable-next-line react/destructuring-assignment
    public isFormDisabled = () => this.context.isFormDisabled;

    // eslint-disable-next-line react/destructuring-assignment
    public isFormSubmitted = () => this.state.formSubmitted;

    // eslint-disable-next-line react/destructuring-assignment
    public isPristine = () => this.state.isPristine;

    // eslint-disable-next-line react/destructuring-assignment
    public isRequired = () => !!this.props.required;

    // eslint-disable-next-line react/destructuring-assignment
    public isValid = () => this.state.isValid;

    // eslint-disable-next-line react/destructuring-assignment
    public isValidValue = value => this.context.isValidValue(this, value);

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

    public showError = () => !this.showRequired() && !this.isValid();

    // eslint-disable-next-line react/destructuring-assignment
    public showRequired = () => this.state.isRequired;

    public render() {
      const { innerRef } = this.props;
      const propsForElement: PassDownProps<V> = {
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

      return React.createElement(WrappedComponent, propsForElement as any);
    }
  };
}
