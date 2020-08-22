import React from 'react';

import ValidationForm, { expectIsValid } from '../__test_utils__/expectIsValid';

describe('isLength:3', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isLength:3" />).toEqual(true);
  });

  it('should fail with a string too small', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value="hi" />).toEqual(false);
  });

  it('should fail with a string too long', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value="hi ho happ" />).toEqual(false);
  });

  it('should pass with matching length', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value="foo" />).toEqual(true);
  });

  it('should pass with undefined', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value={undefined} />).toEqual(true);
  });

  it('should pass with null', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value={null} />).toEqual(true);
  });

  it('should pass with empty string', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value="" />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isLength:3" value={123} />).toEqual(false);
  });
});

describe('isLength:0', () => {
  it('should pass with a default value', () => {
    expectIsValid(<ValidationForm validations="isLength:0" />).toEqual(true);
  });

  it('should fail with a string too small', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value="hi" />).toEqual(false);
  });

  it('should fail with a string too long', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value="hi ho happ" />).toEqual(false);
  });

  it('should pass with matching length', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value="" />).toEqual(true);
  });

  it('should pass with undefined', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value={undefined} />).toEqual(true);
  });

  it('should pass with null', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value={null} />).toEqual(true);
  });

  it('should pass with empty string', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value="" />).toEqual(true);
  });

  it('should fail with a number', () => {
    expectIsValid(<ValidationForm validations="isLength:0" value={123} />).toEqual(false);
  });
});
