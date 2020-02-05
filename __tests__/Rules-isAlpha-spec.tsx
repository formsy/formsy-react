import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isAlpha', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isAlpha" />).toEqual(true);
  });

  it('should pass with a string is only latin letters', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value="myValue" />).toEqual(true);
  });

  it('should fail with a string with numbers', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value="myValue42" />).toEqual(false);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value={null} />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value="" />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isAlpha" value={42} />).toEqual(false);
  });
});
