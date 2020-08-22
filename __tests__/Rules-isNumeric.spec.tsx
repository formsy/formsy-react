import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isNumeric', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isNumeric" />).toEqual(true);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value="" />).toEqual(true);
  });

  it('should fail with an unempty string', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value="foo" />).toEqual(false);
  });

  it('should pass with a number as string', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value="+42" />).toEqual(true);
  });

  it('should fail with a number as string with not digits', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value="42 is an answer" />).toEqual(false);
  });

  it('should pass with an int', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value={42} />).toEqual(true);
  });

  it('should pass with a float', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value={Math.PI} />).toEqual(true);
  });

  it('should fail with a float in science notation', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value="-1e3" />).toEqual(false);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value={null} />).toEqual(true);
  });

  it('should pass with a zero', () => {
    expectIsValid(<ValidationForm validations="isNumeric" value={0} />).toEqual(true);
  });
});
