import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import has from 'lodash.has';
import set from 'lodash.set';

import * as utils from './utils';
import validationRules from './validationRules';
import Wrapper, { PassDownProps, propTypes, WrapperState } from './Wrapper';
import FormsyContext from './FormsyContext';

import {
  FormsyContextInterface,
  IModel,
  InputComponent,
  IResetModel,
  IUpdateInputsWithError,
  IUpdateInputsWithValue,
  ValidationFunction,
} from './interfaces';
import { isObject, isString } from './utils';

type FormHTMLAttributesCleaned = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'>;

/* eslint-disable react/no-unused-state, react/default-props-match-prop-types */
export interface FormsyProps extends FormHTMLAttributesCleaned {
  disabled: boolean;
  mapping: null | ((model: IModel) => IModel);
  onChange: (model: IModel, isChanged: boolean) => void;
  onInvalid: () => void;
  onInvalidSubmit: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
  onReset?: () => void;
  onSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
  onValid: () => void;
  onValidSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
  preventDefaultSubmit?: boolean;
  preventExternalInvalidation?: boolean;
  validationErrors?: null | object;
}

export interface FormsyState {
  canChange: boolean;
  contextValue: FormsyContextInterface;
  formSubmitted?: boolean;
  isPristine?: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

class Formsy extends React.Component<FormsyProps, FormsyState> {
  public inputs: InstanceType<any & PassDownProps<any>>[];

  public emptyArray: any[];

  public prevInputNames: any[] | null = null;

  public static displayName = 'Formsy';

  public static propTypes = {
    disabled: PropTypes.bool,
    mapping: PropTypes.func,
    onChange: PropTypes.func,
    onInvalid: PropTypes.func,
    onInvalidSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onSubmit: PropTypes.func,
    onValid: PropTypes.func,
    onValidSubmit: PropTypes.func,
    preventDefaultSubmit: PropTypes.bool,
    preventExternalInvalidation: PropTypes.bool,
    validationErrors: PropTypes.object, // eslint-disable-line
  };

  public static defaultProps: Partial<FormsyProps> = {
    disabled: false,
    mapping: null,
    onChange: utils.noop,
    onInvalid: utils.noop,
    onInvalidSubmit: utils.noop,
    onReset: utils.noop,
    onSubmit: utils.noop,
    onValid: utils.noop,
    onValidSubmit: utils.noop,
    preventDefaultSubmit: true,
    preventExternalInvalidation: false,
    validationErrors: {},
  };

  public constructor(props: FormsyProps) {
    super(props);
    this.state = {
      canChange: false,
      isSubmitting: false,
      isValid: true,
      contextValue: {
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm,
        isFormDisabled: props.disabled,
        isValidValue: this.isValidValue,
        validate: this.validate,
      },
    };
    this.inputs = [];
    this.emptyArray = [];
  }

  public componentDidMount = () => {
    this.prevInputNames = this.inputs.map((component) => component.props.name);
    this.validateForm();
  };

  public componentDidUpdate = (prevProps: FormsyProps) => {
    const { validationErrors, disabled } = this.props;

    if (validationErrors && isObject(validationErrors) && Object.keys(validationErrors).length > 0) {
      this.setInputValidationErrors(validationErrors);
    }

    const newInputNames = this.inputs.map((component) => component.props.name);
    if (this.prevInputNames && !utils.isSame(this.prevInputNames, newInputNames)) {
      this.prevInputNames = newInputNames;
      this.validateForm();
    }

    // Keep the disabled value in state/context the same as from props
    if (disabled !== prevProps.disabled) {
      // eslint-disable-next-line
      this.setState((state) => ({
        ...state,
        contextValue: {
          ...state.contextValue,
          isFormDisabled: disabled,
        },
      }));
    }
  };

  public getCurrentValues = () =>
    this.inputs.reduce((valueAccumulator, component) => {
      const {
        props: { name },
        state: { value },
      } = component;
      // eslint-disable-next-line no-param-reassign
      valueAccumulator[name] = utils.protectAgainstParamReassignment(value);
      return valueAccumulator;
    }, {});

  public getModel = () => {
    const currentValues = this.getCurrentValues();
    return this.mapModel(currentValues);
  };

  public getPristineValues = () =>
    this.inputs.reduce((valueAccumulator, component) => {
      const {
        props: { name, value },
      } = component;
      // eslint-disable-next-line no-param-reassign
      valueAccumulator[name] = utils.protectAgainstParamReassignment(value);
      return valueAccumulator;
    }, {});

