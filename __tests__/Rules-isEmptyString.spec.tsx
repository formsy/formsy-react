import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isEmptyString', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" />).toEqual(false);
  });

  it('should fail with non-empty string', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value="abc" />).toEqual(false);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value="" />).toEqual(true);
  });

  it('should fail with undefined', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value={undefined} />).toEqual(false);
  });

  it('should fail with null', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value={null} />).toEqual(false);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value={42} />).toEqual(false);
  });

  it('should fail with a zero', () => {
    expectIsValid(<ValidationForm validations="isEmptyString" value={0} />).toEqual(false);
  });
});
