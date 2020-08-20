import * as utils from '../src/utils';

function getReadable(value, index) {
  return `${typeof value} at ${index}`;
}

const TYPES = {
  isArray: [[], [{ foo: ['bar'] }], [{ foo: [] }], ['a', 7], ['a', 8], ['a', 7, 7]],
  isDate: [new Date(1000), new Date(2000)],
  isFunction: [() => 2 + 2, () => 2 + 3, utils.noop],
  isNumber: [0, 100, 0.4],
  isObject: [{}, { foo: 'bar' }, { foo: 'lounge' }],
  isString: ['', 'Hello', 'Goodbye'],
  isTypeUndefined: [undefined],
};

const VALUES = [
  null,
  ...TYPES.isArray,
  ...TYPES.isDate,
  ...TYPES.isFunction,
  ...TYPES.isNumber,
  ...TYPES.isObject,
  ...TYPES.isString,
  ...TYPES.isTypeUndefined,
];

describe('Utils', () => {
  // For each function in types
  Object.keys(TYPES).forEach((isFn) => {
    // Create a test for that functiojn
    it(isFn, () => {
      // For each value in values
      VALUES.forEach((value) => {
        // Make sure that if it is in that types TYPES array, it returns true
        expect(utils[isFn](value)).toBe(TYPES[isFn].includes(value));
      });
    });
  });

  // For every value in values, run isSame(a, b) with every other value in the array.
  // Expect isSame to return true only if you are at the same point in the array.
  VALUES.forEach((a, idxa) => {
    VALUES.forEach((b, idxb) => {
      const isSame = idxa === idxb;

      it(`isSame: ${getReadable(a, idxa)} ${isSame ? '==' : '!='} ${getReadable(b, idxb)}`, () => {
        expect(utils.isSame(a, b)).toBe(isSame);
      });
    });
  });

  it('runRules', () => {
    expect(utils.runRules('', {}, {}, {})).toEqual({ errors: [], failed: [], success: [] });

    expect(() => utils.runRules('', {}, { rule: utils.noop }, { rule: utils.noop })).toThrow(
      'Formsy does not allow you to override default validations: rule',
    );

    expect(() => utils.runRules('', {}, { rule: true }, {})).toThrow('Formsy does not have the validation rule: rule');

    expect(utils.runRules('', {}, { rule: () => 'Error' }, {})).toEqual({
      errors: ['Error'],
      failed: ['rule'],
      success: [],
    });

    expect(utils.runRules('', {}, { rule: () => true }, {})).toEqual({ errors: [], failed: [], success: ['rule'] });

    expect(utils.runRules('', {}, { rule: () => false }, {})).toEqual({ errors: [], failed: ['rule'], success: [] });
    expect(utils.runRules('', {}, { rule: true }, { rule: () => false })).toEqual({
      errors: [],
      failed: ['rule'],
      success: [],
    });
    expect(utils.runRules('', {}, { rule: true }, { rule: () => true })).toEqual({
      errors: [],
      failed: [],
      success: ['rule'],
    });
    expect(utils.runRules('', {}, { rule: false }, { rule: () => false })).toEqual({
      errors: [],
      failed: ['rule'],
      success: [],
    });

    expect(utils.runRules('', {}, { rule: true }, { rule: (_cv, _v, validationsVal) => validationsVal })).toEqual({
      errors: [],
      failed: [],
      success: ['rule'],
    });
    expect(utils.runRules('', {}, { rule: false }, { rule: (_cv, _v, validationsVal) => validationsVal })).toEqual({
      errors: [],
      failed: ['rule'],
      success: [],
    });
    expect(utils.runRules('', {}, { rule: true }, { rule: (_cv, _v, _validationsVal) => 'Error' })).toEqual({
      errors: ['Error'],
      failed: ['rule'],
      success: [],
    });
  });
});
