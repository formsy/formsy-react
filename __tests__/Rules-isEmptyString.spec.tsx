import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isEmptyString', () => {
  it('should pass with a default value', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" />)).toEqual(false);
  });

  it('should fail with non-empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value="abc" />)).toEqual(false);
  });

  it('should pass with an empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value="" />)).toEqual(true);
  });

  it('should fail with undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value={undefined} />)).toEqual(false);
  });

  it('should fail with null', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value={null} />)).toEqual(false);
  });

  it('should fail with a number', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value={42} />)).toEqual(false);
  });

  it('should fail with a zero', async() => {
    expect(await getValidState(<ValidationForm validations="isEmptyString" value={0} />)).toEqual(false);
  });
});
