import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isUrl', () => {
  it('should pass with default value', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" />)).toEqual(true);
  });

  it('should fail with "foo"', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value="foo" />)).toEqual(false);
  });

  it('should pass with "https://www.google.com/"', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value="https://www.google.com/" />)).toEqual(true);
  });

  it('should pass with an undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value={null} />)).toEqual(true);
  });

  it('should fail with a number', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value={42} />)).toEqual(false);
  });

  it('should pass with an empty string', async() => {
    expect(await getValidState(<ValidationForm validations="isUrl" value="" />)).toEqual(true);
  });
});
