import React from 'react';
import { mount } from 'enzyme';

import Formsy from '../src';
import { InputFactory } from './TestInput';
import { getWrapperInstance } from './getInput';

const TestInput = InputFactory({
  render() {
    const { value } = this.props;
    return <input value={value || ''} readOnly />;
  },
});

function ValidationForm(props: { validations: string; value?: any }) {
  const { validations, value } = props;

  return (
    <Formsy>
      <TestInput name="foo" validations={validations} value={value} />
    </Formsy>
  );
}

export function expectIsValid(testForm: React.ComponentElement<any, any>) {
  const form = mount(testForm);
  const inputComponent = form.find('Formsy(TestInput)');
  return expect(getWrapperInstance(inputComponent).isValid());
}

export default ValidationForm;
