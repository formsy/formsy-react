import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isNumeric', () => {
  it('should pass with a default value', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" />)).toEqual(true);
  });

  it('should pass with an empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value="" />)).toEqual(true);
  });

  it('should fail with an unempty string', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value="foo" />)).toEqual(false);
  });

  it('should pass with a number as string', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value="+42" />)).toEqual(true);
  });

  it('should fail with a number as string with not digits', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value="42 is an answer" />)).toEqual(false);
  });

  it('should pass with an int', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value={42} />)).toEqual(true);
  });

  it('should pass with a float', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value={Math.PI} />)).toEqual(true);
  });

  it('should fail with a float in science notation', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value="-1e3" />)).toEqual(false);
  });

  it('should pass with an undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value={null} />)).toEqual(true);
  });

  it('should pass with a zero', async() => {
    expect(await getValidState(<ValidationForm validations="isNumeric" value={0} />)).toEqual(true);
  });
});
