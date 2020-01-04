import { Validations, Value, Values } from './interfaces';

export function arraysDiffer(a: unknown[], b: unknown[]) {
  let isDifferent = false;
  if (a.length !== b.length) {
    isDifferent = true;
  } else {
    a.forEach((item, index) => {
      if (!this.isSame(item, b[index])) {
        isDifferent = true;
      }
    }, this);
  }
  return isDifferent;
}

export function objectsDiffer(a: object, b: object) {
  let isDifferent = false;
  if (Object.keys(a).length !== Object.keys(b).length) {
    isDifferent = true;
  } else {
    Object.keys(a).forEach(key => {
      if (!this.isSame(a[key], b[key])) {
        isDifferent = true;
      }
    }, this);
  }
  return isDifferent;
}

export function isSame(a: unknown, b: unknown) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return !this.arraysDiffer(a, b);
  }

  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }

  if (a !== null && b !== null && a instanceof Date && b instanceof Date) {
    return a.toString() === b.toString();
  }

  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    return !this.objectsDiffer(a, b);
  }

  return a === b;
}

export function find<T>(collection: T[], fn: (item: T) => boolean): T {
  for (let i = 0, l = collection.length; i < l; i += 1) {
    const item = collection[i];
    if (fn(item)) {
      return item;
    }
  }
  return null;
}

export function runRules(value: Value, currentValues: Values, validations: Validations, validationRules: Validations) {
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

      if (validationRulesVal && typeof validationsVal === 'function') {
        throw new Error(`Formsy does not allow you to override default validations: ${validationMethod}`);
      }

      if (!validationRulesVal && typeof validationsVal !== 'function') {
        throw new Error(`Formsy does not have the validation rule: ${validationMethod}`);
      }

      if (typeof validationsVal === 'function') {
        const validation = validationsVal(currentValues, value);
        if (typeof validation === 'string') {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
          results.failed.push(validationMethod);
        }
        return;
      }
      if (typeof validationsVal !== 'function' && typeof validationRulesVal === 'function') {
        const validation = validationRulesVal(currentValues, value, validationsVal);

        if (typeof validation === 'string') {
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

export function noop() {
  // do nothing.
}
