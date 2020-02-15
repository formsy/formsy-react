import * as utils from '../src/utils';

const VALUES = [
  undefined,
  null,
  '',
  0,
  100,
  'Hello',
  'Goodbye',
  { foo: 'bar' },
  { foo: 'lounge' },
  [{ foo: ['bar'] }],
  [{ foo: [] }],
  ['a', 7],
  ['a', 8],
  ['a', 7, 7],
  new Date(1000),
  new Date(2000),
  () => 2 + 2,
  () => 2 + 3,
  utils.noop,
];

function getReadable(value, index) {
  return `${typeof value} at ${index}`;
}

describe('Utils', () => {
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

    // TODO: This fails but should pass
    // expect(utils.runRules('', {}, { rule: () => true }, {})).toEqual({ errors: [], failed: [], success: ['rule'] });

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
    expect(utils.runRules('', {}, { rule: true }, { rule: (_cv, _v, validationsVal) => 'Error' })).toEqual({
      errors: ['Error'],
      failed: ['rule'],
      success: [],
    });

    // TODO: What does this even mean?
    expect(utils.runRules('', {}, { rule: true }, { rule: true })).toEqual({
      errors: [],
      failed: [],
      success: ['rule'],
    });
  });
});
