import { ValidationFunction, Value, Values } from './interfaces';

const isExisty = (value: Value) => value !== null && value !== undefined;
const isEmpty = (value: Value) => value === '';
const isEmptyArray = (value: Value) => Array.isArray(value) && value.length === 0;

const validations: { [key: string]: ValidationFunction } = {
  isDefaultRequiredValue(_values: Values, value: Value) {
    return value === undefined || value === null || value === '' || isEmptyArray(value);
  },
  isExisty(_values: Values, value: Value) {
    return isExisty(value);
  },
  matchRegexp(_values: Values, value: Value, regexp: RegExp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined(_values: Values, value: Value) {
    return value === undefined;
  },
  isEmptyString(_values: Values, value: Value) {
    return isEmpty(value);
  },
  isEmail(values: Values, value: Value) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(
      values,
      value,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    );
  },
  isUrl(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i);
  },
  isTrue(_values: Values, value: Value) {
    return value === true;
  },
  isFalse(_values: Values, value: Value) {
    return value === false;
  },
  isNumeric(values: Values, value: Value) {
    if (typeof value === 'number') {
      return true;
    }
    return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^[A-Z]+$/i);
  },
  isAlphanumeric(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
  },
  isInt(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/);
  },
  isWords(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
  },
  isSpecialWords(values: Values, value: Value) {
    return validations.matchRegexp(values, value, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength(_values: Values, value: Value, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length === length;
  },
  equals(_values: Values, value: Value, eql: Value) {
    return !isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField(values: Values, value: Value, field: string) {
    return value === values[field];
  },
  maxLength(_values: Values, value: Value, length: number) {
    return !isExisty(value) || value.length <= length;
  },
  minLength(_values: Values, value: Value, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length >= length;
  },
};

export default validations;
