import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isAlphanumeric', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" />).toEqual(true);
  });

  it('should pass with a string is only latin letters', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value="myValue" />).toEqual(true);
  });

  it('should fail with a string with numbers', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value="myValue42" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value={null} />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value="" />).toEqual(true);
  });

  it('should pass with a number', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value={42} />).toEqual(true);
  });

  it('should fail with a non alpha and number symbols', () => {
    expectIsValid(<ValidationForm validations="isAlphanumeric" value="!@#$%^&*()" />).toEqual(false);
  });
});
