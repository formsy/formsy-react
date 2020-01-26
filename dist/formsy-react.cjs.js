'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var reactIs_production_min = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.suspense_list"):
60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.fundamental"):60117,w=b?Symbol.for("react.responder"):60118,x=b?Symbol.for("react.scope"):60119;function y(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function z(a){return y(a)===m}
exports.typeOf=y;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;
exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===v||a.$$typeof===w||a.$$typeof===x)};exports.isAsyncMode=function(a){return z(a)||y(a)===l};exports.isConcurrentMode=z;exports.isContextConsumer=function(a){return y(a)===k};exports.isContextProvider=function(a){return y(a)===h};
exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return y(a)===n};exports.isFragment=function(a){return y(a)===e};exports.isLazy=function(a){return y(a)===t};exports.isMemo=function(a){return y(a)===r};exports.isPortal=function(a){return y(a)===d};exports.isProfiler=function(a){return y(a)===g};exports.isStrictMode=function(a){return y(a)===f};exports.isSuspense=function(a){return y(a)===p};
});

unwrapExports(reactIs_production_min);
var reactIs_production_min_1 = reactIs_production_min.typeOf;
var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
var reactIs_production_min_6 = reactIs_production_min.Element;
var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
var reactIs_production_min_8 = reactIs_production_min.Fragment;
var reactIs_production_min_9 = reactIs_production_min.Lazy;
var reactIs_production_min_10 = reactIs_production_min.Memo;
var reactIs_production_min_11 = reactIs_production_min.Portal;
var reactIs_production_min_12 = reactIs_production_min.Profiler;
var reactIs_production_min_13 = reactIs_production_min.StrictMode;
var reactIs_production_min_14 = reactIs_production_min.Suspense;
var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
var reactIs_production_min_20 = reactIs_production_min.isElement;
var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
var reactIs_production_min_22 = reactIs_production_min.isFragment;
var reactIs_production_min_23 = reactIs_production_min.isLazy;
var reactIs_production_min_24 = reactIs_production_min.isMemo;
var reactIs_production_min_25 = reactIs_production_min.isPortal;
var reactIs_production_min_26 = reactIs_production_min.isProfiler;
var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
var reactIs_production_min_28 = reactIs_production_min.isSuspense;

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

Object.defineProperty(exports, '__esModule', { value: true });

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */
var lowPriorityWarningWithoutStack = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });

    if (typeof console !== 'undefined') {
      console.warn(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarningWithoutStack = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(void 0, [format].concat(args));
    }
  };
}

var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true;
      lowPriorityWarningWithoutStack$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.typeOf = typeOf;
exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isValidElementType = isValidElementType;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
  })();
}
});

