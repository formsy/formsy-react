import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isUndefined', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isUndefined" />).toEqual(true);
  });

  it('should fail with a string', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value="abc" />).toEqual(false);
  });

  it('should fail with an empty string', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value="" />).toEqual(false);
  });

  it('should pass with undefined', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value={undefined} />).toEqual(true);
  });

  it('should fail with null', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value={null} />).toEqual(false);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value={42} />).toEqual(false);
  });

  it('should fail with a zero', () => {
    expectIsValid(<ValidationForm validations="isUndefined" value={0} />).toEqual(false);
  });
});
