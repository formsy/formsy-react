import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('maxLength', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" />)).toEqual(true);
  });

  it("should pass when a string's length is smaller", async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value="hi" />)).toEqual(true);
  });

  it("should pass when a string's length is equal", async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value="bar" />)).toEqual(true);
  });

  it("should fail when a string's length is bigger", async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value="foobar" />)).toEqual(false);
  });

  it('should pass with empty string', async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value="" />)).toEqual(true);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value={null} />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="maxLength:3" value={42} />)).toEqual(false);
  });
});
