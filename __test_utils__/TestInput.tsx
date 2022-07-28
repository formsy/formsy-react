/* eslint-disable react/destructuring-assignment */
import React from 'react';

import { withFormsy } from '../src';
import { PassDownProps } from '../src/withFormsy';

export type FormsyInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'required' | 'value'> &
  PassDownProps<string> & { testId?: string };

class TestInput extends React.Component<FormsyInputProps> {
  updateValue = (event) => {
    this.props.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  };

  render() {
    return (
      <input
        type={this.props.type || 'text'}
        value={this.props.value || ''}
        onChange={this.updateValue}
        data-is-valid={this.props.isValid}
        data-is-pristine={this.props.isPristine}
        data-error-message={this.props.errorMessage}
        data-error-messages={this.props.errorMessages.join(';')}
        data-is-form-disabled={this.props.isFormDisabled}
        data-is-form-submitted={this.props.isFormSubmitted}
        data-value={JSON.stringify(this.props.value)}
        data-testid={this.props.testId}
      />
    );
  }
}

export function InputFactory(methods) {
  Object.keys(methods).forEach((method) => {
    if (Object.prototype.hasOwnProperty.call(methods, method)) {
      TestInput.prototype[method] = methods[method];
    }
  });
  return withFormsy<FormsyInputProps, any>(TestInput);
}

export default withFormsy<FormsyInputProps, any>(TestInput);
