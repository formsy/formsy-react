import { isPlainObject } from 'lodash';

import { ValidationError, Validations, Values } from './interfaces';

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is object {
  return isPlainObject(value);
}

export function isTypeUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isFunction(value: unknown): value is Function {
  return value !== null && typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isRegex(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isValueStringEmpty(value: string): boolean {
  return value === '';
}

export function isValueNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

export function isValueUndefined(value: unknown): boolean {
  return value === undefined;
}

export function noop() {
  // do nothing.
}

export function protectAgainstParamReassignment(value: unknown) {
  // Clone objects to avoid accidental param reassignment
  if (isObject(value)) return { ...value };
  if (isArray(value)) return [...value];
  return value;
}

export function isSame(a: unknown, b: unknown) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isSame(item, b[index]));
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

    return Object.keys(a).every((key) => isSame(a[key], b[key]));
  }

  if (isRegex(a) && isRegex(b)) {
    return a.toString() === b.toString();
  }

  return a === b;
}

interface RulesResult {
  errors: ValidationError[];
  failed: string[];
  success: string[];
}

export function runRules<V>(
  value: V,
  currentValues: Values,
  validations: Validations<V>,
  validationRules: Validations<V>,
) {
  const results: RulesResult = {
    errors: [],
    failed: [],
    success: [],
  };

  Object.keys(validations).forEach((validationName) => {
    const validationsVal = validations[validationName];
    const validationRulesVal = validationRules[validationName];
    const addToResults = (validation) => {
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
      throw new Error(`Formsy does not allow you to override default validations: ${validationName}`);
    }

    if (!validationRulesVal && !isFunction(validationsVal)) {
      throw new Error(`Formsy does not have the validation rule: ${validationName}`);
    }

    if (isFunction(validationsVal)) {
      return addToResults(validationsVal(currentValues, value));
    }

    return addToResults(validationRulesVal(currentValues, value, validationsVal));
  });

  return results;
}

export function debounce(callback, timeout: number) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, timeout);
  };
}
