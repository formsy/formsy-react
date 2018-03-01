const isExisty = value => value !== null && value !== undefined;
const isEmpty = value => value === '';

const validations = {
  isDefaultRequiredValue(values, value) {
    return value === undefined || value === null || value === '';
  },
  isExisty(values, value) {
    return isExisty(value);
  },
  matchRegexp(values, value, regexp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined(values, value) {
    return value === undefined;
  },
  isEmptyString(values, value) {
    return isEmpty(value);
  },
  isEmail(values, value) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(values, value, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
  },
  isUrl(values, value) {
    return validations.matchRegexp(values, value, /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i);
  },
  isTrue(values, value) {
    return value === true;
  },
  isFalse(values, value) {
    return value === false;
  },
  isNumeric(values, value) {
    if (typeof value === 'number') {
      return true;
    }
    return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z]+$/i);
  },
  isAlphanumeric(values, value) {
    return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
  },
  isInt(values, value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat(values, value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/);
  },
  isWords(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
  },
  isSpecialWords(values, value) {
    return validations.matchRegexp(values, value, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength(values, value, length) {
    return !isExisty(value) || isEmpty(value) || value.length === length;
  },
  equals(values, value, eql) {
    return !isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField(values, value, field) {
    return value === values[field];
  },
  maxLength(values, value, length) {
    return !isExisty(value) || value.length <= length;
  },
  minLength(values, value, length) {
    return !isExisty(value) || isEmpty(value) || value.length >= length;
  },
};

export default validations;
