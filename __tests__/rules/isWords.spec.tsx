import React from 'react';

import ValidationForm, { getValidState } from '../../__test_utils__/getValidState';

describe('isWords', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" />)).toEqual(true);
  });

  it('should pass with a 1 word', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value="sup" />)).toEqual(true);
  });

  it('should pass with 2 words', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value="sup dude" />)).toEqual(true);
  });

  it('should fail with special charachters', async () => {
    expect(
      await getValidState(<ValidationForm validations="isWords" value="including special letters à ú ø æ å" />),
    ).toEqual(false);
  });

  it('should fail with a string with numbers', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value="sup 42" />)).toEqual(false);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value={null} />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isWords" value={42} />)).toEqual(false);
  });
});
