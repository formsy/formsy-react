import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isFloat', () => {
  it('should pass with a default value', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" />)).toEqual(true);
  });

  it('should pass with an empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value="" />)).toEqual(true);
  });

  it('should fail with a string', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value="abc" />)).toEqual(false);
  });

  it('should pass with a number as string', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value="+42" />)).toEqual(true);
  });

  it('should fail string with digits', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value="42 is an answer" />)).toEqual(false);
  });

  it('should pass with an int', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value={42} />)).toEqual(true);
  });

  it('should pass with a float', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value={Math.PI} />)).toEqual(true);
  });

  it('should pass with a float in science notation', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value="-1e3" />)).toEqual(true);
  });

  it('should pass with undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value={undefined} />)).toEqual(true);
  });

  it('should pass with null', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value={null} />)).toEqual(true);
  });

  it('should pass with a zero', async() => {
    expect(await getValidState(<ValidationForm validations="isFloat" value={0} />)).toEqual(true);
  });
});
