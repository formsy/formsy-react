'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var convertValidationsToObject = function convertValidationsToObject(validations) {
  if (typeof validations === 'string') {
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
      }

      // Avoid parameter reassignment
      var validationsAccumulatorCopy = Object.assign({}, validationsAccumulator);
      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

var propTypes = {
  innerRef: _propTypes2.default.func,
  name: _propTypes2.default.string.isRequired,
  required: _propTypes2.default.bool,
  validations: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
  value: _propTypes2.default.any // eslint-disable-line react/forbid-prop-types
};

exports.propTypes = propTypes;

exports.default = function (Component) {
  var WrappedComponent = function (_React$Component) {
    _inherits(WrappedComponent, _React$Component);

    function WrappedComponent(props) {
      _classCallCheck(this, WrappedComponent);

      var _this = _possibleConstructorReturn(this, (WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call(this, props));

      _this.state = {
        value: props.value,
        isRequired: false,
        isValid: true,
        isPristine: true,
        pristineValue: props.value,
        validationError: [],
        externalError: null,
        formSubmitted: false
      };
      _this.getErrorMessage = _this.getErrorMessage.bind(_this);
      _this.getErrorMessages = _this.getErrorMessages.bind(_this);
      _this.getValue = _this.getValue.bind(_this);
      _this.isFormDisabled = _this.isFormDisabled.bind(_this);
      _this.isPristine = _this.isPristine.bind(_this);
      _this.isRequired = _this.isRequired.bind(_this);
      _this.isValid = _this.isValid.bind(_this);
      _this.resetValue = _this.resetValue.bind(_this);
      _this.setValue = _this.setValue.bind(_this);
      _this.showRequired = _this.showRequired.bind(_this);
      return _this;
    }

    _createClass(WrappedComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        var configure = function configure() {
          _this2.setValidations(_this2.props.validations, _this2.props.required);

          // Pass a function instead?
          _this2.context.formsy.attachToForm(_this2);
        };

        if (!this.props.name) {
          throw new Error('Form Input requires a name property when used');
        }

        configure();
      }

      // We have to make sure the validate method is kept when new props are added

    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.setValidations(nextProps.validations, nextProps.required);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        // If the value passed has changed, set it. If value is not passed it will
        // internally update, and this will never run
        if (!_utils2.default.isSame(this.props.value, prevProps.value)) {
          this.setValue(this.props.value);
        }

        // If validations or required is changed, run a new validation
        if (!_utils2.default.isSame(this.props.validations, prevProps.validations) || !_utils2.default.isSame(this.props.required, prevProps.required)) {
          this.context.formsy.validate(this);
        }
      }

      // Detach it when component unmounts

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.formsy.detachFromForm(this);
      }
    }, {
      key: 'getErrorMessage',
      value: function getErrorMessage() {
        var messages = this.getErrorMessages();
        return messages.length ? messages[0] : null;
      }
    }, {
      key: 'getErrorMessages',
      value: function getErrorMessages() {
        return !this.isValid() || this.showRequired() ? this.state.externalError || this.state.validationError || [] : [];
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this.state.value;
      }
    }, {
      key: 'setValidations',
      value: function setValidations(validations, required) {
        // Add validations to the store itself as the props object can not be modified
        this.validations = convertValidationsToObject(validations) || {};
        this.requiredValidations = required === true ? { isDefaultRequiredValue: true } : convertValidationsToObject(required);
      }

      // By default, we validate after the value has been set.
      // A user can override this and pass a second parameter of `false` to skip validation.

    }, {
      key: 'setValue',
      value: function setValue(value) {
        var _this3 = this;

        var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (!validate) {
          this.setState({
            value: value
          });
        } else {
          this.setState({
            value: value,
            isPristine: false
          }, function () {
            _this3.context.formsy.validate(_this3);
          });
        }
      }
    }, {
      key: 'hasValue',
      value: function hasValue() {
        return this.state.value !== '';
      }
    }, {
      key: 'isFormDisabled',
      value: function isFormDisabled() {
        return this.context.formsy.isFormDisabled();
      }
    }, {
      key: 'isFormSubmitted',
      value: function isFormSubmitted() {
        return this.state.formSubmitted;
      }
    }, {
      key: 'isPristine',
      value: function isPristine() {
        return this.state.isPristine;
      }
    }, {
      key: 'isRequired',
      value: function isRequired() {
        return !!this.props.required;
      }
    }, {
      key: 'isValid',
      value: function isValid() {
        return this.state.isValid;
      }
    }, {
      key: 'isValidValue',
      value: function isValidValue(value) {
        return this.context.formsy.isValidValue.call(null, this, value);
        // return this.props.isValidValue.call(null, this, value);
      }
    }, {
      key: 'resetValue',
      value: function resetValue() {
        var _this4 = this;

        this.setState({
          value: this.state.pristineValue,
          isPristine: true
        }, function () {
          _this4.context.formsy.validate(_this4);
        });
      }
    }, {
      key: 'showError',
      value: function showError() {
        return !this.showRequired() && !this.isValid();
      }
    }, {
      key: 'showRequired',
      value: function showRequired() {
        return this.state.isRequired;
      }
    }, {
      key: 'render',
      value: function render() {
        var innerRef = this.props.innerRef;

        var propsForElement = _extends({
          getErrorMessage: this.getErrorMessage,
          getErrorMessages: this.getErrorMessages,
          getValue: this.getValue,
          hasValue: this.hasValue,
          isFormDisabled: this.isFormDisabled,
          isValid: this.isValid,
          isPristine: this.isPristine,
          isFormSubmitted: this.isFormSubmitted,
          isRequired: this.isRequired,
          isValidValue: this.isValidValue,
          resetValue: this.resetValue,
          setValidations: this.setValidations,
          setValue: this.setValue,
          showRequired: this.showRequired,
          showError: this.showError
        }, this.props);

        if (innerRef) {
          propsForElement.ref = innerRef;
        }

        return _react2.default.createElement(Component, propsForElement);
      }
    }]);

    return WrappedComponent;
  }(_react2.default.Component);

  function getDisplayName(component) {
    return component.displayName || component.name || (typeof component === 'string' ? component : 'Component');
  }

  WrappedComponent.displayName = 'Formsy(' + getDisplayName(Component) + ')';

  WrappedComponent.contextTypes = {
    formsy: _propTypes2.default.object // What about required?
  };

  WrappedComponent.defaultProps = {
    innerRef: function innerRef() {},
    required: false,
    validationError: '',
    validationErrors: {},
    validations: null,
    value: Component.defaultValue
  };

  WrappedComponent.propTypes = propTypes;

  return WrappedComponent;
};