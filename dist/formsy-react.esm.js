import { isPlainObject, set, has, get } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return isPlainObject(value);
}
function isTypeUndefined(value) {
  return typeof value === 'undefined';
}
function isDate(value) {
  return value instanceof Date;
}
function isFunction(value) {
  return value !== null && typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function isNumber(value) {
  return typeof value === 'number';
}
function isRegex(value) {
  return value instanceof RegExp;
}
function isValueStringEmpty(value) {
  return value === '';
}
function isValueNullOrUndefined(value) {
  return value === null || value === undefined;
}
function isValueUndefined(value) {
  return value === undefined;
}
function noop() {// do nothing.
}
function protectAgainstParamReassignment(value) {
  // Clone objects to avoid accidental param reassignment
  if (isObject(value)) return _extends({}, value);
  if (isArray(value)) return [].concat(value);
  return value;
}
function isSame(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every(function (item, index) {
      return isSame(item, b[index]);
    });
  }

  if (isFunction(a) && isFunction(b)) {
    return a.toString() === b.toString();
  }

  if (isDate(a) && isDate(b)) {
    return a.toString() === b.toString();
  }

  if (isObject(a) && isObject(b)) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    return Object.keys(a).every(function (key) {
      return isSame(a[key], b[key]);
    });
  }

  if (isRegex(a) && isRegex(b)) {
    return a.toString() === b.toString();
  }

  return a === b;
}
function runRules(value, currentValues, validations, validationRules) {
  var results = {
    errors: [],
    failed: [],
    success: []
  };
  Object.keys(validations).forEach(function (validationName) {
    var validationsVal = validations[validationName];
    var validationRulesVal = validationRules[validationName];

    var addToResults = function addToResults(validation) {
      if (isString(validation)) {
        results.errors.push(validation);
        results.failed.push(validationName);
      } else if (!validation) {
        results.failed.push(validationName);
      } else {
        results.success.push(validationName);
      }
    };

    if (validationRulesVal && isFunction(validationsVal)) {
      throw new Error("Formsy does not allow you to override default validations: " + validationName);
    }

    if (!validationRulesVal && !isFunction(validationsVal)) {
      throw new Error("Formsy does not have the validation rule: " + validationName);
    }

    if (isFunction(validationsVal)) {
      return addToResults(validationsVal(currentValues, value));
    }

    return addToResults(validationRulesVal(currentValues, value, validationsVal));
  });
  return results;
}
function throttle(callback, interval) {
  var enableCall = true;
  return function () {
    if (!enableCall) return;
    enableCall = false;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
    setTimeout(function () {
      return enableCall = true;
    }, interval);
  };
}

function _isExisty(value) {
  return !isValueNullOrUndefined(value);
}
function isEmpty(value) {
  if (isString(value)) {
    return isValueStringEmpty(value);
  }

  if (isTypeUndefined(value)) {
    return false;
  }

  return isValueUndefined(value);
}

