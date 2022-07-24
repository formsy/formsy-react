import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isInt', () => {
  it('should pass with a default value', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" />)).toEqual(true);
  });

  it('should pass with an empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value="" />)).toEqual(true);
  });

  it('should fail with a string', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value="abc" />)).toEqual(false);
  });

  it('should pass with a number as string', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value="+42" />)).toEqual(true);
  });

  it('should fail string with digits', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value="42 is an answer" />)).toEqual(false);
  });

  it('should pass with an int', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value={42} />)).toEqual(true);
  });

  it('should fail with a float', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value={Math.PI} />)).toEqual(false);
  });

  it('should fail with a float in science notation', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value="-1e3" />)).toEqual(false);
  });

  it('should pass with undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value={undefined} />)).toEqual(true);
  });

  it('should pass with null', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value={null} />)).toEqual(true);
  });

  it('should pass with a zero', async() => {
    expect(await getValidState(<ValidationForm validations="isInt" value={0} />)).toEqual(true);
  });
});
