import React from 'react';
import { withFormsy } from './..';
import { PassDownProps } from '../src/Wrapper';

class TestInput extends React.Component<React.HTMLProps<HTMLInputElement>> {
  updateValue = event => {
    const formsyProps = this.props as PassDownProps;
    formsyProps.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  };

  render() {
    return <input type={this.props.type || 'text'} value={this.props.value} onChange={this.updateValue} />;
  }
}

export function InputFactory(methods) {
  for (let method in methods) {
    if (methods.hasOwnProperty(method)) {
      TestInput.prototype[method] = methods[method];
    }
  }
  return withFormsy(TestInput);
}

export default withFormsy(TestInput);
