import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isSpecialWords', () => {
  it('should pass with a default value', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" />)).toEqual(true);
  });

  it('should pass with a 1 word', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value="sup" />)).toEqual(true);
  });

  it('should pass with 2 words', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value="sup dude" />)).toEqual(true);
  });

  it('should pass with special charachters', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value="including special letters az ú ø æ å" />)).toEqual(
      true,
    );
  });

  it('should fail with a string with numbers', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value="sup 42" />)).toEqual(false);
  });

  it('should pass with an undefined', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value={null} />)).toEqual(true);
  });

  it('should fail with a number', async() => {
    expect(await getValidState(<ValidationForm validations="isSpecialWords" value={42} />)).toEqual(false);
  });
});
