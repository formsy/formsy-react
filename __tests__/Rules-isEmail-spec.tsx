import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isEmail', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isEmail" />).toEqual(true);
  });

  it('should fail with "foo"', () => {
    expectIsValid(<ValidationForm validations="isEmail" value="foo" />).toEqual(false);
  });

  it('should pass with "foo@foo.com"', () => {
    expectIsValid(<ValidationForm validations="isEmail" value="foo@foo.com" />).toEqual(true);
  });

  it('should pass with new long domains', () => {
    expectIsValid(<ValidationForm validations="isEmail" value="tickets@now.diamonds" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isEmail" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isEmail" value={null} />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isEmail" value="" />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isEmail" value={42} />).toEqual(false);
  });
});
