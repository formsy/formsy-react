import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('minLength:3', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="minLength:3" />).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    expectIsValid(<ValidationForm validations="minLength:3" value="myValue" />).toEqual(true);
  });

  it("should fail when a string's length is smaller", () => {
    expectIsValid(<ValidationForm validations="minLength:3" value="my" />).toEqual(false);
  });

  it('should pass with empty string', () => {
    expectIsValid(<ValidationForm validations="minLength:3" value="" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="minLength:3" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="minLength:3" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="minLength:3" value={42} />).toEqual(false);
  });
});

describe('minLength:0', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="minLength:0" />).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    expectIsValid(<ValidationForm validations="minLength:0" value="myValue" />).toEqual(true);
  });

  it('should pass with empty string', () => {
    expectIsValid(<ValidationForm validations="minLength:0" value="" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="minLength:0" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="minLength:0" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="minLength:0" value={42} />).toEqual(false);
  });
});
