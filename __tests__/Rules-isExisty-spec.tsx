import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isExisty', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isExisty" />).toEqual(false);
  });

  it('should pass with a string', () => {
    expectIsValid(<ValidationForm validations="isExisty" value="abc" />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isExisty" value="" />).toEqual(true);
  });

  it('should fail with undefined', () => {
    expectIsValid(<ValidationForm validations="isExisty" value={undefined} />).toEqual(false);
  });

  it('should fail with null', () => {
    expectIsValid(<ValidationForm validations="isExisty" value={null} />).toEqual(false);
  });

  it('should pass with a number', () => {
    expectIsValid(<ValidationForm validations="isExisty" value={42} />).toEqual(true);
  });

  it('should pass with a zero', () => {
    expectIsValid(<ValidationForm validations="isExisty" value={0} />).toEqual(true);
  });
});
