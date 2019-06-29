import PropTypes from 'prop-types';
import React from 'react';
import utils from './utils';

/* eslint-disable react/default-props-match-prop-types */

const convertValidationsToObject = validations => {
  if (typeof validations === 'string') {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation) => {
      let args = validation.split(':');
      const validateMethod = args.shift();

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
      const validationsAccumulatorCopy = Object.assign({}, validationsAccumulator);
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

interface WrapperProps {
  innerRef?: (ref: any) => void;
  name: string;
  required?: string | object | boolean;
  validations?: string | object;
  value?: any;
}

interface WrapperState {
  externalError: null | any;
  formSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  pristineValue: any;
  validationError: any[];
  value: any;
}

export { propTypes };

function getDisplayName(component) {
  return component.displayName || component.name || (typeof component === 'string' ? component : 'Component');
}

export default function<Props, State, CompState>(
  WrappedComponent: React.ComponentClass<Props & State>,
): React.ComponentClass<Props & State> {
  return class extends React.Component<Props & State & WrapperProps, WrapperState> {
    private validations: any;

    private requiredValidations: any;

    public static displayName: any = `Formsy(${getDisplayName(WrappedComponent)})`;

    public static contextTypes: any = {
      formsy: PropTypes.object, // What about required?
    };

    public static defaultProps: any = {
      innerRef: null,
      required: false,
      validationError: '',
      validationErrors: {},
      validations: null,
      value: (WrappedComponent as any).defaultValue,
    };

    public static propTypes: any = propTypes;

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

    public componentWillMount() {
      const { validations, required, name } = this.props;
      const { formsy } = this.context;

      const configure = () => {
        this.setValidations(validations, required);

        // Pass a function instead?
        formsy.attachToForm(this);
      };

      if (!name) {
        throw new Error('Form Input requires a name property when used');
      }

      configure();
    }

    // We have to make sure the validate method is kept when new props are added
    public componentWillReceiveProps(nextProps) {
      this.setValidations(nextProps.validations, nextProps.required);
    }

    public shouldComponentUpdate(nextProps, nextState) {
      // eslint-disable-next-line react/destructuring-assignment
      const isPropsChanged = Object.keys(this.props).some(k => this.props[k] !== nextProps[k]);

      // eslint-disable-next-line react/destructuring-assignment
      const isStateChanged = Object.keys(this.state).some(k => this.state[k] !== nextState[k]);

      return isPropsChanged || isStateChanged;
    }

    public componentDidUpdate(prevProps) {
      const { value, validations, required } = this.props;
      const { formsy } = this.context;

      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(value, prevProps.value)) {
        this.setValue(value);
      }

      // If validations or required is changed, run a new validation
      if (!utils.isSame(validations, prevProps.validations) || !utils.isSame(required, prevProps.required)) {
        formsy.validate(this);
      }
    }

    // Detach it when component unmounts
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

    public getValue = () => {
      const { value } = this.state;
      return value;
    };

    public setValidations = (validations, required) => {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations =
        required === true ? { isDefaultRequiredValue: true } : convertValidationsToObject(required);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    public setValue = (value, validate = true) => {
      const { formsy } = this.context;

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
            formsy.validate(this);
          },
        );
      }
    };

    // eslint-disable-next-line react/destructuring-assignment
    public hasValue = () => this.state.value !== '';

    // eslint-disable-next-line react/destructuring-assignment
    public isFormDisabled = () => this.context.formsy.isFormDisabled();

    // eslint-disable-next-line react/destructuring-assignment
    public isFormSubmitted = () => this.state.formSubmitted;

    // eslint-disable-next-line react/destructuring-assignment
    public isPristine = () => this.state.isPristine;

    // eslint-disable-next-line react/destructuring-assignment
    public isRequired = () => !!this.props.required;

    // eslint-disable-next-line react/destructuring-assignment
    public isValid = () => this.state.isValid;

    // eslint-disable-next-line react/destructuring-assignment
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

    // eslint-disable-next-line react/destructuring-assignment
    public showRequired = () => this.state.isRequired;

    public render() {
      const { innerRef } = this.props;
      const propsForElement: any = {
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
