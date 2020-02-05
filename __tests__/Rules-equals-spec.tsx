import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('equals', () => {
  it('should pass when the value is equal', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value="foo" />).toEqual(true);
  });

  it('should fail when the value is not equal', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value="fo" />).toEqual(false);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value="" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="equals:foo" value={42} />).toEqual(false);
  });
});