  public setFormPristine = (isPristine: boolean) => {
    this.setState({
      formSubmitted: !isPristine,
    });

    // Iterate through each component and set it as pristine
    // or "dirty".
    this.inputs.forEach((component) => {
      component.setState({
        formSubmitted: !isPristine,
        isPristine,
      });
    });
  };

  public setInputValidationErrors = (errors) => {
    const { preventExternalInvalidation } = this.props;
    const { isValid } = this.state;

    this.inputs.forEach((component) => {
      const { name } = component.props;
      component.setState({
        isValid: !(name in errors),
        validationError: isString(errors[name]) ? [errors[name]] : errors[name],
      });
    });
    if (!preventExternalInvalidation && isValid) {
      this.setFormValidState(false);
    }
  };

  public setFormValidState = (allIsValid: boolean) => {
    const { onValid, onInvalid } = this.props;

    this.setState({
      isValid: allIsValid,
    });

    if (allIsValid) {
      onValid();
    } else {
      onInvalid();
    }
  };

  public isValidValue = (component, value) => this.runValidation(component, value).isValid;

  // eslint-disable-next-line react/destructuring-assignment
  public isFormDisabled = () => this.props.disabled;

  public mapModel = (model: IModel): IModel => {
    const { mapping } = this.props;

    if (mapping) {
      return mapping(model);
    }

    const returnModel = {};
    Object.keys(model).forEach((key) => {
      set(returnModel, key, model[key]);
    });
    return returnModel;
  };

  public reset = (model?: IModel) => {
    this.setFormPristine(true);
    this.resetModel(model);
  };

  private resetInternal = (event) => {
    const { onReset } = this.props;

    event.preventDefault();
    this.reset();
    if (onReset) {
      onReset();
    }
  };

  // Reset each key in the model to the original / initial / specified value
  private resetModel: IResetModel = (data) => {
    this.inputs.forEach((component) => {
      const { name } = component.props;
      if (data && has(data, name)) {
        component.setValue(get(data, name));
      } else {
        component.resetValue();
      }
    });
    this.validateForm();
  };

  // Checks validation on current value or a passed value
  public runValidation = <V>(component: InputComponent<V>, value = component.state.value): Partial<WrapperState<V>> => {
    const { validationErrors } = this.props;
    const { validationError, validationErrors: componentValidationErrors, name } = component.props;
    const currentValues = this.getCurrentValues();
    const validationResults = utils.runRules(value, currentValues, component.validations, validationRules);
    const requiredResults = utils.runRules(value, currentValues, component.requiredValidations, validationRules);
    const isRequired = Object.keys(component.requiredValidations).length ? !!requiredResults.success.length : false;
    const isValid = !validationResults.failed.length && !(validationErrors && validationErrors[component.props.name]);

    return {
      isRequired,
      isValid: isRequired ? false : isValid,
      validationError: (() => {
        if (isValid && !isRequired) {
          return this.emptyArray;
        }

        if (validationResults.errors.length) {
          return validationResults.errors;
        }

        if (validationErrors && validationErrors[name]) {
          return isString(validationErrors[name]) ? [validationErrors[name]] : validationErrors[name];
        }

        if (isRequired) {
          const error = componentValidationErrors[requiredResults.success[0]] || validationError;
          return error ? [error] : null;
        }

        if (validationResults.failed.length) {
          return validationResults.failed
            .map((failed) => (componentValidationErrors[failed] ? componentValidationErrors[failed] : validationError))
            .filter((x, pos, arr) => arr.indexOf(x) === pos); // remove duplicates
        }

        // This line is not reachable
        // istanbul ignore next
        return undefined;
      })(),
    };
  };

  // Method put on each input component to register
  // itself to the form
  public attachToForm = (component) => {
    if (this.inputs.indexOf(component) === -1) {
      this.inputs.push(component);
    }

    this.validate(component);
  };

  // Method put on each input component to unregister
  // itself from the form
  public detachFromForm = <V>(component: InputComponent<V>) => {
    const componentPos = this.inputs.indexOf(component);

    if (componentPos !== -1) {
      this.inputs = this.inputs.slice(0, componentPos).concat(this.inputs.slice(componentPos + 1));
    }

    this.validateForm();
  };

