import React from 'react';

import ValidationForm, { getValidState } from '../../__test_utils__/getValidState';

describe('isAlphanumeric', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" />)).toEqual(true);
  });

  it('should pass with a string is only latin letters', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value="myValue" />)).toEqual(true);
  });

  it('should fail with a string with numbers', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value="myValue42" />)).toEqual(true);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value={null} />)).toEqual(true);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value="" />)).toEqual(true);
  });

  it('should pass with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value={42} />)).toEqual(true);
  });

  it('should fail with a non alpha and number symbols', async () => {
    expect(await getValidState(<ValidationForm validations="isAlphanumeric" value="!@#$%^&*()" />)).toEqual(false);
  });
});
