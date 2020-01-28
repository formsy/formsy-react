import { Validations, Values } from './interfaces';

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export function isTypeUndefined(value: unknown): value is object {
  return value !== null && typeof value === 'undefined';
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

export function noop() {
  // do nothing.
}

export function cloneIfObject(value: unknown) {
  // Clone objects to avoid accidental param reassignment
  return isObject(value) ? { ...value } : value;
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

    return Object.keys(a).every(key => isSame(a[key], b[key]));
  }

  return a === b;
}

export function runRules<V>(
  value: V,
  currentValues: Values,
  validations: Validations<V>,
  validationRules: Validations<V>,
) {
  const results: {
    errors: string[];
    failed: string[];
    success: string[];
  } = {
    errors: [],
    failed: [],
    success: [],
  };

  if (Object.keys(validations).length) {
    Object.keys(validations).forEach(validationMethod => {
      const validationsVal = validations[validationMethod];
      const validationRulesVal = validationRules[validationMethod];

      if (validationRulesVal && isFunction(validationsVal)) {
        throw new Error(`Formsy does not allow you to override default validations: ${validationMethod}`);
      }

      if (!validationRulesVal && !isFunction(validationsVal)) {
        throw new Error(`Formsy does not have the validation rule: ${validationMethod}`);
      }

      if (isFunction(validationsVal)) {
        const validation = validationsVal(currentValues, value);

        if (isString(validation)) {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
          results.failed.push(validationMethod);
        }

        return;
      }

      if (!isFunction(validationsVal) && isFunction(validationRulesVal)) {
        const validation = validationRulesVal(currentValues, value, validationsVal);

        if (isString(validation)) {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
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
