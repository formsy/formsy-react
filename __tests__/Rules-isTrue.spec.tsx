import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isTrue', () => {
  it('should fail with a default value', () => {
    expectIsValid(<ValidationForm validations="isTrue" />).toEqual(false);
  });

  it('should fail with boolean false', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={false} />).toEqual(false);
  });

  it('should pass with boolean true', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={true} />).toEqual(true);
  });

  it('should fail with a string', () => {
    expectIsValid(<ValidationForm validations="isTrue" value="abc" />).toEqual(false);
  });

  it('should fail with an empty string', () => {
    expectIsValid(<ValidationForm validations="isTrue" value="" />).toEqual(false);
  });

  it('should fail with undefined', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={undefined} />).toEqual(false);
  });

  it('should fail with null', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={null} />).toEqual(false);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={42} />).toEqual(false);
  });

  it('should fail with a zero', () => {
    expectIsValid(<ValidationForm validations="isTrue" value={0} />).toEqual(false);
  });
});
