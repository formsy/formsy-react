import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isEmail', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" />)).toEqual(true);
  });

  it('should fail with "foo"', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value="foo" />)).toEqual(false);
  });

  it('should pass with "foo@foo.com"', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value="foo@foo.com" />)).toEqual(true);
  });

  it('should pass with new long domains', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value="tickets@now.diamonds" />)).toEqual(true);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value={null} />)).toEqual(true);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value="" />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isEmail" value={42} />)).toEqual(false);
  });
});
