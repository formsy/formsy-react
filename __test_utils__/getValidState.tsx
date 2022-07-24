import { render } from '@testing-library/react';
import React from 'react';

import Formsy from '../src';
import { InputFactory } from './TestInput';

const TestInput = InputFactory({
  render() {
    const { value, isValid, testId } = this.props;
    return <input value={value || ''} readOnly data-is-valid={isValid} data-testid={testId} />;
  },
});

function ValidationForm(props: { validations: string; value?: any }) {
  const { validations, value } = props;

  return (
    <Formsy>
      <TestInput name="foo" validations={validations} value={value} testId="test-input" />
    </Formsy>
  );
}

export async function getValidState(testForm: React.ComponentElement<any, any>) {
  const form = render(testForm);
  const inputComponent = await form.findByTestId('test-input');

  return inputComponent.dataset.isValid === 'true';
}

export default ValidationForm;
