import { Validations, Value, Values } from './interfaces';

export default {
  arraysDiffer(a: unknown[], b: unknown[]) {
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
  },

  objectsDiffer(a: object, b: object) {
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
  },

  isExisty(value: unknown) {
    return value !== null && value !== undefined && value !== '';
  },

  isPlainObject(value: unknown) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value); // extra truthy check of value is required because typeof null is 'object'
  },

  isSame(a: unknown, b: unknown) {
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

    if (this.isPlainObject(a) && this.isPlainObject(b)) {
      return !this.objectsDiffer(a, b);
    }

    return Object.is(a, b);
  },

  find<T>(collection: T[], fn: (item: T) => boolean): T {
    for (let i = 0, l = collection.length; i < l; i += 1) {
      const item = collection[i];
      if (fn(item)) {
        return item;
      }
    }
    return null;
  },

  isCalledFunctionPromise<T>(functionReturnVal: unknown) {
    /**
     * https://stackoverflow.com/a/38510353/7029829.
     * Intentional to check fn return value as it is required to detect a promise fn in compiled code
     */
    return (
      functionReturnVal &&
      functionReturnVal[Symbol.toStringTag] === 'Promise' &&
      typeof (functionReturnVal as PromiseLike<T>).then === 'function'
    );
  },

  runRules(
    value: Value,
    currentValues: Values,
    validations: Validations,
    validationRules: Validations,
    setOnValidationProgress?: Function,
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
      return Promise.all(
        Object.keys(validations).map(validationMethod => {
          const validationsVal = validations[validationMethod];
          const validationRulesVal = validationRules[validationMethod];

          if (validationRulesVal && typeof validationsVal === 'function') {
            throw new Error(`Formsy does not allow you to override default validations: ${validationMethod}`);
          }

          if (!validationRulesVal && typeof validationsVal !== 'function') {
            throw new Error(`Formsy does not have the validation rule: ${validationMethod}`);
          }

          // calls to inform on any async validations
          const setAnyPendingState = (validationReturnValue: unknown) => {
            if (setOnValidationProgress) {
              const isPromise = this.isCalledFunctionPromise(validationReturnValue);
              setOnValidationProgress({
                isAsyncValidation: isPromise,
              });
            }
          };

          if (typeof validationsVal === 'function') {
            const validationReturnValue = validationsVal(currentValues, value);
            setAnyPendingState(validationReturnValue);
            return Promise.resolve(validationReturnValue).then(validation => {
              const validationType = typeof validation;
              if (validationType === 'string' || (validationType === 'object' && validation !== null)) {
                results.errors.push(validation as any); // validation message could be react element/fragment
                results.failed.push(validationMethod);
              } else if (!validation) {
                results.failed.push(validationMethod);
              }
            });
          }

          if (typeof validationsVal !== 'function' && typeof validationRulesVal === 'function') {
            const validationReturnValue = validationRulesVal(currentValues, value, validationsVal);
            setAnyPendingState(validationReturnValue);
            return Promise.resolve(validationReturnValue).then(validation => {
              if (typeof validation === 'string') {
                results.errors.push(validation);
                results.failed.push(validationMethod);
              } else if (!validation) {
                results.failed.push(validationMethod);
              } else {
                results.success.push(validationMethod);
              }
            });
          }
          results.success.push(validationMethod);
        }),
      ).then(() => results);
    }

    return Promise.resolve(results);
  },
};
