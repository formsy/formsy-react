'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'validationRules', {
  enumerable: true,
  get: function get() {
    return _validationRules['default'];
  },
});
Object.defineProperty(exports, 'withFormsy', {
  enumerable: true,
  get: function get() {
    return _Wrapper['default'];
  },
});
Object.defineProperty(exports, 'propTypes', {
  enumerable: true,
  get: function get() {
    return _Wrapper.propTypes;
  },
});
exports['default'] = exports.addValidationRule = void 0;

var _formDataToObject = _interopRequireDefault(require('form-data-to-object'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _react = _interopRequireDefault(require('react'));

var _utils = _interopRequireDefault(require('./utils'));

var _validationRules = _interopRequireDefault(require('./validationRules'));

var _Wrapper = _interopRequireWildcard(require('./Wrapper'));

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj['default'] = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

/* eslint-disable react/no-unused-state, react/default-props-match-prop-types */
var Formsy =
  /*#__PURE__*/
  (function(_React$Component) {
    _inherits(Formsy, _React$Component);

    function Formsy(props) {
      var _this;

      _classCallCheck(this, Formsy);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(Formsy).call(this, props),
      );

      _this.getChildContext = function() {
        return {
          formsy: {
            attachToForm: _this.attachToForm,
            detachFromForm: _this.detachFromForm,
            validate: _this.validate,
            isFormDisabled: _this.isFormDisabled,
            isValidValue: function isValidValue(component, value) {
              return _this.runValidation(component, value).isValid;
            },
          },
        };
      };

      _this.componentDidMount = function() {
        _this.validateForm();
      };

      _this.componentWillUpdate = function() {
        // Keep a reference to input names before form updates,
        // to check if inputs has changed after render
        _this.prevInputNames = _this.inputs.map(function(component) {
          return component.props.name;
        });
      };

      _this.componentDidUpdate = function() {
        if (
          _this.props.validationErrors &&
          _typeof(_this.props.validationErrors) === 'object' &&
          Object.keys(_this.props.validationErrors).length > 0
        ) {
          _this.setInputValidationErrors(_this.props.validationErrors);
        }

        var newInputNames = _this.inputs.map(function(component) {
          return component.props.name;
        });

        if (
          _utils['default'].arraysDiffer(_this.prevInputNames, newInputNames)
        ) {
          _this.validateForm();
        }
      };

      _this.getCurrentValues = function() {
        return _this.inputs.reduce(function(data, component) {
          var dataCopy =
            _typeof(component.state.value) === 'object'
              ? Object.assign({}, data)
              : data; // avoid param reassignment

          dataCopy[component.props.name] = component.state.value;
          return dataCopy;
        }, {});
      };

      _this.getModel = function() {
        var currentValues = _this.getCurrentValues();

        return _this.mapModel(currentValues);
      };

      _this.getPristineValues = function() {
        return _this.inputs.reduce(function(data, component) {
          var name = component.props.name;
          var dataCopy =
            _typeof(component.state.value) === 'object'
              ? Object.assign({}, data)
              : data; // avoid param reassignment

          dataCopy[name] = component.props.value;
          return dataCopy;
        }, {});
      };

      _this.setFormPristine = function(isPristine) {
        _this.setState({
          formSubmitted: !isPristine,
        }); // Iterate through each component and set it as pristine
        // or "dirty".

        _this.inputs.forEach(function(component) {
          component.setState({
            formSubmitted: !isPristine,
            isPristine: isPristine,
          });
        });
      };

      _this.setInputValidationErrors = function(errors) {
        _this.inputs.forEach(function(component) {
          var name = component.props.name;
          var args = [
            {
              isValid: !(name in errors),
              validationError:
                typeof errors[name] === 'string'
                  ? [errors[name]]
                  : errors[name],
            },
          ];
          component.setState.apply(component, args);
        });

        if (!_this.props.preventExternalInvalidation && _this.state.isValid) {
          _this.setFormValidState(false);
        }
      };

      _this.setFormValidState = function(allIsValid) {
        _this.setState({
          isValid: allIsValid,
        });

        if (allIsValid) {
          _this.props.onValid();
        } else {
          _this.props.onInvalid();
        }
      };

      _this.isFormDisabled = function() {
        return _this.props.disabled;
      };

      _this.mapModel = function(model) {
        if (_this.props.mapping) {
          return _this.props.mapping(model);
        }

        return _formDataToObject['default'].toObj(
          Object.keys(model).reduce(function(mappedModel, key) {
            var keyArray = key.split('.');
            var base = mappedModel;

            while (keyArray.length) {
              var currentKey = keyArray.shift();
              base[currentKey] = keyArray.length
                ? base[currentKey] || {}
                : model[key];
              base = base[currentKey];
            }

            return mappedModel;
          }, {}),
        );
      };

      _this.reset = function(data) {
        _this.setFormPristine(true);

        _this.resetModel(data);
      };

      _this.resetInternal = function(event) {
        event.preventDefault();

        _this.reset();

        if (_this.props.onReset) {
          _this.props.onReset();
        }
      };

      _this.resetModel = function(data) {
        _this.inputs.forEach(function(component) {
          var name = component.props.name;

          if (data && Object.prototype.hasOwnProperty.call(data, name)) {
            component.setValue(data[name]);
          } else {
            component.resetValue();
          }
        });

        _this.validateForm();
      };

      _this.runValidation = function(component) {
        var value =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : component.state.value;

        var currentValues = _this.getCurrentValues();

        var _component$props = component.props,
          validationError = _component$props.validationError,
          validationErrors = _component$props.validationErrors;

        var validationResults = _utils['default'].runRules(
          value,
          currentValues,
          component.validations,
          _validationRules['default'],
        );

        var requiredResults = _utils['default'].runRules(
          value,
          currentValues,
          component.requiredValidations,
          _validationRules['default'],
        );

        var isRequired = Object.keys(component.requiredValidations).length
          ? !!requiredResults.success.length
          : false;
        var isValid =
          !validationResults.failed.length &&
          !(
            _this.props.validationErrors &&
            _this.props.validationErrors[component.props.name]
          );
        return {
          isRequired: isRequired,
          isValid: isRequired ? false : isValid,
          error: (function() {
            if (isValid && !isRequired) {
              return _this.emptyArray;
            }

            if (validationResults.errors.length) {
              return validationResults.errors;
            }

            if (
              _this.props.validationErrors &&
              _this.props.validationErrors[component.props.name]
            ) {
              return typeof _this.props.validationErrors[
                component.props.name
              ] === 'string'
                ? [_this.props.validationErrors[component.props.name]]
                : _this.props.validationErrors[component.props.name];
            }

            if (isRequired) {
              var error =
                validationErrors[requiredResults.success[0]] || validationError;
              return error ? [error] : null;
            }

            if (validationResults.failed.length) {
              return validationResults.failed
                .map(function(failed) {
                  return validationErrors[failed]
                    ? validationErrors[failed]
                    : validationError;
                })
                .filter(function(x, pos, arr) {
                  return arr.indexOf(x) === pos;
                }); // remove duplicates
            }

            return undefined;
          })(),
        };
      };

      _this.attachToForm = function(component) {
        if (_this.inputs.indexOf(component) === -1) {
          _this.inputs.push(component);
        }

        _this.validate(component);
      };

      _this.detachFromForm = function(component) {
        var componentPos = _this.inputs.indexOf(component);

        if (componentPos !== -1) {
          _this.inputs = _this.inputs
            .slice(0, componentPos)
            .concat(_this.inputs.slice(componentPos + 1));
        }

        _this.validateForm();
      };

      _this.isChanged = function() {
        return !_utils['default'].isSame(
          _this.getPristineValues(),
          _this.getCurrentValues(),
        );
      };

      _this.submit = function(event) {
        if (event && event.preventDefault) {
          event.preventDefault();
        } // Trigger form as not pristine.
        // If any inputs have not been touched yet this will make them dirty
        // so validation becomes visible (if based on isPristine)

        _this.setFormPristine(false);

        var model = _this.getModel();

        _this.props.onSubmit(
          model,
          _this.resetModel,
          _this.updateInputsWithError,
        );

        if (_this.state.isValid) {
          _this.props.onValidSubmit(
            model,
            _this.resetModel,
            _this.updateInputsWithError,
          );
        } else {
          _this.props.onInvalidSubmit(
            model,
            _this.resetModel,
            _this.updateInputsWithError,
          );
        }
      };

      _this.updateInputsWithError = function(errors, invalidate) {
        Object.keys(errors).forEach(function(name) {
          var component = _utils['default'].find(_this.inputs, function(input) {
            return input.props.name === name;
          });

          if (!component) {
            throw new Error(
              'You are trying to update an input that does not exist. Verify errors object with input names. '.concat(
                JSON.stringify(errors),
              ),
            );
          }

          var args = [
            {
              isValid: _this.props.preventExternalInvalidation,
              externalError:
                typeof errors[name] === 'string'
                  ? [errors[name]]
                  : errors[name],
            },
          ];
          component.setState.apply(component, args);
        });

        if (invalidate && _this.state.isValid) {
          _this.setFormValidState(false);
        }
      };

      _this.validate = function(component) {
        // Trigger onChange
        if (_this.state.canChange) {
          _this.props.onChange(_this.getModel(), _this.isChanged());
        }

        var validation = _this.runValidation(component); // Run through the validations, split them up and call
        // the validator IF there is a value or it is required

        component.setState(
          {
            isValid: validation.isValid,
            isRequired: validation.isRequired,
            validationError: validation.error,
            externalError: null,
          },
          _this.validateForm,
        );
      };

      _this.validateForm = function() {
        // We need a callback as we are validating all inputs again. This will
        // run when the last component has set its state
        var onValidationComplete = function onValidationComplete() {
          var allIsValid = _this.inputs.every(function(component) {
            return component.state.isValid;
          });

          _this.setFormValidState(allIsValid); // Tell the form that it can start to trigger change events

          _this.setState({
            canChange: true,
          });
        }; // Run validation again in case affected by other inputs. The
        // last component validated will run the onValidationComplete callback

        _this.inputs.forEach(function(component, index) {
          var validation = _this.runValidation(component);

          if (validation.isValid && component.state.externalError) {
            validation.isValid = false;
          }

          component.setState(
            {
              isValid: validation.isValid,
              isRequired: validation.isRequired,
              validationError: validation.error,
              externalError:
                !validation.isValid && component.state.externalError
                  ? component.state.externalError
                  : null,
            },
            index === _this.inputs.length - 1 ? onValidationComplete : null,
          );
        }); // If there are no inputs, set state where form is ready to trigger
        // change event. New inputs might be added later

        if (!_this.inputs.length) {
          _this.setState({
            canChange: true,
          });
        }
      };

      _this.render = function() {
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
          nonFormsyProps = _objectWithoutProperties(_this$props, [
            'getErrorMessage',
            'getErrorMessages',
            'getValue',
            'hasValue',
            'isFormDisabled',
            'isFormSubmitted',
            'isPristine',
            'isRequired',
            'isValid',
            'isValidValue',
            'mapping',
            'onChange',
            'onInvalidSubmit',
            'onInvalid',
            'onReset',
            'onSubmit',
            'onValid',
            'onValidSubmit',
            'preventExternalInvalidation',
            'resetValue',
            'setValidations',
            'setValue',
            'showError',
            'showRequired',
            'validationErrors',
          ]);

        return _react['default'].createElement(
          'form',
          _objectSpread(
            {
              onReset: _this.resetInternal,
              onSubmit: _this.submit,
            },
            nonFormsyProps,
            {
              disabled: false,
            },
          ),
          _this.props.children,
        );
      };

      _this.state = {
        isValid: true,
        isSubmitting: false,
        canChange: false,
      };
      _this.inputs = [];
      _this.emptyArray = [];
      return _this;
    }

    return Formsy;
  })(_react['default'].Component);

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
  validationErrors: null,
};
Formsy.propTypes = {
  children: _propTypes['default'].node,
  disabled: _propTypes['default'].bool,
  getErrorMessage: _propTypes['default'].func,
  getErrorMessages: _propTypes['default'].func,
  getValue: _propTypes['default'].func,
  hasValue: _propTypes['default'].func,
  isFormDisabled: _propTypes['default'].func,
  isFormSubmitted: _propTypes['default'].func,
  isPristine: _propTypes['default'].func,
  isRequired: _propTypes['default'].func,
  isValid: _propTypes['default'].func,
  isValidValue: _propTypes['default'].func,
  mapping: _propTypes['default'].func,
  onChange: _propTypes['default'].func,
  onInvalid: _propTypes['default'].func,
  onInvalidSubmit: _propTypes['default'].func,
  onReset: _propTypes['default'].func,
  onSubmit: _propTypes['default'].func,
  onValid: _propTypes['default'].func,
  onValidSubmit: _propTypes['default'].func,
  preventExternalInvalidation: _propTypes['default'].bool,
  resetValue: _propTypes['default'].func,
  setValidations: _propTypes['default'].func,
  setValue: _propTypes['default'].func,
  showError: _propTypes['default'].func,
  showRequired: _propTypes['default'].func,
  validationErrors: _propTypes['default'].object, // eslint-disable-line
};
Formsy.childContextTypes = {
  formsy: _propTypes['default'].object,
};

var addValidationRule = function addValidationRule(name, func) {
  _validationRules['default'][name] = func;
};

exports.addValidationRule = addValidationRule;
var _default = Formsy;
exports['default'] = _default;
