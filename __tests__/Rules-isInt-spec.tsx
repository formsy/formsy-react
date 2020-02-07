import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isInt', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isInt" />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isInt" value="" />).toEqual(true);
  });

  it('should fail with a string', () => {
    expectIsValid(<ValidationForm validations="isInt" value="abc" />).toEqual(false);
  });

  it('should pass with a number as string', () => {
    expectIsValid(<ValidationForm validations="isInt" value="+42" />).toEqual(true);
  });

  it('should fail string with digits', () => {
    expectIsValid(<ValidationForm validations="isInt" value="42 is an answer" />).toEqual(false);
  });

  it('should pass with an int', () => {
    expectIsValid(<ValidationForm validations="isInt" value={42} />).toEqual(true);
  });

  it('should fail with a float', () => {
    expectIsValid(<ValidationForm validations="isInt" value={Math.PI} />).toEqual(false);
  });

  it('should fail with a float in science notation', () => {
    expectIsValid(<ValidationForm validations="isInt" value="-1e3" />).toEqual(false);
  });

  it('should pass with undefined', () => {
    expectIsValid(<ValidationForm validations="isInt" value={undefined} />).toEqual(true);
  });

  it('should pass with null', () => {
    expectIsValid(<ValidationForm validations="isInt" value={null} />).toEqual(true);
  });

  it('should pass with a zero', () => {
    expectIsValid(<ValidationForm validations="isInt" value={0} />).toEqual(true);
  });
});
