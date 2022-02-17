import React from 'react';
import PropTypes from 'prop-types';

import utils from './utils';
import { Validations, WrappedComponentClass, RequiredValidation, Value } from './interfaces';
import validationRules from './validationRules';

/* eslint-disable react/default-props-match-prop-types */

const convertValidationsToObject = (validations: string | false | Validations): Validations => {
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
      const validationsAccumulatorCopy: Validations = Object.assign({}, validationsAccumulator);
      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

// Returns true if any of input validation values is a promise function
const checkHasAsyncValidation = (validations: Validations): boolean => {
  return Object.keys(validations).some(validationKey => {
    const validationsValue = validations[validationKey];
    // when validationsValue is directly a function
    if (utils.isPromiseFunction(validationsValue)) {
      return true;
    }
    // checking if rule exists against validationKey
    const validationRulesVal = validationRules[validationKey];
    if (typeof validationsValue !== 'function' && utils.isPromiseFunction(validationRulesVal)) {
      return true;
    }
    return false;
  });
};

const propTypes = {
  innerRef: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]),
  validations: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export interface WrapperProps {
  innerRef?: (ref: any) => void;
  name: string;
  required?: RequiredValidation;
  isRequired?: RequiredValidation;
  validationError?: any;
  validationErrors?: any;
  validations?: Validations | string;
  value?: Value;
}

export interface WrapperState {
  [key: string]: unknown;
  externalError: null;
  formSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  pristineValue: any;
  validationError: any[];
  value: any;
  isValidationInProgress: boolean;
  hasAsyncValidation?: boolean;
}

export interface PassDownProps extends WrapperProps {
  errorMessage: any;
  errorMessages: any;
  getValue: () => Value;
  hasValue: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isValidValue: (value: Value) => boolean;
  ref?: any;
  resetValue: any;
  setValidations: any;
  setValue: (value: Value, validate?: boolean, otherData?: Record<string, any>) => void;
  showError: boolean;
  showRequired: boolean;
  isValidationInProgress: boolean;
  hasAsyncValidation?: boolean;
}

export { propTypes };

function getDisplayName(component: WrappedComponentClass) {
  return (
    (component as { displayName?: string }).displayName ||
    component.name ||
    (typeof component === 'string' ? component : 'Component')
  );
}

export default function<T>(
  WrappedComponent: React.ComponentType<T & PassDownProps>,
  defaultProps: Record<string, unknown> = {},
): React.ComponentType<T & WrapperProps> {
  return class extends React.Component<T & WrapperProps, WrapperState> {
    public validations?: Validations;

    public requiredValidations?: Validations;

    public static displayName = `Formsy(${getDisplayName(WrappedComponent)})`;

    public static propTypes: any = propTypes;

    public static contextTypes = {
      formsy: PropTypes.object, // What about required?
    };

    public static defaultProps: any = {
      innerRef: null,
      required: false,
      validationError: '',
      validationErrors: {},
      validations: null,
      ...defaultProps,
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
        isValidationInProgress: false,
        hasAsyncValidation: undefined,
      };
    }

    public componentDidMount() {
      const { validations, required: _required, isRequired, name } = this.props;
      const required = isRequired || _required;
      const { formsy } = this.context;

      if (!name) {
        throw new Error('Form Input requires a name property when used');
      }

      this.setValidations(validations, required);

      // Pass a function instead?
      formsy.attachToForm(this);
    }

    public shouldComponentUpdate(nextProps, nextState, nextContext) {
      const {
        props,
        state,
        context: { formsy: formsyContext },
      } = this;
      const isPropsChanged = Object.keys(props).some(k => props[k] !== nextProps[k]);

      const isStateChanged = Object.keys(state).some(k => state[k] !== nextState[k]);

      const isFormsyContextChanged = Object.keys(formsyContext).some(k => formsyContext[k] !== nextContext.formsy[k]);

      return isPropsChanged || isStateChanged || isFormsyContextChanged;
    }

    /**
     * Updating value before component update to avoid re-rendering with old value.
     * https://rippling.atlassian.net/browse/FRONTEND-1988
     */
    public UNSAFE_componentWillReceiveProps(nextProps) {
      const { value } = nextProps;

      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(value, this.props.value)) {
        this.setValue(value);
      }
    }

    public componentDidUpdate(prevProps) {
      const { validations, required: _required, isRequired } = this.props;
      const required = isRequired || _required;
      const prevRequired = prevProps.isRequired || prevProps.required;
      const { formsy } = this.context;

      // If validations or required is changed, run a new validation
      if (!utils.isSame(validations, prevProps.validations) || !utils.isSame(required, prevRequired)) {
        this.setValidations(validations, required);
        formsy.validate(this);
      }
    }

    // Detach it when component unmounts
    // eslint-disable-next-line react/sort-comp
    public componentWillUnmount() {
      const { formsy } = this.context;
      formsy.detachFromForm(this);
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

    public getValue = () => this.state.value;

    public setValidations = (validations: string | Validations, required: RequiredValidation) => {
      const { formsy } = this.context;
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations = required === true ? { isRequired: required } : convertValidationsToObject(required);
      const hasAsyncValidation = checkHasAsyncValidation(this.validations);
      this.setState({
        hasAsyncValidation,
      });
      formsy.setInputHasAsyncValidation(this, hasAsyncValidation);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    public setValue = (value, validate = true, { isPristine = false } = {}) => {
      const { formsy } = this.context;
      const { hasAsyncValidation } = this.state;

      if (!validate) {
        this.setState({
          value,
        });
      } else {
        this.setState(
          {
            value,
            isPristine,
            isValidationInProgress: hasAsyncValidation,
          },
          () => {
            formsy.validate(this);
          },
        );
      }
    };

    public hasValue = () => this.state.value !== '';

    public isFormDisabled = () => this.context.formsy.isFormDisabled;

    public isFormSubmitted = () => this.state.formSubmitted;

    public isPristine = () => this.state.isPristine;

    public isRequired = () => !!(this.props.required || this.props.isRequired);

    public isValid = () => this.state.isValid;

    public isValidValue = value => this.context.formsy.isValidValue.call(null, this, value);

    public resetValue = () => {
      const { pristineValue } = this.state;
      const { formsy } = this.context;

      this.setState(
        {
          value: pristineValue,
          isPristine: true,
        },
        () => {
          formsy.validate(this);
        },
      );
    };

    public showError = () => !this.showRequired() && !this.isValid();

    public showRequired = () => this.state.isRequired;

    public render() {
      const { innerRef } = this.props;
      const propsForElement: PassDownProps = {
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
        isValidationInProgress: this.state.isValidationInProgress,
        resetValue: this.resetValue,
        setValidations: this.setValidations,
        setValue: this.setValue,
        showError: this.showError(),
        showRequired: this.showRequired(),
        hasAsyncValidation: this.state.hasAsyncValidation,
        getValue: this.getValue,
      };

      if (innerRef) {
        propsForElement.ref = innerRef;
      }

      return React.createElement(WrappedComponent, propsForElement as any);
    }
  };
}
