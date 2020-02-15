import React from 'react';

import Formsy from '../src';
import TestInput from '../__test_utils__/TestInput';
import { mount } from 'enzyme';

function ValidationForm(props: { validations: string; value?: any; other?: any }) {
  const { validations, value, other } = props;

  return (
    <Formsy>
      <TestInput name="foo" validations={validations} value={value} />
      <TestInput name="other" value={other} />
    </Formsy>
  );
}

export function expectIsValid(testForm: React.ComponentElement<any, any>) {
  const form = mount(testForm);
  const inputComponent = form.find(TestInput).first();
  return expect(inputComponent.instance().isValid());
}

describe('equalsField', () => {
  it('should pass when the value is equal', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value="bar" other="bar" />).toEqual(true);
  });

  it('should fail when the value is not equal', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value="bar" other="" />).toEqual(false);
  });

  it('should pass with an empty string', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value="" other="" />).toEqual(true);
  });

  it('should pass with an undefined', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value={undefined} other={undefined} />).toEqual(true);
  });

  it('should pass with a null', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value={null} other={null} />).toEqual(true);
  });

  it('should work with a number', () => {
    expectIsValid(<ValidationForm validations="equalsField:other" value={42} other={42} />).toEqual(true);
    expectIsValid(<ValidationForm validations="equalsField:other" value={42} other={10} />).toEqual(false);
  });
});
