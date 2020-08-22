import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isFalse', () => {
  it('should fail with a default value', () => {
    expectIsValid(<ValidationForm validations="isFalse" />).toEqual(false);
  });

  it('should fail with boolean false', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={false} />).toEqual(true);
  });

  it('should pass with boolean true', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={true} />).toEqual(false);
  });

  it('should fail with a string', () => {
    expectIsValid(<ValidationForm validations="isFalse" value="abc" />).toEqual(false);
  });

  it('should fail with an empty string', () => {
    expectIsValid(<ValidationForm validations="isFalse" value="" />).toEqual(false);
  });

  it('should fail with undefined', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={undefined} />).toEqual(false);
  });

  it('should fail with null', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={null} />).toEqual(false);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={42} />).toEqual(false);
  });

  it('should fail with a zero', () => {
    expectIsValid(<ValidationForm validations="isFalse" value={0} />).toEqual(false);
  });
});
