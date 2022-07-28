import React from 'react';

import ValidationForm, { getValidState } from '../__test_utils__/getValidState';

describe('isLength:3', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" />)).toEqual(true);
  });

  it('should fail with a string too small', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value="hi" />)).toEqual(false);
  });

  it('should fail with a string too long', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value="hi ho happ" />)).toEqual(false);
  });

  it('should pass with matching length', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value="foo" />)).toEqual(true);
  });

  it('should pass with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value={undefined} />)).toEqual(true);
  });

  it('should pass with null', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value={null} />)).toEqual(true);
  });

  it('should pass with empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value="" />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:3" value={123} />)).toEqual(false);
  });
});

describe('isLength:0', () => {
  it('should pass with a default value', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" />)).toEqual(true);
  });

  it('should fail with a string too small', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value="hi" />)).toEqual(false);
  });

  it('should fail with a string too long', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value="hi ho happ" />)).toEqual(false);
  });

  it('should pass with matching length', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value="" />)).toEqual(true);
  });

  it('should pass with undefined', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value={undefined} />)).toEqual(true);
  });

  it('should pass with null', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value={null} />)).toEqual(true);
  });

  it('should pass with empty string', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value="" />)).toEqual(true);
  });

  it('should fail with a number', async () => {
    expect(await getValidState(<ValidationForm validations="isLength:0" value={123} />)).toEqual(false);
  });
});
