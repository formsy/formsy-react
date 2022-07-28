import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isExisty', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" />)).toEqual(false);
  });

  it('should pass with a string', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value="abc" />)).toEqual(true);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value="" />)).toEqual(true);
  });

  it('should fail with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value={undefined} />)).toEqual(false);
  });

  it('should fail with null', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value={null} />)).toEqual(false);
  });

  it('should pass with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value={42} />)).toEqual(true);
  });

  it('should pass with a zero', async () => {
    expect(await getValidState(<ValidationForm validations="isExisty" value={0} />)).toEqual(true);
  });
});
