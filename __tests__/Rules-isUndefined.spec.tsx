import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isUndefined', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" />)).toEqual(true);
  });

  it('should fail with a string', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value="abc" />)).toEqual(false);
  });

  it('should fail with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value="" />)).toEqual(false);
  });

  it('should pass with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value={undefined} />)).toEqual(true);
  });

  it('should fail with null', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value={null} />)).toEqual(false);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value={42} />)).toEqual(false);
  });

  it('should fail with a zero', async () => {
    expect(await getValidState(<ValidationForm validations="isUndefined" value={0} />)).toEqual(false);
  });
});