function _isDefaultRequiredValue(value) {
  return isString(value) ? isValueStringEmpty(value) : isValueNullOrUndefined(value);
}
function matchRegexp(_values, value, regexp) {
  return !_isExisty(value) || isEmpty(value) || regexp.test("" + value);
}
var REGEX_PATTERNS = {
  ALPHA: /^[A-Z]+$/i,
  ALPHANUMERIC: /^[0-9A-Z]+$/i,
  EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
  FLOAT: /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/,
  INT: /^(?:[-+]?(?:0|[1-9]\d*))$/,
  NUMERIC: /^[-+]?(?:\d*[.])?\d+$/,
  SPECIAL_WORDS: /^[\sA-ZÀ-ÖØ-öø-ÿ]+$/i,
  URL: /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i,
  WORDS: /^[A-Z\s]+$/i
};
var validations = {
  equals: function equals(_values, value, eql) {
    return !_isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField: function equalsField(values, value, field) {
    return value === values[field];
  },
  isAlpha: function isAlpha(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.ALPHA);
  },
  isAlphanumeric: function isAlphanumeric(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.ALPHANUMERIC);
  },
  isDefaultRequiredValue: function isDefaultRequiredValue(_values, value) {
    return _isDefaultRequiredValue(value);
  },
  isEmail: function isEmail(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.EMAIL);
  },
  isEmptyString: function isEmptyString(_values, value) {
    return isEmpty(value);
  },
  isExisty: function isExisty(_values, value) {
    return _isExisty(value);
  },
  isFalse: function isFalse(_values, value) {
    return value === false;
  },
  isFloat: function isFloat(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.FLOAT);
  },
  isInt: function isInt(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.INT);
  },
  isLength: function isLength(_values, value, length) {
    return !_isExisty(value) || isEmpty(value) || value.length === length;
  },
  isNumeric: function isNumeric(values, value) {
    return isNumber(value) || matchRegexp(values, value, REGEX_PATTERNS.NUMERIC);
  },
  isSpecialWords: function isSpecialWords(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.SPECIAL_WORDS);
  },
  isTrue: function isTrue(_values, value) {
    return value === true;
  },
  isUndefined: function isUndefined(_values, value) {
    return isValueUndefined(value);
  },
  isUrl: function isUrl(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.URL);
  },
  isWords: function isWords(values, value) {
    return matchRegexp(values, value, REGEX_PATTERNS.WORDS);
  },
  matchRegexp: matchRegexp,
  maxLength: function maxLength(_values, value, length) {
    return !_isExisty(value) || value.length <= length;
  },
  minLength: function minLength(_values, value, length) {
    return !_isExisty(value) || isEmpty(value) || value.length >= length;
  }
};
var addValidationRule = function addValidationRule(name, func) {
  validations[name] = func;
};

var noFormsyErrorMessage = 'Could not find Formsy Context Provider. Did you use withFormsy outside <Formsy />?';

var throwNoFormsyProvider = function throwNoFormsyProvider() {
  // istanbul ignore next
  throw new Error(noFormsyErrorMessage);
};

var defaultValue = {
  attachToForm: throwNoFormsyProvider,
  detachFromForm: throwNoFormsyProvider,
  isFormDisabled: true,
  isValidValue: throwNoFormsyProvider,
  validate: throwNoFormsyProvider,
  runValidation: throwNoFormsyProvider
};
var FormsyContext = /*#__PURE__*/React.createContext(defaultValue);

/* eslint-disable react/default-props-match-prop-types */

