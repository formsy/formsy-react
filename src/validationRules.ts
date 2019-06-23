import { IValidationFunction, IValue, IValues } from './interfaces';

const isExisty = (value: IValue) => value !== null && value !== undefined;
const isEmpty = (value: IValue) => value === '';

const validations: { [key: string]: IValidationFunction } = {
  isDefaultRequiredValue(_values: IValues, value: IValue) {
    return value === undefined || value === null || value === '';
  },
  isExisty(_values: IValues, value: IValue) {
    return isExisty(value);
  },
  matchRegexp(_values: IValues, value: IValue, regexp: RegExp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined(_values: IValues, value: IValue) {
    return value === undefined;
  },
  isEmptyString(_values: IValues, value: IValue) {
    return isEmpty(value);
  },
  isEmail(values: IValues, value: IValue) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(
      values,
      value,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    );
  },
  isUrl(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i);
  },
  isTrue(_values: IValues, value: IValue) {
    return value === true;
  },
  isFalse(_values: IValues, value: IValue) {
    return value === false;
  },
  isNumeric(values: IValues, value: IValue) {
    if (typeof value === 'number') {
      return true;
    }
    return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^[A-Z]+$/i);
  },
  isAlphanumeric(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
  },
  isInt(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/);
  },
  isWords(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
  },
  isSpecialWords(values: IValues, value: IValue) {
    return validations.matchRegexp(values, value, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength(_values: IValues, value: IValue, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length === length;
  },
  equals(_values: IValues, value: IValue, eql: IValue) {
    return !isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField(values: IValues, value: IValue, field: string) {
    return value === values[field];
  },
  maxLength(_values: IValues, value: IValue, length: number) {
    return !isExisty(value) || value.length <= length;
  },
  minLength(_values: IValues, value: IValue, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length >= length;
  },
};

export default validations;
