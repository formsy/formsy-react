import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isUrl', () => {
  it('should pass with default value', () => {
    expectIsValid(<ValidationForm validations="isUrl" />).toEqual(true);
  });

  it('should fail with "foo"', () => {
    expectIsValid(<ValidationForm validations="isUrl" value="foo" />).toEqual(false);
  });

  it('should pass with "https://www.google.com/"', () => {
    expectIsValid(<ValidationForm validations="isUrl" value="https://www.google.com/" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isUrl" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isUrl" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isUrl" value={42} />).toEqual(false);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isUrl" value="" />).toEqual(true);
  });
});