unwrapExports(reactIs_development);
var reactIs_development_1 = reactIs_development.typeOf;
var reactIs_development_2 = reactIs_development.AsyncMode;
var reactIs_development_3 = reactIs_development.ConcurrentMode;
var reactIs_development_4 = reactIs_development.ContextConsumer;
var reactIs_development_5 = reactIs_development.ContextProvider;
var reactIs_development_6 = reactIs_development.Element;
var reactIs_development_7 = reactIs_development.ForwardRef;
var reactIs_development_8 = reactIs_development.Fragment;
var reactIs_development_9 = reactIs_development.Lazy;
var reactIs_development_10 = reactIs_development.Memo;
var reactIs_development_11 = reactIs_development.Portal;
var reactIs_development_12 = reactIs_development.Profiler;
var reactIs_development_13 = reactIs_development.StrictMode;
var reactIs_development_14 = reactIs_development.Suspense;
var reactIs_development_15 = reactIs_development.isValidElementType;
var reactIs_development_16 = reactIs_development.isAsyncMode;
var reactIs_development_17 = reactIs_development.isConcurrentMode;
var reactIs_development_18 = reactIs_development.isContextConsumer;
var reactIs_development_19 = reactIs_development.isContextProvider;
var reactIs_development_20 = reactIs_development.isElement;
var reactIs_development_21 = reactIs_development.isForwardRef;
var reactIs_development_22 = reactIs_development.isFragment;
var reactIs_development_23 = reactIs_development.isLazy;
var reactIs_development_24 = reactIs_development.isMemo;
var reactIs_development_25 = reactIs_development.isPortal;
var reactIs_development_26 = reactIs_development.isProfiler;
var reactIs_development_27 = reactIs_development.isStrictMode;
var reactIs_development_28 = reactIs_development.isSuspense;

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function toObj(source) {
  return Object.keys(source).reduce(function (output, key) {
    var parentKey = key.match(/[^\[]*/i);
    var paths = key.match(/\[.*?\]/g) || [];
    paths = [parentKey[0]].concat(paths).map(function (key) {
      return key.replace(/\[|\]/g, '');
    });
    var currentPath = output;
    while (paths.length) {
      var pathKey = paths.shift();

      if (pathKey in currentPath) {
        currentPath = currentPath[pathKey];
      } else {
        currentPath[pathKey] = paths.length ? isNaN(paths[0]) ? {} : [] : source[key];
        currentPath = currentPath[pathKey];
      }
    }

    return output;
  }, {});
}

function fromObj(obj) {
  function recur(newObj, propName, currVal) {
    if (Array.isArray(currVal) || Object.prototype.toString.call(currVal) === '[object Object]') {
      Object.keys(currVal).forEach(function(v) {
        recur(newObj, propName + "[" + v + "]", currVal[v]);
      });
      return newObj;
    }

    newObj[propName] = currVal;
    return newObj;
  }

  var keys = Object.keys(obj);
  return keys.reduce(function(newObj, propName) {
    return recur(newObj, propName, obj[propName]);
  }, {});
}

var formDataToObject = {
  fromObj: fromObj,
  toObj: toObj
};

function arraysDiffer(a, b) {
  var isDifferent = false;

  if (a.length !== b.length) {
    isDifferent = true;
  } else {
    a.forEach(function (item, index) {
      if (!isSame(item, b[index])) {
        isDifferent = true;
      }
    }, this);
  }

  return isDifferent;
}
function objectsDiffer(a, b) {
  var isDifferent = false;

  if (Object.keys(a).length !== Object.keys(b).length) {
    isDifferent = true;
  } else {
    Object.keys(a).forEach(function (key) {
      if (!isSame(a[key], b[key])) {
        isDifferent = true;
      }
    }, this);
  }

  return isDifferent;
}
function isSame(a, b) {
  if (_typeof(a) !== _typeof(b)) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return !arraysDiffer(a, b);
  }

  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }

  if (a !== null && b !== null && a instanceof Date && b instanceof Date) {
    return a.toString() === b.toString();
  }

  if (_typeof(a) === 'object' && _typeof(b) === 'object' && a !== null && b !== null) {
    return !objectsDiffer(a, b);
  }

  return a === b;
}
function find(collection, fn) {
  for (var i = 0, l = collection.length; i < l; i += 1) {
    var _item = collection[i];

    if (fn(_item)) {
      return _item;
    }
  }

  return null;
}
function runRules(value, currentValues, validations, validationRules) {
  var results = {
    errors: [],
    failed: [],
    success: []
  };

  if (Object.keys(validations).length) {
    Object.keys(validations).forEach(function (validationMethod) {
      var validationsVal = validations[validationMethod];
      var validationRulesVal = validationRules[validationMethod];

      if (validationRulesVal && typeof validationsVal === 'function') {
        throw new Error("Formsy does not allow you to override default validations: ".concat(validationMethod));
      }

      if (!validationRulesVal && typeof validationsVal !== 'function') {
        throw new Error("Formsy does not have the validation rule: ".concat(validationMethod));
      }

      if (typeof validationsVal === 'function') {
        var validation = validationsVal(currentValues, value);

        if (typeof validation === 'string') {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
          results.failed.push(validationMethod);
        }

        return;
      }

      if (typeof validationsVal !== 'function' && typeof validationRulesVal === 'function') {
        var _validation = validationRulesVal(currentValues, value, validationsVal);

        if (typeof _validation === 'string') {
          results.errors.push(_validation);
          results.failed.push(validationMethod);
        } else if (!_validation) {
          results.failed.push(validationMethod);
        } else {
          results.success.push(validationMethod);
        }

        return;
      }

      results.success.push(validationMethod);
    });
  }

  return results;
}
function noop() {// do nothing.
}
function cloneIfObject(value) {
  // Clone objects to avoid accidental param reassignment
  return _typeof(value) === 'object' ? _objectSpread2({}, value) : value;
}

var _isExisty = function isExisty(value) {
  return value !== null && value !== undefined;
};

var isEmpty = function isEmpty(value) {
  if (typeof value === 'string') {
    return value === '';
  }

  if (typeof value === 'undefined') {
    return false;
  }

  return value === undefined;
};

