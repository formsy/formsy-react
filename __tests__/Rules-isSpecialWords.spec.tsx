import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isSpecialWords', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" />).toEqual(true);
  });

  it('should pass with a 1 word', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value="sup" />).toEqual(true);
  });

  it('should pass with 2 words', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value="sup dude" />).toEqual(true);
  });

  it('should pass with special charachters', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value="including special letters az ú ø æ å" />).toEqual(
      true,
    );
  });

  it('should fail with a string with numbers', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value="sup 42" />).toEqual(false);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value={null} />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isSpecialWords" value={42} />).toEqual(false);
  });
});
