import { PropsWithChildren } from 'react';
import * as React from 'react';
import Formsy from '../src';
import TestInput from './TestInput';

interface DynamicInputFormProps {
  onSubmit: (model: any) => void;
  inputName?: string;
}

class DynamicInputForm extends React.Component<PropsWithChildren<DynamicInputFormProps>, { input: any }> {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }

  private addInput = () => {
    const { inputName } = this.props;
    this.setState({
      input: <TestInput name={inputName} value="" testId="test-input" />,
    });
  };

  public render() {
    const { onSubmit, children } = this.props;
    const { input } = this.state;

    return (
      <>
        <Formsy onSubmit={onSubmit} data-testid="form">
          {input}
          {children}
        </Formsy>
        <button type="button" onClick={this.addInput} data-testid="add-input-btn">
          Add input
        </button>
      </>
    );
  }
}

export default DynamicInputForm;