var validations = {
  isDefaultRequiredValue: function isDefaultRequiredValue(_values, value) {
    if (typeof value === 'string') {
      return value === '';
    }

    return value === undefined || value === null;
  },
  isExisty: function isExisty(_values, value) {
    return _isExisty(value);
  },
  matchRegexp: function matchRegexp(_values, value, regexp) {
    return !_isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined: function isUndefined(_values, value) {
    return value === undefined;
  },
  isEmptyString: function isEmptyString(_values, value) {
    return isEmpty(value);
  },
  isEmail: function isEmail(values, value) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(values, value, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
  },
  isUrl: function isUrl(values, value) {
    return validations.matchRegexp(values, value, /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i);
  },
  isTrue: function isTrue(_values, value) {
    return value === true;
  },
  isFalse: function isFalse(_values, value) {
    return value === false;
  },
  isNumeric: function isNumeric(values, value) {
    if (typeof value === 'number') {
      return true;
    }

    return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha: function isAlpha(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z]+$/i);
  },
  isAlphanumeric: function isAlphanumeric(values, value) {
    return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
  },
  isInt: function isInt(values, value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat: function isFloat(values, value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/);
  },
  isWords: function isWords(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
  },
  isSpecialWords: function isSpecialWords(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength: function isLength(_values, value, length) {
    return !_isExisty(value) || isEmpty(value) || value.length === length;
  },
  equals: function equals(_values, value, eql) {
    return !_isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField: function equalsField(values, value, field) {
    return value === values[field];
  },
  maxLength: function maxLength(_values, value, length) {
    return !_isExisty(value) || value.length <= length;
  },
  minLength: function minLength(_values, value, length) {
    return !_isExisty(value) || isEmpty(value) || value.length >= length;
  }
};

/* eslint-disable react/default-props-match-prop-types */
var convertValidationsToObject = function convertValidationsToObject(validations) {
  if (typeof validations === 'string') {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce(function (validationsAccumulator, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();

      if (typeof validateMethod !== 'string') {
        throw new Error('Formsy encountered unexpected problem parsing validation string');
      }

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


      var validationsAccumulatorCopy = _objectSpread2({}, validationsAccumulator);

      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

var propTypes$1 = {
  innerRef: propTypes.func,
  name: propTypes.string.isRequired,
  required: propTypes.oneOfType([propTypes.bool, propTypes.object, propTypes.string]),
  validations: propTypes.oneOfType([propTypes.object, propTypes.string]),
  value: propTypes.any // eslint-disable-line react/forbid-prop-types

};

function getDisplayName(component) {
  return component.displayName || component.name || (typeof component === 'string' ? component : 'Component');
}

function Wrapper (WrappedComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.validations = void 0;
      _this.requiredValidations = void 0;

      _this.getErrorMessage = function () {
        var messages = _this.getErrorMessages();

        return messages.length ? messages[0] : null;
      };

      _this.getErrorMessages = function () {
        var _this$state = _this.state,
            externalError = _this$state.externalError,
            validationError = _this$state.validationError;

        if (!_this.isValid() || _this.showRequired()) {
          return externalError || validationError || [];
        }

        return [];
      };

      _this.getValue = function () {
        return _this.state.value;
      };

      _this.setValidations = function (validations, required) {
        // Add validations to the store itself as the props object can not be modified
        _this.validations = convertValidationsToObject(validations) || {};
        _this.requiredValidations = required === true ? {
          isDefaultRequiredValue: required
        } : convertValidationsToObject(required);
      };

      _this.setValue = function (value) {
        var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var formsy = _this.context.formsy;

        if (!validate) {
          _this.setState({
            value: value
          });
        } else {
          _this.setState({
            value: value,
            isPristine: false
          }, function () {
            formsy.validate(_assertThisInitialized(_this));
          });
        }
      };

      _this.hasValue = function () {
        var value = _this.state.value;

        if (typeof value === 'string') {
          return value !== '';
        }

        return value !== undefined;
      };

      _this.isFormDisabled = function () {
        return _this.context.formsy.isFormDisabled;
      };

      _this.isFormSubmitted = function () {
        return _this.state.formSubmitted;
      };

      _this.isPristine = function () {
        return _this.state.isPristine;
      };

      _this.isRequired = function () {
        return !!_this.props.required;
      };

      _this.isValid = function () {
        return _this.state.isValid;
      };

      _this.isValidValue = function (value) {
        return _this.context.formsy.isValidValue.call(null, _assertThisInitialized(_this), value);
      };

      _this.resetValue = function () {
        var pristineValue = _this.state.pristineValue;
        var formsy = _this.context.formsy;

        _this.setState({
          value: pristineValue,
          isPristine: true
        }, function () {
          formsy.validate(_assertThisInitialized(_this));
        });
      };

      _this.showError = function () {
        return !_this.showRequired() && !_this.isValid();
      };

      _this.showRequired = function () {
        return _this.state.isRequired;
      };

      _this.state = {
        externalError: null,
        formSubmitted: false,
        isPristine: true,
        isRequired: false,
        isValid: true,
        pristineValue: props.value,
        validationError: [],
        value: props.value
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this$props = this.props,
            validations = _this$props.validations,
            required = _this$props.required,
            name = _this$props.name;
        var formsy = this.context.formsy;

        if (!name) {
          throw new Error('Form Input requires a name property when used');
        }

        this.setValidations(validations, required); // Pass a function instead?

        formsy.attachToForm(this);
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var props = this.props,
            state = this.state,
            formsyContext = this.context.formsy;
        var isPropsChanged = Object.keys(props).some(function (k) {
          return props[k] !== nextProps[k];
        });
        var isStateChanged = Object.keys(state).some(function (k) {
          return state[k] !== nextState[k];
        });
        var isFormsyContextChanged = Object.keys(formsyContext).some(function (k) {
          return formsyContext[k] !== nextContext.formsy[k];
        });
        return isPropsChanged || isStateChanged || isFormsyContextChanged;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _this$props2 = this.props,
            value = _this$props2.value,
            validations = _this$props2.validations,
            required = _this$props2.required;
        var formsy = this.context.formsy; // If the value passed has changed, set it. If value is not passed it will
        // internally update, and this will never run

        if (!isSame(value, prevProps.value)) {
          this.setValue(value);
        } // If validations or required is changed, run a new validation


        if (!isSame(validations, prevProps.validations) || !isSame(required, prevProps.required)) {
          this.setValidations(validations, required);
          formsy.validate(this);
        }
      } // Detach it when component unmounts
      // eslint-disable-next-line react/sort-comp

    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var formsy = this.context.formsy;
        formsy.detachFromForm(this);
      }
    }, {
      key: "render",
      value: function render() {
        var innerRef = this.props.innerRef;

        var propsForElement = _objectSpread2({}, this.props, {
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
      }
    }]);

    return _class;
  }(React.Component), _class.displayName = "Formsy(".concat(getDisplayName(WrappedComponent), ")"), _class.propTypes = propTypes$1, _class.contextTypes = {
    formsy: propTypes.object // What about required?

  }, _class.defaultProps = {
    innerRef: null,
    required: false,
    validationError: '',
    validationErrors: {},
    validations: null,
    value: WrappedComponent.defaultValue
  }, _temp;
}

var Formsy =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Formsy, _React$Component);

  function Formsy(props) {
    var _this;

    _classCallCheck(this, Formsy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Formsy).call(this, props));
    _this.inputs = void 0;
    _this.emptyArray = void 0;
    _this.prevInputNames = null;

    _this.getChildContext = function () {
      return {
        formsy: {
          attachToForm: _this.attachToForm,
          detachFromForm: _this.detachFromForm,
          isFormDisabled: _this.isFormDisabled(),
          isValidValue: _this.isValidValue,
          validate: _this.validate
        }
      };
    };

    _this.componentDidMount = function () {
      _this.prevInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });

      _this.validateForm();
    };

    _this.componentDidUpdate = function () {
      var validationErrors = _this.props.validationErrors;

      if (validationErrors && _typeof(validationErrors) === 'object' && Object.keys(validationErrors).length > 0) {
        _this.setInputValidationErrors(validationErrors);
      }

      var newInputNames = _this.inputs.map(function (component) {
        return component.props.name;
      });

      if (_this.prevInputNames && arraysDiffer(_this.prevInputNames, newInputNames)) {
        _this.prevInputNames = newInputNames;

        _this.validateForm();
      }
    };

    _this.getCurrentValues = function () {
      return _this.inputs.reduce(function (valueAccumulator, component) {
        var name = component.props.name,
            value = component.state.value; // eslint-disable-next-line no-param-reassign

        valueAccumulator[name] = cloneIfObject(value);
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

        valueAccumulator[name] = cloneIfObject(value);
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
        var args = [{
          isValid: !(name in errors),
          validationError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });

      if (!preventExternalInvalidation && isValid) {
        _this.setFormValidState(false);
      }
    };

    _this.setFormValidState = function (allIsValid) {
      var _this$props = _this.props,
          onValid = _this$props.onValid,
          onInvalid = _this$props.onInvalid;

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
    };

    _this.isFormDisabled = function () {
      return _this.props.disabled;
    };

    _this.mapModel = function (model) {
      var mapping = _this.props.mapping;

      if (mapping) {
        return mapping(model);
      }

      return formDataToObject.toObj(Object.keys(model).reduce(function (mappedModel, key) {
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
      var onReset = _this.props.onReset;
      event.preventDefault();

      _this.reset();

      if (onReset) {
        onReset();
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

    _this.setValue = function (name, value, validate) {
      var input = find(_this.inputs, function (component) {
        return component.props.name === name;
      });

      if (input) {
        input.setValue(value, validate);
      }
    };

    _this.runValidation = function (component) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.state.value;
      var validationErrors = _this.props.validationErrors;

      var currentValues = _this.getCurrentValues();

      var validationResults = runRules(value, currentValues, component.validations, validations);
      var requiredResults = runRules(value, currentValues, component.requiredValidations, validations);
      var isRequired = Object.keys(component.requiredValidations).length ? !!requiredResults.success.length : false;
      var isValid = !validationResults.failed.length && !(validationErrors && validationErrors[component.props.name]);
      return {
        isRequired: isRequired,
        isValid: isRequired ? false : isValid,
        error: function () {
          if (isValid && !isRequired) {
            return _this.emptyArray;
          }

          if (validationResults.errors.length) {
            return validationResults.errors;
          }

          if (validationErrors && validationErrors[component.props.name]) {
            return typeof validationErrors[component.props.name] === 'string' ? [validationErrors[component.props.name]] : validationErrors[component.props.name];
          }

          if (isRequired) {
            var error = component.props.validationErrors[requiredResults.success[0]] || component.props.validationError;
            return error ? [error] : null;
          }

          if (validationResults.failed.length) {
            return validationResults.failed.map(function (failed) {
              return component.props.validationErrors[failed] ? component.props.validationErrors[failed] : component.props.validationError;
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
      return !isSame(_this.getPristineValues(), _this.getCurrentValues());
    };

    _this.submit = function (event) {
      var _this$props2 = _this.props,
          onSubmit = _this$props2.onSubmit,
          onValidSubmit = _this$props2.onValidSubmit,
          onInvalidSubmit = _this$props2.onInvalidSubmit;
      var isValid = _this.state.isValid;

      if (event && event.preventDefault) {
        event.preventDefault();
      } // Trigger form as not pristine.
      // If any inputs have not been touched yet this will make them dirty
      // so validation becomes visible (if based on isPristine)


      _this.setFormPristine(false);

      var model = _this.getModel();

      onSubmit(model, _this.resetModel, _this.updateInputsWithError);

      if (isValid) {
        onValidSubmit(model, _this.resetModel, _this.updateInputsWithError);
      } else {
        onInvalidSubmit(model, _this.resetModel, _this.updateInputsWithError);
      }
    };

    _this.updateInputsWithError = function (errors, invalidate) {
      var preventExternalInvalidation = _this.props.preventExternalInvalidation;
      var isValid = _this.state.isValid;
      Object.keys(errors).forEach(function (name) {
        var component = find(_this.inputs, function (input) {
          return input.props.name === name;
        });

        if (!component) {
          throw new Error("You are trying to update an input that does not exist. Verify errors object with input names. ".concat(JSON.stringify(errors)));
        }

        var args = [{
          isValid: preventExternalInvalidation,
          externalError: typeof errors[name] === 'string' ? [errors[name]] : errors[name]
        }];
        component.setState.apply(component, args);
      });

      if (invalidate && isValid) {
        _this.setFormValidState(false);
      }
    };

    _this.validate = function (component) {
      var onChange = _this.props.onChange;
      var canChange = _this.state.canChange; // Trigger onChange

      if (canChange) {
        onChange(_this.getModel(), _this.isChanged());
      }

      var validation = _this.runValidation(component); // Run through the validations, split them up and call
      // the validator IF there is a value or it is required


      component.setState({
        externalError: null,
        isRequired: validation.isRequired,
        isValid: validation.isValid,
        validationError: validation.error
      }, _this.validateForm);
    };

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
      }); // If there are no inputs, set state where form is ready to trigger
      // change event. New inputs might be added later


      if (!_this.inputs.length) {
        _this.setState({
          canChange: true
        });
      }
    };

    _this.render = function () {
      var _this$props3 = _this.props,
          getErrorMessage = _this$props3.getErrorMessage,
          getErrorMessages = _this$props3.getErrorMessages,
          getValue = _this$props3.getValue,
          hasValue = _this$props3.hasValue,
          isFormDisabled = _this$props3.isFormDisabled,
          isFormSubmitted = _this$props3.isFormSubmitted,
          isPristine = _this$props3.isPristine,
          isRequired = _this$props3.isRequired,
          isValid = _this$props3.isValid,
          isValidValue = _this$props3.isValidValue,
          mapping = _this$props3.mapping,
          onChange = _this$props3.onChange,
          onInvalid = _this$props3.onInvalid,
          onInvalidSubmit = _this$props3.onInvalidSubmit,
          onReset = _this$props3.onReset,
          onSubmit = _this$props3.onSubmit,
          onValid = _this$props3.onValid,
          onValidSubmit = _this$props3.onValidSubmit,
          preventExternalInvalidation = _this$props3.preventExternalInvalidation,
          resetValue = _this$props3.resetValue,
          setValidations = _this$props3.setValidations,
          setValue = _this$props3.setValue,
          showError = _this$props3.showError,
          showRequired = _this$props3.showRequired,
          validationErrors = _this$props3.validationErrors,
          nonFormsyProps = _objectWithoutProperties(_this$props3, ["getErrorMessage", "getErrorMessages", "getValue", "hasValue", "isFormDisabled", "isFormSubmitted", "isPristine", "isRequired", "isValid", "isValidValue", "mapping", "onChange", "onInvalid", "onInvalidSubmit", "onReset", "onSubmit", "onValid", "onValidSubmit", "preventExternalInvalidation", "resetValue", "setValidations", "setValue", "showError", "showRequired", "validationErrors"]);

      return React.createElement('form', _objectSpread2({
        onReset: _this.resetInternal,
        onSubmit: _this.submit
      }, nonFormsyProps, {
        disabled: false
      }), // eslint-disable-next-line react/destructuring-assignment
      _this.props.children);
    };

    _this.state = {
      canChange: false,
      isSubmitting: false,
      isValid: true
    };
    _this.inputs = [];
    _this.emptyArray = [];
    return _this;
  }

  return Formsy;
}(React.Component);

Formsy.displayName = 'Formsy';
Formsy.propTypes = {
  disabled: propTypes.bool,
  getErrorMessage: propTypes.func,
  getErrorMessages: propTypes.func,
  getValue: propTypes.func,
  hasValue: propTypes.func,
  isFormDisabled: propTypes.func,
  isFormSubmitted: propTypes.func,
  isPristine: propTypes.func,
  isRequired: propTypes.func,
  isValid: propTypes.func,
  isValidValue: propTypes.func,
  mapping: propTypes.func,
  onChange: propTypes.func,
  onInvalid: propTypes.func,
  onInvalidSubmit: propTypes.func,
  onReset: propTypes.func,
  onSubmit: propTypes.func,
  onValid: propTypes.func,
  onValidSubmit: propTypes.func,
  preventExternalInvalidation: propTypes.bool,
  resetValue: propTypes.func,
  setValidations: propTypes.func,
  setValue: propTypes.func,
  showError: propTypes.func,
  showRequired: propTypes.func,
  validationErrors: propTypes.object // eslint-disable-line

};
Formsy.childContextTypes = {
  formsy: propTypes.object
};
Formsy.defaultProps = {
  disabled: false,
  getErrorMessage: noop,
  getErrorMessages: noop,
  getValue: noop,
  hasValue: noop,
  isFormDisabled: noop,
  isFormSubmitted: noop,
  isPristine: noop,
  isRequired: noop,
  isValid: noop,
  isValidValue: noop,
  mapping: null,
  onChange: noop,
  onError: noop,
  onInvalid: noop,
  onInvalidSubmit: noop,
  onReset: noop,
  onSubmit: noop,
  onValid: noop,
  onValidSubmit: noop,
  preventExternalInvalidation: false,
  resetValue: noop,
  setValidations: noop,
  setValue: noop,
  showError: noop,
  showRequired: noop,
  validationErrors: null
};

var addValidationRule = function addValidationRule(name, func) {
  validations[name] = func;
};

exports.addValidationRule = addValidationRule;
exports.default = Formsy;
exports.propTypes = propTypes$1;
exports.validationRules = validations;
exports.withFormsy = Wrapper;
//# sourceMappingURL=formsy-react.cjs.js.map
