import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('maxLength', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="maxLength:3" />).toEqual(true);
  });

  it("should pass when a string's length is smaller", () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value="hi" />).toEqual(true);
  });

  it("should pass when a string's length is equal", () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value="bar" />).toEqual(true);
  });

  it("should fail when a string's length is bigger", () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value="foobar" />).toEqual(false);
  });

  it('should pass with empty string', () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value="" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="maxLength:3" value={42} />).toEqual(false);
  });
});
