import React from 'react';
import { getValidState } from '../__test_utils__/getValidState';
import TestInput from '../__test_utils__/TestInput';

import Formsy from '../src';

function ValidationForm(props: { validations: string; value?: any; other?: any }) {
  const { validations, value, other } = props;

  return (
    <Formsy>
      <TestInput name="foo" validations={validations} value={value} testId="test-input" />
      <TestInput name="other" value={other} />
    </Formsy>
  );
}

describe('equalsField', () => {
  it('should pass when the value is equal', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value="bar"
                                               other="bar" />)).toEqual(true);
  });

  it('should fail when the value is not equal', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value="bar"
                                               other="" />)).toEqual(false);
  });

  it('should pass with an empty string', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value=""
                                               other="" />)).toEqual(true);
  });

  it('should pass with an undefined', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value={undefined}
                                               other={undefined} />)).toEqual(true);
  });

  it('should pass with a null', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value={null}
                                               other={null} />)).toEqual(true);
  });

  it('should work with a number', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value={42}
                                               other={42} />)).toEqual(true);
  });

  it('should work with a number', async () => {
    expect(await getValidState(<ValidationForm validations="equalsField:other" value={42}
                                               other={10} />)).toEqual(false)
  });
});
