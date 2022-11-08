import React from 'react';

import ValidationForm, { getValidState } from '../../__test_utils__/getValidState';

describe('isFalse', () => {
  it('should fail with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" />)).toEqual(false);
  });

  it('should fail with boolean false', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={false} />)).toEqual(true);
  });

  it('should pass with boolean true', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={true} />)).toEqual(false);
  });

  it('should fail with a string', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value="abc" />)).toEqual(false);
  });

  it('should fail with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value="" />)).toEqual(false);
  });

  it('should fail with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={undefined} />)).toEqual(false);
  });

  it('should fail with null', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={null} />)).toEqual(false);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={42} />)).toEqual(false);
  });

  it('should fail with a zero', async () => {
    expect(await getValidState(<ValidationForm validations="isFalse" value={0} />)).toEqual(false);
  });
});
