import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isWords', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isWords" />).toEqual(true);
  });

  it('should pass with a 1 word', () => {
    expectIsValid(<ValidationForm validations="isWords" value="sup" />).toEqual(true);
  });

  it('should pass with 2 words', () => {
    expectIsValid(<ValidationForm validations="isWords" value="sup dude" />).toEqual(true);
  });

  it('should fail with special charachters', () => {
    expectIsValid(<ValidationForm validations="isWords" value="including special letters à ú ø æ å" />).toEqual(false);
  });

  it('should fail with a string with numbers', () => {
    expectIsValid(<ValidationForm validations="isWords" value="sup 42" />).toEqual(false);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isWords" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isWords" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isWords" value={42} />).toEqual(false);
  });
});
