import React from 'react';

import ValidationForm, { getValidState } from '../../__test_utils__/getValidState';

describe('isTrue', () => {
  it('should fail with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" />)).toEqual(false);
  });

  it('should fail with boolean false', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={false} />)).toEqual(false);
  });

  it('should pass with boolean true', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={true} />)).toEqual(true);
  });

  it('should fail with a string', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value="abc" />)).toEqual(false);
  });

  it('should fail with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value="" />)).toEqual(false);
  });

  it('should fail with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={undefined} />)).toEqual(false);
  });

  it('should fail with null', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={null} />)).toEqual(false);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={42} />)).toEqual(false);
  });

  it('should fail with a zero', async () => {
    expect(await getValidState(<ValidationForm validations="isTrue" value={0} />)).toEqual(false);
  });
});
