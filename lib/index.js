'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = exports.withFormsy = exports.validationRules = exports.propTypes = exports.addValidationRule = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _formDataToObject = require('form-data-to-object');

var _formDataToObject2 = _interopRequireDefault(_formDataToObject);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _validationRules = require('./validationRules');

var _validationRules2 = _interopRequireDefault(_validationRules);

var _Wrapper = require('./Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable react/no-unused-state, react/default-props-match-prop-types */

var Formsy = function (_React$Component) {
  _inherits(Formsy, _React$Component);

  function Formsy(props) {
    _classCallCheck(this, Formsy);

    var _this = _possibleConstructorReturn(this, (Formsy.__proto__ || Object.getPrototypeOf(Formsy)).call(this, props));

    _this.getChildContext = function () {
      return {
        formsy: {
          attachToForm: _this.attachToForm,
          detachFromForm: _this.detachFromForm,
          validate: _this.validate,
          isFormDisabled: _this.isFormDisabled,
          isValidValue: function isValidValue(component, value) {
            return _this.runValidation(component, value).isValid;
          }
        }
      };
    };

    _this.componentDidMount = function () {
      _this.validateForm();
    };

    _this.componentWillUpdate = function () {
      // Keep a reference to input names before form updates,
      // to check if inputs has changed after render
      _this.prevInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });
    };

    _this.componentDidUpdate = function () {
      if (_this.props.validationErrors && _typeof(_this.props.validationErrors) === 'object' && Object.keys(_this.props.validationErrors).length > 0) {
        _this.setInputValidationErrors(_this.props.validationErrors);
      }

      var newInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });
      if (_utils2.default.arraysDiffer(_this.prevInputNames, newInputNames)) {
        _this.validateForm();
      }
    };

    _this.getCurrentValues = function () {
      return _this.inputs.reduce(function (data, component) {
        var name = component.props.name;

        var dataCopy = Object.assign({}, data); // avoid param reassignment
        dataCopy[name] = component.state.value;
        return dataCopy;
      }, {});
    };

    _this.getModel = function () {
      var currentValues = _this.getCurrentValues();
      return _this.mapModel(currentValues);
    };

    _this.getPristineValues = function () {
      return _this.inputs.reduce(function (data, component) {
        var name = component.props.name;

        var dataCopy = Object.assign({}, data); // avoid param reassignment
        dataCopy[name] = component.props.value;
        return dataCopy;
      }, {});
    };

    _this.setFormPristine = function (isPristine) {
      _this.setState({
        formSubmitted: !isPristine
      });

      // Iterate through each component and set it as pristine
      // or "dirty".
      _this.inputs.forEach(function (component) {
        component.setState({
          formSubmitted: !isPristine,
          isPristine: isPristine
        });
      });
    };

    _this.setInputValidationErrors = function (errors) {
      _this.inputs.forEach(function (component) {
        var name = component.props.name;

        var args = [{
          isValid: !(name in errors),
          validationError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });
    };

    _this.isFormDisabled = function () {
      return _this.props.disabled;
    };

    _this.mapModel = function (model) {
      if (_this.props.mapping) {
        return _this.props.mapping(model);
      }

      return _formDataToObject2.default.toObj(Object.keys(model).reduce(function (mappedModel, key) {
        var keyArray = key.split('.');
        var base = mappedModel;
        while (keyArray.length) {
          var currentKey = keyArray.shift();
          base[currentKey] = keyArray.length ? base[currentKey] || {} : model[key];
          base = base[currentKey];
        }
        return mappedModel;
      }, {}));
    };

    _this.reset = function (data) {
      _this.setFormPristine(true);
      _this.resetModel(data);
    };

    _this.resetInternal = function (event) {
      event.preventDefault();
      _this.reset();
      if (_this.props.onReset) {
        _this.props.onReset();
      }
    };

    _this.resetModel = function (data) {
      _this.inputs.forEach(function (component) {
        var name = component.props.name;

        if (data && Object.prototype.hasOwnProperty.call(data, name)) {
          component.setValue(data[name]);
        } else {
          component.resetValue();
        }
      });
      _this.validateForm();
    };

    _this.runValidation = function (component) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.state.value;

      var currentValues = _this.getCurrentValues();
      var _component$props = component.props,
          validationError = _component$props.validationError,
          validationErrors = _component$props.validationErrors;


      var validationResults = _utils2.default.runRules(value, currentValues, component.validations, _validationRules2.default);

      var requiredResults = _utils2.default.runRules(value, currentValues, component.requiredValidations, _validationRules2.default);

      var isRequired = Object.keys(component.requiredValidations).length ? !!requiredResults.success.length : false;
      var isValid = !validationResults.failed.length && !(_this.props.validationErrors && _this.props.validationErrors[component.props.name]);

      return {
        isRequired: isRequired,
        isValid: isRequired ? false : isValid,
        error: function () {
          if (isValid && !isRequired) {
            return [];
          }

          if (validationResults.errors.length) {
            return validationResults.errors;
          }

          if (_this.props.validationErrors && _this.props.validationErrors[component.props.name]) {
            return typeof _this.props.validationErrors[component.props.name] === 'string' ? [_this.props.validationErrors[component.props.name]] : _this.props.validationErrors[component.props.name];
          }

          if (isRequired) {
            var error = validationErrors[requiredResults.success[0]] || validationError;
            return error ? [error] : null;
          }

          if (validationResults.failed.length) {
            return validationResults.failed.map(function (failed) {
              return validationErrors[failed] ? validationErrors[failed] : validationError;
            }).filter(function (x, pos, arr) {
              return arr.indexOf(x) === pos;
            }); // remove duplicates
          }

          return undefined;
        }()
      };
    };

    _this.attachToForm = function (component) {
      if (_this.inputs.indexOf(component) === -1) {
        _this.inputs.push(component);
      }

      _this.validate(component);
    };

    _this.detachFromForm = function (component) {
      var componentPos = _this.inputs.indexOf(component);

      if (componentPos !== -1) {
        _this.inputs = _this.inputs.slice(0, componentPos).concat(_this.inputs.slice(componentPos + 1));
      }

      _this.validateForm();
    };

    _this.isChanged = function () {
      return !_utils2.default.isSame(_this.getPristineValues(), _this.getCurrentValues());
    };

    _this.submit = function (event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      // Trigger form as not pristine.
      // If any inputs have not been touched yet this will make them dirty
      // so validation becomes visible (if based on isPristine)
      _this.setFormPristine(false);
      var model = _this.getModel();
      _this.props.onSubmit(model, _this.resetModel, _this.updateInputsWithError);
      if (_this.state.isValid) {
        _this.props.onValidSubmit(model, _this.resetModel, _this.updateInputsWithError);
      } else {
        _this.props.onInvalidSubmit(model, _this.resetModel, _this.updateInputsWithError);
      }
    };

    _this.updateInputsWithError = function (errors) {
      Object.keys(errors).forEach(function (name) {
        var component = _utils2.default.find(_this.inputs, function (input) {
          return input.props.name === name;
        });
        if (!component) {
          throw new Error('You are trying to update an input that does not exist. Verify errors object with input names. ' + JSON.stringify(errors));
        }
        var args = [{
          isValid: _this.props.preventExternalInvalidation,
          externalError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });
    };

    _this.validate = function (component) {
      // Trigger onChange
      if (_this.state.canChange) {
        _this.props.onChange(_this.getCurrentValues(), _this.isChanged());
      }

      var validation = _this.runValidation(component);
      // Run through the validations, split them up and call
      // the validator IF there is a value or it is required
      component.setState({
        isValid: validation.isValid,
        isRequired: validation.isRequired,
        validationError: validation.error,
        externalError: null
      }, _this.validateForm);
    };

    _this.validateForm = function () {
      // We need a callback as we are validating all inputs again. This will
      // run when the last component has set its state
      var onValidationComplete = function onValidationComplete() {
        var allIsValid = _this.inputs.every(function (component) {
          return component.state.isValid;
        });

        _this.setState({
          isValid: allIsValid
        });

        if (allIsValid) {
          _this.props.onValid();
        } else {
          _this.props.onInvalid();
        }

        // Tell the form that it can start to trigger change events
        _this.setState({
          canChange: true
        });
      };

      // Run validation again in case affected by other inputs. The
      // last component validated will run the onValidationComplete callback
      _this.inputs.forEach(function (component, index) {
        var validation = _this.runValidation(component);
        if (validation.isValid && component.state.externalError) {
          validation.isValid = false;
        }
        component.setState({
          isValid: validation.isValid,
          isRequired: validation.isRequired,
          validationError: validation.error,
          externalError: !validation.isValid && component.state.externalError ? component.state.externalError : null
        }, index === _this.inputs.length - 1 ? onValidationComplete : null);
      });

      // If there are no inputs, set state where form is ready to trigger
      // change event. New inputs might be added later
      if (!_this.inputs.length) {
        _this.setState({
          canChange: true
        });
      }
    };

    _this.render = function () {
      var _this$props = _this.props,
          getErrorMessage = _this$props.getErrorMessage,
          getErrorMessages = _this$props.getErrorMessages,
          getValue = _this$props.getValue,
          hasValue = _this$props.hasValue,
          isFormDisabled = _this$props.isFormDisabled,
          isFormSubmitted = _this$props.isFormSubmitted,
          isPristine = _this$props.isPristine,
          isRequired = _this$props.isRequired,
          isValid = _this$props.isValid,
          isValidValue = _this$props.isValidValue,
          mapping = _this$props.mapping,
          onChange = _this$props.onChange,
          onInvalidSubmit = _this$props.onInvalidSubmit,
          onInvalid = _this$props.onInvalid,
          onReset = _this$props.onReset,
          onSubmit = _this$props.onSubmit,
          onValid = _this$props.onValid,
          onValidSubmit = _this$props.onValidSubmit,
          preventExternalInvalidation = _this$props.preventExternalInvalidation,
          resetValue = _this$props.resetValue,
          setValidations = _this$props.setValidations,
          setValue = _this$props.setValue,
          showError = _this$props.showError,
          showRequired = _this$props.showRequired,
          validationErrors = _this$props.validationErrors,
          nonFormsyProps = _objectWithoutProperties(_this$props, ['getErrorMessage', 'getErrorMessages', 'getValue', 'hasValue', 'isFormDisabled', 'isFormSubmitted', 'isPristine', 'isRequired', 'isValid', 'isValidValue', 'mapping', 'onChange', 'onInvalidSubmit', 'onInvalid', 'onReset', 'onSubmit', 'onValid', 'onValidSubmit', 'preventExternalInvalidation', 'resetValue', 'setValidations', 'setValue', 'showError', 'showRequired', 'validationErrors']);

      return _react2.default.createElement('form', _extends({
        onReset: _this.resetInternal,
        onSubmit: _this.submit
      }, nonFormsyProps, {
        disabled: false
      }), _this.props.children);
    };

    _this.state = {
      isValid: true,
      isSubmitting: false,
      canChange: false
    };
    _this.inputs = [];
    return _this;
  }

  // Reset each key in the model to the original / initial / specified value


  // Checks validation on current value or a passed value


  // Method put on each input component to register
  // itself to the form


  // Method put on each input component to unregister
  // itself from the form


  // Checks if the values have changed from their initial value


  // Update model, submit to url prop and send the model


  // Go through errors from server and grab the components
  // stored in the inputs map. Change their state to invalid
  // and set the serverError message


  // Use the binded values and the actual input value to
  // validate the input and set its state. Then check the
  // state of the form itself


  // Validate the form by going through all child input components
  // and check their state


  return Formsy;
}(_react2.default.Component);

Formsy.displayName = 'Formsy';

Formsy.defaultProps = {
  children: null,
  disabled: false,
  getErrorMessage: function getErrorMessage() {},
  getErrorMessages: function getErrorMessages() {},
  getValue: function getValue() {},
  hasValue: function hasValue() {},
  isFormDisabled: function isFormDisabled() {},
  isFormSubmitted: function isFormSubmitted() {},
  isPristine: function isPristine() {},
  isRequired: function isRequired() {},
  isValid: function isValid() {},
  isValidValue: function isValidValue() {},
  mapping: null,
  onChange: function onChange() {},
  onError: function onError() {},
  onInvalid: function onInvalid() {},
  onInvalidSubmit: function onInvalidSubmit() {},
  onReset: function onReset() {},
  onSubmit: function onSubmit() {},
  onValid: function onValid() {},
  onValidSubmit: function onValidSubmit() {},
  preventExternalInvalidation: false,
  resetValue: function resetValue() {},
  setValidations: function setValidations() {},
  setValue: function setValue() {},
  showError: function showError() {},
  showRequired: function showRequired() {},
  validationErrors: null
};

Formsy.propTypes = {
  children: _propTypes2.default.node,
  disabled: _propTypes2.default.bool,
  getErrorMessage: _propTypes2.default.func,
  getErrorMessages: _propTypes2.default.func,
  getValue: _propTypes2.default.func,
  hasValue: _propTypes2.default.func,
  isFormDisabled: _propTypes2.default.func,
  isFormSubmitted: _propTypes2.default.func,
  isPristine: _propTypes2.default.func,
  isRequired: _propTypes2.default.func,
  isValid: _propTypes2.default.func,
  isValidValue: _propTypes2.default.func,
  mapping: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onInvalid: _propTypes2.default.func,
  onInvalidSubmit: _propTypes2.default.func,
  onReset: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onValid: _propTypes2.default.func,
  onValidSubmit: _propTypes2.default.func,
  preventExternalInvalidation: _propTypes2.default.bool,
  resetValue: _propTypes2.default.func,
  setValidations: _propTypes2.default.func,
  setValue: _propTypes2.default.func,
  showError: _propTypes2.default.func,
  showRequired: _propTypes2.default.func,
  validationErrors: _propTypes2.default.object // eslint-disable-line
};

Formsy.childContextTypes = {
  formsy: _propTypes2.default.object
};

var addValidationRule = function addValidationRule(name, func) {
  _validationRules2.default[name] = func;
};

var withFormsy = _Wrapper2.default;

var didWarnAboutWrapperDeprecation = false;

var deprecatedWrapper = function deprecatedWrapper(Component) {
  if (!didWarnAboutWrapperDeprecation) {
    // eslint-disable-next-line no-console
    console.warn('Wrapper has been renamed to withFormsy. Importing Wrapper from formsy-react is depreacted and will be removed in the future. Please rename your Wrapper imports to withFormsy.');
    didWarnAboutWrapperDeprecation = true;
  }

  return withFormsy(Component);
};

exports.addValidationRule = addValidationRule;
exports.propTypes = _Wrapper.propTypes;
exports.validationRules = _validationRules2.default;
exports.withFormsy = withFormsy;
exports.Wrapper = deprecatedWrapper;
exports.default = Formsy;