'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var _default = {
  arraysDiffer: function arraysDiffer(a, b) {
    var _this = this;

    var isDifferent = false;

    if (a.length !== b.length) {
      isDifferent = true;
    } else {
      a.forEach(function(item, index) {
        if (!_this.isSame(item, b[index])) {
          isDifferent = true;
        }
      }, this);
    }

    return isDifferent;
  },
  objectsDiffer: function objectsDiffer(a, b) {
    var _this2 = this;

    var isDifferent = false;

    if (Object.keys(a).length !== Object.keys(b).length) {
      isDifferent = true;
    } else {
      Object.keys(a).forEach(function(key) {
        if (!_this2.isSame(a[key], b[key])) {
          isDifferent = true;
        }
      }, this);
    }

    return isDifferent;
  },
  isSame: function isSame(a, b) {
    if (_typeof(a) !== _typeof(b)) {
      return false;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return !this.arraysDiffer(a, b);
    } else if (typeof a === 'function') {
      return a.toString() === b.toString();
    } else if (a !== null && b !== null && a instanceof Date && b instanceof Date) {
      return a.toString() === b.toString();
    } else if (_typeof(a) === 'object' && a !== null && b !== null) {
      return !this.objectsDiffer(a, b);
    }

    return a === b;
  },
  find: function find(collection, fn) {
    for (var i = 0, l = collection.length; i < l; i += 1) {
      var item = collection[i];

      if (fn(item)) {
        return item;
      }
    }

    return null;
  },
  runRules: function runRules(value, currentValues, validations, validationRules) {
    var results = {
      errors: [],
      failed: [],
      success: [],
    };

    if (Object.keys(validations).length) {
      Object.keys(validations).forEach(function(validationMethod) {
        if (validationRules[validationMethod] && typeof validations[validationMethod] === 'function') {
          throw new Error('Formsy does not allow you to override default validations: '.concat(validationMethod));
        }

        if (!validationRules[validationMethod] && typeof validations[validationMethod] !== 'function') {
          throw new Error('Formsy does not have the validation rule: '.concat(validationMethod));
        }

        if (typeof validations[validationMethod] === 'function') {
          var validation = validations[validationMethod](currentValues, value);

          if (typeof validation === 'string') {
            results.errors.push(validation);
            results.failed.push(validationMethod);
          } else if (!validation) {
            results.failed.push(validationMethod);
          }

          return;
        } else if (typeof validations[validationMethod] !== 'function') {
          var _validation = validationRules[validationMethod](currentValues, value, validations[validationMethod]);

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
  },
};
exports['default'] = _default;
