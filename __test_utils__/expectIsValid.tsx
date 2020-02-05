import React from 'react';
import { mount } from 'enzyme';

import Formsy from '../src';
import { InputFactory } from './TestInput';

const TestInput = InputFactory({
  render() {
    return <input value={this.props.value || ''} readOnly />;
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
  const inputComponent = form.find(TestInput);
  return expect(inputComponent.instance().isValid());
}

export default ValidationForm;
