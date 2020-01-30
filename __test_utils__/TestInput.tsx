import React from 'react';
import { withFormsy } from '../src';
import { PassDownProps } from '../src/Wrapper';

type Props = React.HTMLProps<HTMLInputElement>;

class TestInput extends React.Component<Props> {
  updateValue = event => {
    const formsyProps = this.props as PassDownProps<string>;
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
  return withFormsy<Props, string>(TestInput);
}

export default withFormsy<Props, string>(TestInput);
