'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.propTypes = void 0;

var _propTypes = _interopRequireDefault(require('prop-types'));

var _react = _interopRequireDefault(require('react'));

var _utils = _interopRequireDefault(require('./utils'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }
  return self;
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

/* eslint-disable react/default-props-match-prop-types */
var convertValidationsToObject = function convertValidationsToObject(
  validations,
) {
  if (typeof validations === 'string') {
    return validations
      .split(/,(?![^{[]*[}\]])/g)
      .reduce(function(validationsAccumulator, validation) {
        var args = validation.split(':');
        var validateMethod = args.shift();
        args = args.map(function(arg) {
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
        } // Avoid parameter reassignment

        var validationsAccumulatorCopy = Object.assign(
          {},
          validationsAccumulator,
        );
        validationsAccumulatorCopy[validateMethod] = args.length
          ? args[0]
          : true;
        return validationsAccumulatorCopy;
      }, {});
  }

  return validations || {};
};

var propTypes = {
  innerRef: _propTypes['default'].func,
  name: _propTypes['default'].string.isRequired,
  required: _propTypes['default'].oneOfType([
    _propTypes['default'].bool,
    _propTypes['default'].object,
    _propTypes['default'].string,
  ]),
  validations: _propTypes['default'].oneOfType([
    _propTypes['default'].object,
    _propTypes['default'].string,
  ]),
  value: _propTypes['default'].any, // eslint-disable-line react/forbid-prop-types
};
exports.propTypes = propTypes;

var _default = function _default(Component) {
  var WrappedComponent =
    /*#__PURE__*/
    (function(_React$Component) {
      _inherits(WrappedComponent, _React$Component);

      function WrappedComponent(props) {
        var _this;

        _classCallCheck(this, WrappedComponent);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(WrappedComponent).call(this, props),
        );

        _this.getErrorMessage = function() {
          var messages = _this.getErrorMessages();

          return messages.length ? messages[0] : null;
        };

        _this.getErrorMessages = function() {
          if (!_this.isValid() || _this.showRequired()) {
            return (
              _this.state.externalError || _this.state.validationError || []
            );
          }

          return [];
        };

        _this.getValue = function() {
          return _this.state.value;
        };

        _this.setValidations = function(validations, required) {
          // Add validations to the store itself as the props object can not be modified
          _this.validations = convertValidationsToObject(validations) || {};
          _this.requiredValidations =
            required === true
              ? {
                  isDefaultRequiredValue: true,
                }
              : convertValidationsToObject(required);
        };

        _this.setValue = function(value) {
          var validate =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : true;

          if (!validate) {
            _this.setState({
              value: value,
            });
          } else {
            _this.setState(
              {
                value: value,
                isPristine: false,
              },
              function() {
                _this.context.formsy.validate(_assertThisInitialized(_this));
              },
            );
          }
        };

        _this.hasValue = function() {
          return _this.state.value !== '';
        };

        _this.isFormDisabled = function() {
          return _this.context.formsy.isFormDisabled();
        };

        _this.isFormSubmitted = function() {
          return _this.state.formSubmitted;
        };

        _this.isPristine = function() {
          return _this.state.isPristine;
        };

        _this.isRequired = function() {
          return !!_this.props.required;
        };

        _this.isValid = function() {
          return _this.state.isValid;
        };

        _this.isValidValue = function(value) {
          return _this.context.formsy.isValidValue.call(
            null,
            _assertThisInitialized(_this),
            value,
          );
        };

        _this.resetValue = function() {
          _this.setState(
            {
              value: _this.state.pristineValue,
              isPristine: true,
            },
            function() {
              _this.context.formsy.validate(_assertThisInitialized(_this));
            },
          );
        };

        _this.showError = function() {
          return !_this.showRequired() && !_this.isValid();
        };

        _this.showRequired = function() {
          return _this.state.isRequired;
        };

        _this.state = {
          value: props.value,
          isRequired: false,
          isValid: true,
          isPristine: true,
          pristineValue: props.value,
          validationError: [],
          externalError: null,
          formSubmitted: false,
        };
        return _this;
      }

      _createClass(WrappedComponent, [
        {
          key: 'componentWillMount',
          value: function componentWillMount() {
            var _this2 = this;

            var configure = function configure() {
              _this2.setValidations(
                _this2.props.validations,
                _this2.props.required,
              ); // Pass a function instead?

              _this2.context.formsy.attachToForm(_this2);
            };

            if (!this.props.name) {
              throw new Error('Form Input requires a name property when used');
            }

            configure();
          }, // We have to make sure the validate method is kept when new props are added
        },
        {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            this.setValidations(nextProps.validations, nextProps.required);
          },
        },
        {
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState) {
            var _this3 = this;

            var isPropsChanged = Object.keys(this.props).some(function(k) {
              return _this3.props[k] !== nextProps[k];
            });
            var isStateChanged = Object.keys(this.state).some(function(k) {
              return _this3.state[k] !== nextState[k];
            });
            return isPropsChanged || isStateChanged;
          },
        },
        {
          key: 'componentDidUpdate',
          value: function componentDidUpdate(prevProps) {
            // If the value passed has changed, set it. If value is not passed it will
            // internally update, and this will never run
            if (!_utils['default'].isSame(this.props.value, prevProps.value)) {
              this.setValue(this.props.value);
            } // If validations or required is changed, run a new validation

            if (
              !_utils['default'].isSame(
                this.props.validations,
                prevProps.validations,
              ) ||
              !_utils['default'].isSame(this.props.required, prevProps.required)
            ) {
              this.context.formsy.validate(this);
            }
          }, // Detach it when component unmounts
        },
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.context.formsy.detachFromForm(this);
          },
        },
        {
          key: 'render',
          value: function render() {
            var innerRef = this.props.innerRef;

            var propsForElement = _objectSpread({}, this.props, {
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
            });

            if (innerRef) {
              propsForElement.ref = innerRef;
            }

            return _react['default'].createElement(Component, propsForElement);
          },
        },
      ]);

      return WrappedComponent;
    })(_react['default'].Component);

  function getDisplayName(component) {
    return (
      component.displayName ||
      component.name ||
      (typeof component === 'string' ? component : 'Component')
    );
  }

  WrappedComponent.displayName = 'Formsy('.concat(
    getDisplayName(Component),
    ')',
  );
  WrappedComponent.contextTypes = {
    formsy: _propTypes['default'].object, // What about required?
  };
  WrappedComponent.defaultProps = {
    innerRef: null,
    required: false,
    validationError: '',
    validationErrors: {},
    validations: null,
    value: Component.defaultValue,
  };
  WrappedComponent.propTypes = propTypes;
  return WrappedComponent;
};

exports['default'] = _default;
