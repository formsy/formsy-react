import { ValidationFunction, Values } from './interfaces';
import {
  isNumber,
  isString,
  isTypeUndefined,
  isValueNullOrUndefined,
  isValueStringEmpty,
  isValueUndefined,
} from './utils';

export function isExisty<V>(value: V) {
  return !isValueNullOrUndefined(value);
}

export function isEmpty<V>(value: V) {
  if (isString(value)) {
    return isValueStringEmpty(value);
  }
  if (isTypeUndefined(value)) {
    return false;
  }
  return isValueUndefined(value);
}

export function isDefaultRequiredValue(value: unknown) {
  return isString(value) ? isValueStringEmpty(value) : isValueNullOrUndefined(value);
}

export function matchRegexp<V>(_values: Values, value: V, regexp: RegExp) {
  return !isExisty(value) || isEmpty(value) || regexp.test(`${value}`);
}

interface Validations<V> {
  [key: string]: ValidationFunction<V>;
}

const REGEX_PATTERNS = {
  ALPHA: /^[A-Z]+$/i,
  ALPHANUMERIC: /^[0-9A-Z]+$/i,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i, // from http://emailregex.com/
  FLOAT: /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/,
  INT: /^(?:[-+]?(?:0|[1-9]\d*))$/,
  NUMERIC: /^[-+]?(?:\d*[.])?\d+$/,
  SPECIAL_WORDS: /^[\sA-ZÀ-ÖØ-öø-ÿ]+$/i,
  URL: /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i,
  WORDS: /^[A-Z\s]+$/i,
};

const validations: Validations<any> = {
  equals: <V>(_values, value: V, eql: V) => !isExisty(value) || isEmpty(value) || value === eql,
  equalsField: <V>(values, value: V, field: string) => value === values[field],
  isAlpha: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.ALPHA),
  isAlphanumeric: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.ALPHANUMERIC),
  isDefaultRequiredValue: <V>(_values, value: V) => isDefaultRequiredValue(value),
  isEmail: (values, value: string) => matchRegexp(values, value, REGEX_PATTERNS.EMAIL),
  isEmptyString: (_values, value: string) => isEmpty(value),
  isExisty: <V>(_values, value: V) => isExisty(value),
  isFalse: (_values, value: boolean | string) => value === false,
  isFloat: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.FLOAT),
  isInt: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.INT),
  isLength: (_values, value: string, length: number) => !isExisty(value) || isEmpty(value) || value.length === length,
  isNumeric: <V>(values, value: V) => isNumber(value) || matchRegexp(values, value, REGEX_PATTERNS.NUMERIC),
  isSpecialWords: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.SPECIAL_WORDS),
  isTrue: (_values, value: boolean | string) => value === true,
  isUndefined: <V>(_values, value: V) => isValueUndefined(value),
  isUrl: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.URL),
  isWords: <V>(values, value: V) => matchRegexp(values, value, REGEX_PATTERNS.WORDS),
  matchRegexp,
  maxLength: (_values, value: string, length: number) => !isExisty(value) || value.length <= length,
  minLength: (_values, value: string, length: number) => !isExisty(value) || isEmpty(value) || value.length >= length,
};

export const addValidationRule = <V>(name: string, func: ValidationFunction<V>) => {
  validations[name] = func;
};

export default validations;
