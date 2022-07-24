import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isAlpha', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha" />)).toEqual(true);
  });

  it('should pass with a string is only latin letters', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha"
                                               value="myValue" />)).toEqual(true);
  });

  it('should fail with a string with numbers', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha"
                                               value="myValue42" />)).toEqual(false);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha"
                                               value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha"
                                               value={null} />)).toEqual(true);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha" value="" />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isAlpha" value={42} />)).toEqual(false);
  });
});
