import React from 'react';

import ValidationForm, { getValidState } from '../../__test_utils__/getValidState';

describe('equals', () => {
  it('should pass when the value is equal', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value="foo" />)).toEqual(true);
  });

  it('should fail when the value is not equal', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value="fo" />)).toEqual(false);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value="" />)).toEqual(true);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value={null} />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="equals:foo" value={42} />)).toEqual(false);
  });
});