  // Checks if the values have changed from their initial value
  public isChanged = () => !utils.isSame(this.getPristineValues(), this.getCurrentValues());

  // Update model, submit to url prop and send the model
  public submit = (event?: any) => {
    const { onSubmit, onValidSubmit, onInvalidSubmit, preventDefaultSubmit } = this.props;
    const { isValid } = this.state;

    if (preventDefaultSubmit && event && event.preventDefault) {
      event.preventDefault();
    }

    // Trigger form as not pristine.
    // If any inputs have not been touched yet this will make them dirty
    // so validation becomes visible (if based on isPristine)
    this.setFormPristine(false);
    const model = this.getModel();
    onSubmit(model, this.resetModel, this.updateInputsWithError);

    if (isValid) {
      onValidSubmit(model, this.resetModel, this.updateInputsWithError);
    } else {
      onInvalidSubmit(model, this.resetModel, this.updateInputsWithError);
    }
  };

  // Go through errors from server and grab the components
  // stored in the inputs map. Change their state to invalid
  // and set the serverError message
  public updateInputsWithError: IUpdateInputsWithError = (errors, invalidate) => {
    const { preventExternalInvalidation } = this.props;
    const { isValid } = this.state;

    Object.entries(errors).forEach(([name, error]) => {
      const component = this.inputs.find((input) => input.props.name === name);
      if (!component) {
        throw new Error(
          `You are trying to update an input that does not exist. Verify errors object with input names. ${JSON.stringify(
            errors,
          )}`,
        );
      }
      component.setState({
        isValid: preventExternalInvalidation,
        validationError: utils.isString(error) ? [error] : error,
      });
    });

    if (invalidate && isValid) {
      this.setFormValidState(false);
    }
  };

  // Set the value of components
  public updateInputsWithValue: IUpdateInputsWithValue<any> = (values, validate) => {
    Object.entries(values).forEach(([name, value]) => {
      const input = this.inputs.find((component) => component.props.name === name);

      if (input) {
        input.setValue(value, validate);
      }
    });
  };

  // Use the binded values and the actual input value to
  // validate the input and set its state. Then check the
  // state of the form itself
  public validate = <V>(component: InputComponent<V>) => {
    const { onChange } = this.props;
    const { canChange } = this.state;

    // Trigger onChange
    if (canChange) {
      onChange(this.getModel(), this.isChanged());
    }

    const validationState = this.runValidation<V>(component);
    // Run through the validations, split them up and call
    // the validator IF there is a value or it is required
    component.setState(validationState, this.validateForm);
  };

  // Validate the form by going through all child input components
  // and check their state
  public validateForm = () => {
    // We need a callback as we are validating all inputs again. This will
    // run when the last component has set its state
    const onValidationComplete = () => {
      const allIsValid = this.inputs.every((component) => component.state.isValid);

      this.setFormValidState(allIsValid);

      // Tell the form that it can start to trigger change events
      this.setState({
        canChange: true,
      });
    };

    // Run validation again in case affected by other inputs. The
    // last component validated will run the onValidationComplete callback
    this.inputs.forEach((component, index) => {
      const validationState = this.runValidation(component);
      const isFinalInput = index === this.inputs.length - 1;
      const callback = isFinalInput ? onValidationComplete : null;
      component.setState(validationState, callback);
    });

    // If there are no inputs, set state where form is ready to trigger
    // change event. New inputs might be added later
    if (!this.inputs.length) {
      this.setState(
        {
          canChange: true,
        },
        onValidationComplete,
      );
    }
  };

  public render = () => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      children,
      mapping,
      onChange,
      onInvalid,
      onInvalidSubmit,
      onReset,
      onSubmit,
      onValid,
      onValidSubmit,
      preventDefaultSubmit,
      preventExternalInvalidation,
      validationErrors,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...nonFormsyProps
    } = this.props;
    const { contextValue } = this.state;

    return React.createElement(
      FormsyContext.Provider,
      {
        value: contextValue,
      },
      React.createElement(
        'form',
        {
          onReset: this.resetInternal,
          onSubmit: this.submit,
          ...nonFormsyProps,
          disabled: false,
        },
        children,
      ),
    );
  };
}

const addValidationRule = <V>(name: string, func: ValidationFunction<V>) => {
  validationRules[name] = func;
};

export { addValidationRule, propTypes, validationRules, Wrapper as withFormsy, PassDownProps as FormsyInjectedProps };

export default Formsy;
