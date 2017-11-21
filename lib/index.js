'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = exports.withFormsy = exports.validationRules = exports.propTypes = exports.addValidationRule = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Formsy = function (_React$Component) {
  _inherits(Formsy, _React$Component);

  function Formsy(props) {
    _classCallCheck(this, Formsy);

    var _this = _possibleConstructorReturn(this, (Formsy.__proto__ || Object.getPrototypeOf(Formsy)).call(this, props));

    _this.state = {
      isValid: true,
      isSubmitting: false,
      canChange: false
    };
    _this.inputs = [];
    _this.attachToForm = _this.attachToForm.bind(_this);
    _this.detachFromForm = _this.detachFromForm.bind(_this);
    _this.getCurrentValues = _this.getCurrentValues.bind(_this);
    _this.getPristineValues = _this.getPristineValues.bind(_this);
    _this.isChanged = _this.isChanged.bind(_this);
    _this.isFormDisabled = _this.isFormDisabled.bind(_this);
    _this.reset = _this.reset.bind(_this);
    _this.resetInternal = _this.resetInternal.bind(_this);
    _this.runValidation = _this.runValidation.bind(_this);
    _this.submit = _this.submit.bind(_this);
    _this.updateInputsWithError = _this.updateInputsWithError.bind(_this);
    _this.validate = _this.validate.bind(_this);
    _this.validateForm = _this.validateForm.bind(_this);
    return _this;
  }

  _createClass(Formsy, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this2 = this;

      return {
        formsy: {
          attachToForm: this.attachToForm,
          detachFromForm: this.detachFromForm,
          validate: this.validate,
          isFormDisabled: this.isFormDisabled,
          isValidValue: function isValidValue(component, value) {
            return _this2.runValidation(component, value).isValid;
          }
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.validateForm();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      // Keep a reference to input names before form updates,
      // to check if inputs has changed after render
      this.prevInputNames = this.inputs.map(function (component) {
        return component.props.name;
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.validationErrors && _typeof(this.props.validationErrors) === 'object' && Object.keys(this.props.validationErrors).length > 0) {
        this.setInputValidationErrors(this.props.validationErrors);
      }

      var newInputNames = this.inputs.map(function (component) {
        return component.props.name;
      });
      if (_utils2.default.arraysDiffer(this.prevInputNames, newInputNames)) {
        this.validateForm();
      }
    }
  }, {
    key: 'getCurrentValues',
    value: function getCurrentValues() {
      return this.inputs.reduce(function (data, component) {
        var name = component.props.name;
        var dataCopy = Object.assign({}, data); // avoid param reassignment
        dataCopy[name] = component.state.value;
        return dataCopy;
      }, {});
    }
  }, {
    key: 'getModel',
    value: function getModel() {
      var currentValues = this.getCurrentValues();
      return this.mapModel(currentValues);
    }
  }, {
    key: 'getPristineValues',
    value: function getPristineValues() {
      return this.inputs.reduce(function (data, component) {
        var name = component.props.name;
        var dataCopy = Object.assign({}, data); // avoid param reassignment
        dataCopy[name] = component.props.value;
        return dataCopy;
      }, {});
    }
  }, {
    key: 'setFormPristine',
    value: function setFormPristine(isPristine) {
      this.setState({
        formSubmitted: !isPristine
      });

      // Iterate through each component and set it as pristine
      // or "dirty".
      this.inputs.forEach(function (component) {
        component.setState({
          formSubmitted: !isPristine,
          isPristine: isPristine
        });
      });
    }
  }, {
    key: 'setInputValidationErrors',
    value: function setInputValidationErrors(errors) {
      this.inputs.forEach(function (component) {
        var name = component.props.name;
        var args = [{
          isValid: !(name in errors),
          validationError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });
    }
  }, {
    key: 'isFormDisabled',
    value: function isFormDisabled() {
      return this.props.disabled;
    }
  }, {
    key: 'mapModel',
    value: function mapModel(model) {
      if (this.props.mapping) {
        return this.props.mapping(model);
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
    }
  }, {
    key: 'reset',
    value: function reset(data) {
      this.setFormPristine(true);
      this.resetModel(data);
    }
  }, {
    key: 'resetInternal',
    value: function resetInternal(event) {
      event.preventDefault();
      this.reset();
      if (this.props.onReset) {
        this.props.onReset();
      }
    }

    // Reset each key in the model to the original / initial / specified value

  }, {
    key: 'resetModel',
    value: function resetModel(data) {
      this.inputs.forEach(function (component) {
        var name = component.props.name;
        if (data && Object.prototype.hasOwnProperty.call(data, name)) {
          component.setValue(data[name]);
        } else {
          component.resetValue();
        }
      });
      this.validateForm();
    }

    // Checks validation on current value or a passed value

  }, {
    key: 'runValidation',
    value: function runValidation(component) {
      var _this3 = this;

      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.state.value;

      var currentValues = this.getCurrentValues();
      var validationErrors = component.props.validationErrors;
      var validationError = component.props.validationError;

      var validationResults = _utils2.default.runRules(value, currentValues, component.validations, _validationRules2.default);
      var requiredResults = _utils2.default.runRules(value, currentValues, component.requiredValidations, _validationRules2.default);

      var isRequired = Object.keys(component.requiredValidations).length ? !!requiredResults.success.length : false;
      var isValid = !validationResults.failed.length && !(this.props.validationErrors && this.props.validationErrors[component.props.name]);

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

          if (_this3.props.validationErrors && _this3.props.validationErrors[component.props.name]) {
            return typeof _this3.props.validationErrors[component.props.name] === 'string' ? [_this3.props.validationErrors[component.props.name]] : _this3.props.validationErrors[component.props.name];
          }

          if (isRequired) {
            var error = validationErrors[requiredResults.success[0]];
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
    }

    // Method put on each input component to register
    // itself to the form

  }, {
    key: 'attachToForm',
    value: function attachToForm(component) {
      if (this.inputs.indexOf(component) === -1) {
        this.inputs.push(component);
      }

      this.validate(component);
    }

    // Method put on each input component to unregister
    // itself from the form

  }, {
    key: 'detachFromForm',
    value: function detachFromForm(component) {
      var componentPos = this.inputs.indexOf(component);

      if (componentPos !== -1) {
        this.inputs = this.inputs.slice(0, componentPos).concat(this.inputs.slice(componentPos + 1));
      }

      this.validateForm();
    }

    // Checks if the values have changed from their initial value

  }, {
    key: 'isChanged',
    value: function isChanged() {
      return !_utils2.default.isSame(this.getPristineValues(), this.getCurrentValues());
    }

    // Update model, submit to url prop and send the model

  }, {
    key: 'submit',
    value: function submit(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      // Trigger form as not pristine.
      // If any inputs have not been touched yet this will make them dirty
      // so validation becomes visible (if based on isPristine)
      this.setFormPristine(false);
      var model = this.getModel();
      this.props.onSubmit(model, this.resetModel, this.updateInputsWithError);
      if (this.state.isValid) {
        this.props.onValidSubmit(model, this.resetModel, this.updateInputsWithError);
      } else {
        this.props.onInvalidSubmit(model, this.resetModel, this.updateInputsWithError);
      }
    }

    // Go through errors from server and grab the components
    // stored in the inputs map. Change their state to invalid
    // and set the serverError message

  }, {
    key: 'updateInputsWithError',
    value: function updateInputsWithError(errors) {
      var _this4 = this;

      Object.keys(errors).forEach(function (name) {
        var component = _utils2.default.find(_this4.inputs, function (input) {
          return input.props.name === name;
        });
        if (!component) {
          throw new Error('You are trying to update an input that does not exist. Verify errors object with input names. ' + JSON.stringify(errors));
        }
        var args = [{
          isValid: _this4.props.preventExternalInvalidation,
          externalError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });
    }

    // Use the binded values and the actual input value to
    // validate the input and set its state. Then check the
    // state of the form itself

  }, {
    key: 'validate',
    value: function validate(component) {
      // Trigger onChange
      if (this.state.canChange) {
        this.props.onChange(this.getCurrentValues(), this.isChanged());
      }

      var validation = this.runValidation(component);
      // Run through the validations, split them up and call
      // the validator IF there is a value or it is required
      component.setState({
        isValid: validation.isValid,
        isRequired: validation.isRequired,
        validationError: validation.error,
        externalError: null
      }, this.validateForm);
    }

    // Validate the form by going through all child input components
    // and check their state

  }, {
    key: 'validateForm',
    value: function validateForm() {
      var _this5 = this;

      // We need a callback as we are validating all inputs again. This will
      // run when the last component has set its state
      var onValidationComplete = function onValidationComplete() {
        var allIsValid = _this5.inputs.every(function (component) {
          return component.state.isValid;
        });

        _this5.setState({
          isValid: allIsValid
        });

        if (allIsValid) {
          _this5.props.onValid();
        } else {
          _this5.props.onInvalid();
        }

        // Tell the form that it can start to trigger change events
        _this5.setState({
          canChange: true
        });
      };

      // Run validation again in case affected by other inputs. The
      // last component validated will run the onValidationComplete callback
      this.inputs.forEach(function (component, index) {
        var validation = _this5.runValidation(component);
        if (validation.isValid && component.state.externalError) {
          validation.isValid = false;
        }
        component.setState({
          isValid: validation.isValid,
          isRequired: validation.isRequired,
          validationError: validation.error,
          externalError: !validation.isValid && component.state.externalError ? component.state.externalError : null
        }, index === _this5.inputs.length - 1 ? onValidationComplete : null);
      });

      // If there are no inputs, set state where form is ready to trigger
      // change event. New inputs might be added later
      if (!this.inputs.length) {
        this.setState({
          canChange: true
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          getErrorMessage = _props.getErrorMessage,
          getErrorMessages = _props.getErrorMessages,
          getValue = _props.getValue,
          hasValue = _props.hasValue,
          isFormDisabled = _props.isFormDisabled,
          isFormSubmitted = _props.isFormSubmitted,
          isPristine = _props.isPristine,
          isRequired = _props.isRequired,
          isValid = _props.isValid,
          isValidValue = _props.isValidValue,
          mapping = _props.mapping,
          onChange = _props.onChange,
          onInvalidSubmit = _props.onInvalidSubmit,
          onInvalid = _props.onInvalid,
          onReset = _props.onReset,
          onSubmit = _props.onSubmit,
          onValid = _props.onValid,
          onValidSubmit = _props.onValidSubmit,
          preventExternalInvalidation = _props.preventExternalInvalidation,
          resetValue = _props.resetValue,
          setValidations = _props.setValidations,
          setValue = _props.setValue,
          showError = _props.showError,
          showRequired = _props.showRequired,
          validationErrors = _props.validationErrors,
          nonFormsyProps = _objectWithoutProperties(_props, ['getErrorMessage', 'getErrorMessages', 'getValue', 'hasValue', 'isFormDisabled', 'isFormSubmitted', 'isPristine', 'isRequired', 'isValid', 'isValidValue', 'mapping', 'onChange', 'onInvalidSubmit', 'onInvalid', 'onReset', 'onSubmit', 'onValid', 'onValidSubmit', 'preventExternalInvalidation', 'resetValue', 'setValidations', 'setValue', 'showError', 'showRequired', 'validationErrors']);

      return _react2.default.createElement('form', _extends({
        onReset: this.resetInternal,
        onSubmit: this.submit
      }, nonFormsyProps), this.props.children);
    }
  }]);

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
  preventExternalInvalidation: _propTypes2.default.bool,
  onChange: _propTypes2.default.func,
  onInvalid: _propTypes2.default.func,
  onInvalidSubmit: _propTypes2.default.func,
  onReset: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onValid: _propTypes2.default.func,
  onValidSubmit: _propTypes2.default.func,
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

var deprecatedWrapper = function deprecatedWrapper(Component) {
  // eslint-disable-next-line no-console
  console.warn('Wrapper has been renamed to withFormsy. Importing Wrapper from formsy-react is depreacted and will be removed in the future. Please rename your Wrapper imports to withFormsy.');

  return withFormsy(Component);
};

exports.addValidationRule = addValidationRule;
exports.propTypes = _Wrapper.propTypes;
exports.validationRules = _validationRules2.default;
exports.withFormsy = withFormsy;
exports.Wrapper = deprecatedWrapper;
exports.default = Formsy;