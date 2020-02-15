import { ValidationFunction, Values } from './interfaces';
import {
  isNumber,
  isString,
  isTypeUndefined,
  isValueNullOrUndefined,
  isValueStringEmpty,
  isValueUndefined,
} from './utils';

const isExisty = <V>(value: V) => !isValueNullOrUndefined(value);
const isEmpty = <V>(value: V) => {
  if (isString(value)) {
    return isValueStringEmpty(value);
  }
  if (isTypeUndefined(value)) {
    return false;
  }
  return isValueUndefined(value);
};

interface Validations<V> {
  [key: string]: ValidationFunction<V>;
}

const validations: Validations<any> = {
  isDefaultRequiredValue<V>(_values: Values, value: V) {
    if (isString(value)) {
      return isValueStringEmpty(value);
    }
    return isValueNullOrUndefined(value);
  },
  isExisty<V>(_values: Values, value: V) {
    return isExisty(value);
  },
  matchRegexp(_values: Values, value: string, regexp: RegExp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(value);
  },
  isUndefined<V>(_values: Values, value: V) {
    return isValueUndefined(value);
  },
  isEmptyString(_values: Values, value: string) {
    return isEmpty(value);
  },
  isEmail(values: Values, value: string) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(
      values,
      value,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    );
  },
  isUrl<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i);
  },
  isTrue(_values: Values, value: boolean | string) {
    return value === true;
  },
  isFalse(_values: Values, value: boolean | string) {
    return value === false;
  },
  isNumeric<V>(values: Values, value: V) {
    if (isNumber(value)) {
      return true;
    }
    return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^[A-Z]+$/i);
  },
  isAlphanumeric<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
  },
  isInt<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/);
  },
  isWords<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
  },
  isSpecialWords<V>(values: Values, value: V) {
    return validations.matchRegexp(values, value, /^[\sA-ZÀ-ÖØ-öø-ÿ]+$/i);
  },
  isLength(_values: Values, value: string, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length === length;
  },
  equals<V>(_values: Values, value: V, eql: V) {
    return !isExisty(value) || isEmpty(value) || value === eql;
  },
  equalsField<V>(values: Values, value: V, field: string) {
    return value === values[field];
  },
  maxLength(_values: Values, value: string, length: number) {
    return !isExisty(value) || value.length <= length;
  },
  minLength(_values: Values, value: string, length: number) {
    return !isExisty(value) || isEmpty(value) || value.length >= length;
  },
};

export default validations;
