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
      const configure = () => {
        this.setValidations(this.props.validations, this.props.required);

        // Pass a function instead?
        this.context.formsy.attachToForm(this);
      };

      if (!this.props.name) {
        throw new Error('Form Input requires a name property when used');
      }

      configure();
    }

    // We have to make sure the validate method is kept when new props are added
    public componentWillReceiveProps(nextProps) {
      this.setValidations(nextProps.validations, nextProps.required);
    }

    public shouldComponentUpdate(nextProps, nextState) {
      const isPropsChanged = Object.keys(this.props).some(k => this.props[k] !== nextProps[k]);
      const isStateChanged = Object.keys(this.state).some(k => this.state[k] !== nextState[k]);

      return isPropsChanged || isStateChanged;
    }

    public componentDidUpdate(prevProps) {
      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(this.props.value, prevProps.value)) {
        this.setValue(this.props.value);
      }

      // If validations or required is changed, run a new validation
      if (
        !utils.isSame(this.props.validations, prevProps.validations) ||
        !utils.isSame(this.props.required, prevProps.required)
      ) {
        this.context.formsy.validate(this);
      }
    }

    // Detach it when component unmounts
    public componentWillUnmount() {
      this.context.formsy.detachFromForm(this);
    }

    public getErrorMessage = () => {
      const messages = this.getErrorMessages();
      return messages.length ? messages[0] : null;
    };

    public getErrorMessages = () => {
      if (!this.isValid() || this.showRequired()) {
        return this.state.externalError || this.state.validationError || [];
      }
      return [];
    };

    public getValue = () => this.state.value;

    public setValidations = (validations, required) => {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations =
        required === true ? { isDefaultRequiredValue: true } : convertValidationsToObject(required);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    public setValue = (value, validate = true) => {
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
            this.context.formsy.validate(this);
          },
        );
      }
    };

    public hasValue = () => this.state.value !== '';

    public isFormDisabled = () => this.context.formsy.isFormDisabled();

    public isFormSubmitted = () => this.state.formSubmitted;

    public isPristine = () => this.state.isPristine;

    public isRequired = () => !!this.props.required;

    public isValid = () => this.state.isValid;

    public isValidValue = value => this.context.formsy.isValidValue.call(null, this, value);

    public resetValue = () => {
      this.setState(
        {
          value: this.state.pristineValue,
          isPristine: true,
        },
        () => {
          this.context.formsy.validate(this);
        },
      );
    };

    public showError = () => !this.showRequired() && !this.isValid();

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
