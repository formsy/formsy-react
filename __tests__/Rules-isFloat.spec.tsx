import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isFloat', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isFloat" />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isFloat" value="" />).toEqual(true);
  });

  it('should fail with a string', () => {
    expectIsValid(<ValidationForm validations="isFloat" value="abc" />).toEqual(false);
  });

  it('should pass with a number as string', () => {
    expectIsValid(<ValidationForm validations="isFloat" value="+42" />).toEqual(true);
  });

  it('should fail string with digits', () => {
    expectIsValid(<ValidationForm validations="isFloat" value="42 is an answer" />).toEqual(false);
  });

  it('should pass with an int', () => {
    expectIsValid(<ValidationForm validations="isFloat" value={42} />).toEqual(true);
  });

  it('should pass with a float', () => {
    expectIsValid(<ValidationForm validations="isFloat" value={Math.PI} />).toEqual(true);
  });

  it('should pass with a float in science notation', () => {
    expectIsValid(<ValidationForm validations="isFloat" value="-1e3" />).toEqual(true);
  });

  it('should pass with undefined', () => {
    expectIsValid(<ValidationForm validations="isFloat" value={undefined} />).toEqual(true);
  });

  it('should pass with null', () => {
    expectIsValid(<ValidationForm validations="isFloat" value={null} />).toEqual(true);
  });

  it('should pass with a zero', () => {
    expectIsValid(<ValidationForm validations="isFloat" value={0} />).toEqual(true);
  });
});