var convertValidationsToObject = function convertValidationsToObject(validations) {
  if (isString(validations)) {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce(function (validationsAccumulator, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();
      args = args.map(function (arg) {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      } // Avoid parameter reassignment


      var validationsAccumulatorCopy = _extends({}, validationsAccumulator);

      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

var propTypes = {
  innerRef: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: /*#__PURE__*/PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]),
  validations: /*#__PURE__*/PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.any
};

function getDisplayName(component) {
  return component.displayName || component.name || (isString(component) ? component : 'Component');
}

function withFormsy(WrappedComponent) {
  var WithFormsyWrapper = /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(WithFormsyWrapper, _React$Component);

    function WithFormsyWrapper(props) {
      var _this;

      _this = _React$Component.call(this, props) || this;

      _this.getErrorMessage = function () {
        var messages = _this.getErrorMessages();

        return messages.length ? messages[0] : null;
      };

      _this.getErrorMessages = function () {
        var validationError = _this.state.validationError;

        if (!_this.isValid() || _this.showRequired()) {
          return validationError || [];
        }

        return [];
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.getValue = function () {
        return _this.state.value;
      };

      _this.setValidations = function (validations, required) {
        // Add validations to the store itself as the props object can not be modified
        _this.validations = convertValidationsToObject(validations) || {};
        _this.requiredValidations = required === true ? {
          isDefaultRequiredValue: required
        } : convertValidationsToObject(required);
      }; // By default, we validate after the value has been set.
      // A user can override this and pass a second parameter of `false` to skip validation.


      _this.setValue = function (value, validate) {
        if (validate === void 0) {
          validate = true;
        }

        var validateForm = _this.props.validate;

        if (!validate) {
          _this.setState({
            value: value
          });
        } else {
          _this.setState({
            value: value,
            isPristine: false
          }, function () {
            validateForm(_assertThisInitialized(_this));
          });
        }
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.hasValue = function () {
        var value = _this.state.value;
        return _isDefaultRequiredValue(value);
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isFormDisabled = function () {
        return _this.props.isFormDisabled;
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isFormSubmitted = function () {
        return _this.state.formSubmitted;
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isPristine = function () {
        return _this.state.isPristine;
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isRequired = function () {
        return !!_this.props.required;
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isValid = function () {
        return _this.state.isValid;
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.isValidValue = function (value) {
        return _this.props.isValidValue(_assertThisInitialized(_this), value);
      };

      _this.resetValue = function () {
        var pristineValue = _this.state.pristineValue;
        var validate = _this.props.validate;

        _this.setState({
          value: pristineValue,
          isPristine: true
        }, function () {
          validate(_assertThisInitialized(_this));
        });
      };

      _this.showError = function () {
        return !_this.showRequired() && !_this.isValid();
      }; // eslint-disable-next-line react/destructuring-assignment


      _this.showRequired = function () {
        return _this.state.isRequired;
      };

      var runValidation = props.runValidation,
          validations = props.validations,
          required = props.required,
          value = props.value;
      _this.state = {
        value: value
      };

      _this.setValidations(validations, required);

      _this.state = _extends({
        formSubmitted: false,
        isPristine: true,
        pristineValue: props.value,
        value: props.value
      }, runValidation(_assertThisInitialized(_this), props.value));
      return _this;
    }

    var _proto = WithFormsyWrapper.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var _this$props = this.props,
          name = _this$props.name,
          attachToForm = _this$props.attachToForm;

      if (!name) {
        throw new Error('Form Input requires a name property when used');
      }

      attachToForm(this);
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      var props = this.props,
          state = this.state;

      var isChanged = function isChanged(a, b) {
        return Object.keys(a).some(function (k) {
          return a[k] !== b[k];
        });
      };

      var isPropsChanged = isChanged(props, nextProps);
      var isStateChanged = isChanged(state, nextState);
      return isPropsChanged || isStateChanged;
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          value = _this$props2.value,
          validations = _this$props2.validations,
          required = _this$props2.required,
          validate = _this$props2.validate; // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run

      if (!isSame(value, prevProps.value)) {
        this.setValue(value);
      } // If validations or required is changed, run a new validation


      if (!isSame(validations, prevProps.validations) || !isSame(required, prevProps.required)) {
        this.setValidations(validations, required);
        validate(this);
      }
    } // Detach it when component unmounts
    ;

    _proto.componentWillUnmount = function componentWillUnmount() {
      var detachFromForm = this.props.detachFromForm;
      detachFromForm(this);
    };

    _proto.render = function render() {
      var innerRef = this.props.innerRef;

      var propsForElement = _extends({}, this.props, {
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
        value: this.getValue()
      });

      if (innerRef) {
        propsForElement.ref = innerRef;
      }

      return React.createElement(WrappedComponent, propsForElement);
    };

    return WithFormsyWrapper;
  }(React.Component);

  WithFormsyWrapper.displayName = "Formsy(" + getDisplayName(WrappedComponent) + ")";
  WithFormsyWrapper.propTypes = propTypes;
  WithFormsyWrapper.defaultProps = {
    innerRef: null,
    required: false,
    validationError: '',
    validationErrors: {},
    validations: null,
    value: WrappedComponent.defaultValue
  }; // eslint-disable-next-line react/display-name

  return function (props) {
    return React.createElement(FormsyContext.Consumer, null, function (contextValue) {
      return React.createElement(WithFormsyWrapper, _extends({}, props, contextValue));
    });
  };
}

var ONE_RENDER_FRAME = 66;
var Formsy = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Formsy, _React$Component);

  function Formsy(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.prevInputNames = null;

    _this.componentDidMount = function () {
      _this.prevInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });

      _this.validateForm();
    };

    _this.componentDidUpdate = function (prevProps) {
      var _this$props = _this.props,
          validationErrors = _this$props.validationErrors,
          disabled = _this$props.disabled;

      if (validationErrors && isObject(validationErrors) && Object.keys(validationErrors).length > 0) {
        _this.setInputValidationErrors(validationErrors);
      }

      var newInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });

      if (_this.prevInputNames && !isSame(_this.prevInputNames, newInputNames)) {
        _this.prevInputNames = newInputNames;

        _this.validateForm();
      } // Keep the disabled value in state/context the same as from props


      if (disabled !== prevProps.disabled) {
        // eslint-disable-next-line
        _this.setState(function (state) {
          return _extends({}, state, {
            contextValue: _extends({}, state.contextValue, {
              isFormDisabled: disabled
            })
          });
        });
      }
    };

    _this.getCurrentValues = function () {
      return _this.inputs.reduce(function (valueAccumulator, component) {
        var name = component.props.name,
            value = component.state.value; // eslint-disable-next-line no-param-reassign

        valueAccumulator[name] = protectAgainstParamReassignment(value);
        return valueAccumulator;
      }, {});
    };

    _this.getModel = function () {
      var currentValues = _this.getCurrentValues();

      return _this.mapModel(currentValues);
    };

    _this.getPristineValues = function () {
      return _this.inputs.reduce(function (valueAccumulator, component) {
        var _component$props = component.props,
            name = _component$props.name,
            value = _component$props.value; // eslint-disable-next-line no-param-reassign

        valueAccumulator[name] = protectAgainstParamReassignment(value);
        return valueAccumulator;
      }, {});
    };

    _this.setFormPristine = function (isPristine) {
      _this.setState({
        formSubmitted: !isPristine
      }); // Iterate through each component and set it as pristine
      // or "dirty".


      _this.inputs.forEach(function (component) {
        component.setState({
          formSubmitted: !isPristine,
          isPristine: isPristine
        });
      });
    };

    _this.setInputValidationErrors = function (errors) {
      var preventExternalInvalidation = _this.props.preventExternalInvalidation;
      var isValid = _this.state.isValid;

      _this.inputs.forEach(function (component) {
        var name = component.props.name;
        component.setState({
          isValid: !(name in errors),
          validationError: isString(errors[name]) ? [errors[name]] : errors[name]
        });
      });

      if (!preventExternalInvalidation && isValid) {
        _this.setFormValidState(false);
      }
    };

    _this.setFormValidState = function (allIsValid) {
      var _this$props2 = _this.props,
          onValid = _this$props2.onValid,
          onInvalid = _this$props2.onInvalid;

      _this.setState({
        isValid: allIsValid
      });

      if (allIsValid) {
        onValid();
      } else {
        onInvalid();
      }
    };

    _this.isValidValue = function (component, value) {
      return _this.runValidation(component, value).isValid;
    }; // eslint-disable-next-line react/destructuring-assignment


    _this.isFormDisabled = function () {
      return _this.props.disabled;
    };

    _this.mapModel = function (model) {
      var mapping = _this.props.mapping;

      if (mapping) {
        return mapping(model);
      }

      var returnModel = {};
      Object.keys(model).forEach(function (key) {
        set(returnModel, key, model[key]);
      });
      return returnModel;
    };

    _this.reset = function (model) {
      _this.setFormPristine(true);

      _this.resetModel(model);
    };

    _this.resetInternal = function (event) {
      var onReset = _this.props.onReset;
      event.preventDefault();

      _this.reset();

      if (onReset) {
        onReset();
      }
    }; // Reset each key in the model to the original / initial / specified value


    _this.resetModel = function (data) {
      _this.inputs.forEach(function (component) {
        var name = component.props.name;

        if (data && has(data, name)) {
          component.setValue(get(data, name));
        } else {
          component.resetValue();
        }
      });

      _this.validateForm();
    }; // Checks validation on current value or a passed value


    _this.runValidation = function (component, value) {
      if (value === void 0) {
        value = component.state.value;
      }

      var validationErrors = _this.props.validationErrors;
      var _component$props2 = component.props,
          validationError = _component$props2.validationError,
          componentValidationErrors = _component$props2.validationErrors,
          name = _component$props2.name;

      var currentValues = _this.getCurrentValues();

      var validationResults = runRules(value, currentValues, component.validations, validations);
      var requiredResults = runRules(value, currentValues, component.requiredValidations, validations);
      var isRequired = Object.keys(component.requiredValidations).length ? !!requiredResults.success.length : false;
      var isValid = !validationResults.failed.length && !(validationErrors && validationErrors[component.props.name]);
      return {
        isRequired: isRequired,
        isValid: isRequired ? false : isValid,
        validationError: function () {
          if (isValid && !isRequired) {
            return _this.emptyArray;
          }

          if (validationResults.errors.length) {
            return validationResults.errors;
          }

          if (validationErrors && validationErrors[name]) {
            return isString(validationErrors[name]) ? [validationErrors[name]] : validationErrors[name];
          }

          if (isRequired) {
            var error = componentValidationErrors[requiredResults.success[0]] || validationError;
            return error ? [error] : null;
          }

          if (validationResults.failed.length) {
            return validationResults.failed.map(function (failed) {
              return componentValidationErrors[failed] ? componentValidationErrors[failed] : validationError;
            }).filter(function (x, pos, arr) {
              return arr.indexOf(x) === pos;
            }); // remove duplicates
          } // This line is not reachable
          // istanbul ignore next


          return undefined;
        }()
      };
    }; // Method put on each input component to register
    // itself to the form


    _this.attachToForm = function (component) {
      if (_this.inputs.indexOf(component) === -1) {
        _this.inputs.push(component);
      }

      var onChange = _this.props.onChange;
      var canChange = _this.state.canChange; // Trigger onChange

      if (canChange) {
        onChange(_this.getModel(), _this.isChanged());
      } // Will be triggered immediately & every one frame rate


      _this.throttledValidateForm();
    }; // Method put on each input component to unregister
    // itself from the form


    _this.detachFromForm = function (component) {
      var componentPos = _this.inputs.indexOf(component);

      if (componentPos !== -1) {
        _this.inputs = _this.inputs.slice(0, componentPos).concat(_this.inputs.slice(componentPos + 1));
      }

      _this.validateForm();
    }; // Checks if the values have changed from their initial value


    _this.isChanged = function () {
      return !isSame(_this.getPristineValues(), _this.getCurrentValues());
    }; // Update model, submit to url prop and send the model


    _this.submit = function (event) {
      var _this$props3 = _this.props,
          onSubmit = _this$props3.onSubmit,
          onValidSubmit = _this$props3.onValidSubmit,
          onInvalidSubmit = _this$props3.onInvalidSubmit,
          preventDefaultSubmit = _this$props3.preventDefaultSubmit;
      var isValid = _this.state.isValid;

      if (preventDefaultSubmit && event && event.preventDefault) {
        event.preventDefault();
      } // Trigger form as not pristine.
      // If any inputs have not been touched yet this will make them dirty
      // so validation becomes visible (if based on isPristine)


      _this.setFormPristine(false);

      var model = _this.getModel();

      onSubmit(model, _this.resetModel, _this.updateInputsWithError, event);

      if (isValid) {
        onValidSubmit(model, _this.resetModel, _this.updateInputsWithError, event);
      } else {
        onInvalidSubmit(model, _this.resetModel, _this.updateInputsWithError, event);
      }
    }; // Go through errors from server and grab the components
    // stored in the inputs map. Change their state to invalid
    // and set the serverError message


    _this.updateInputsWithError = function (errors, invalidate) {
      var preventExternalInvalidation = _this.props.preventExternalInvalidation;
      var isValid = _this.state.isValid;
      Object.entries(errors).forEach(function (_ref) {
        var name = _ref[0],
            error = _ref[1];

        var component = _this.inputs.find(function (input) {
          return input.props.name === name;
        });

        if (!component) {
          throw new Error("You are trying to update an input that does not exist. Verify errors object with input names. " + JSON.stringify(errors));
        }

        component.setState({
          isValid: preventExternalInvalidation,
          validationError: isString(error) ? [error] : error
        });
      });

      if (invalidate && isValid) {
        _this.setFormValidState(false);
      }
    }; // Set the value of components


    _this.updateInputsWithValue = function (data, validate) {
      _this.inputs.forEach(function (component) {
        var name = component.props.name;

        if (data && has(data, name)) {
          component.setValue(get(data, name), validate);
        }
      });
    }; // Use the binded values and the actual input value to
    // validate the input and set its state. Then check the
    // state of the form itself


    _this.validate = function (component) {
      var onChange = _this.props.onChange;
      var canChange = _this.state.canChange; // Trigger onChange

      if (canChange) {
        onChange(_this.getModel(), _this.isChanged());
      }

      var validationState = _this.runValidation(component); // Run through the validations, split them up and call
      // the validator IF there is a value or it is required


      component.setState(validationState, _this.validateForm);
    }; // Validate the form by going through all child input components
    // and check their state


    _this.validateForm = function () {
      // We need a callback as we are validating all inputs again. This will
      // run when the last component has set its state
      var onValidationComplete = function onValidationComplete() {
        var allIsValid = _this.inputs.every(function (component) {
          return component.state.isValid;
        });

        _this.setFormValidState(allIsValid); // Tell the form that it can start to trigger change events


        _this.setState({
          canChange: true
        });
      }; // Run validation again in case affected by other inputs. The
      // last component validated will run the onValidationComplete callback


      _this.inputs.forEach(function (component, index) {
        var validationState = _this.runValidation(component);

        var isFinalInput = index === _this.inputs.length - 1;
        var callback = isFinalInput ? onValidationComplete : null;
        component.setState(validationState, callback);
      }); // If there are no inputs, set state where form is ready to trigger
      // change event. New inputs might be added later


      if (!_this.inputs.length) {
        _this.setState({
          canChange: true
        }, onValidationComplete);
      }
    };

    _this.state = {
      canChange: false,
      isSubmitting: false,
      isValid: true,
      contextValue: {
        attachToForm: _this.attachToForm,
        detachFromForm: _this.detachFromForm,
        isFormDisabled: props.disabled,
        isValidValue: _this.isValidValue,
        validate: _this.validate,
        runValidation: _this.runValidation
      }
    };
    _this.inputs = [];
    _this.emptyArray = [];
    _this.throttledValidateForm = throttle(_this.validateForm, ONE_RENDER_FRAME);
    return _this;
  }

  var _proto = Formsy.prototype;

  _proto.render = function render() {
    var _this$props4 = this.props,
        children = _this$props4.children,
        disabled = _this$props4.disabled,
        formElement = _this$props4.formElement,
        nonFormsyProps = _objectWithoutPropertiesLoose(_this$props4, ["children", "mapping", "onChange", "onInvalid", "onInvalidSubmit", "onReset", "onSubmit", "onValid", "onValidSubmit", "preventDefaultSubmit", "preventExternalInvalidation", "validationErrors", "disabled", "formElement"]);

    var contextValue = this.state.contextValue;
    return React.createElement(FormsyContext.Provider, {
      value: contextValue
    }, React.createElement(formElement, _extends({
      onReset: this.resetInternal,
      onSubmit: this.submit
    }, nonFormsyProps, {
      disabled: disabled
    }), children));
  };

  return Formsy;
}(React.Component);
Formsy.displayName = 'Formsy';
Formsy.propTypes = {
  disabled: PropTypes.bool,
  mapping: PropTypes.func,
  formElement: /*#__PURE__*/PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  onChange: PropTypes.func,
  onInvalid: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onValidSubmit: PropTypes.func,
  preventDefaultSubmit: PropTypes.bool,
  preventExternalInvalidation: PropTypes.bool,
  validationErrors: PropTypes.object
};
Formsy.defaultProps = {
  disabled: false,
  mapping: null,
  onChange: noop,
  onInvalid: noop,
  onInvalidSubmit: noop,
  onReset: noop,
  onSubmit: noop,
  onValid: noop,
  onValidSubmit: noop,
  preventDefaultSubmit: true,
  preventExternalInvalidation: false,
  validationErrors: {},
  formElement: 'form'
};

export default Formsy;
export { addValidationRule, propTypes, validations as validationRules, withFormsy };
//# sourceMappingURL=formsy-react.esm.js.map
