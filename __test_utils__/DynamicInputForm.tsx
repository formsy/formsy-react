import * as React from 'react';
import Formsy from '../src';
import TestInput from './TestInput';

interface DynamicInputFormProps {
  onSubmit: (model: any) => void;
  inputName?: string;
}

class DynamicInputForm extends React.Component<DynamicInputFormProps, { input: typeof TestInput }> {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
  }

  private addInput = () => {
    const { inputName } = this.props;
    this.setState({
      input: <TestInput name={inputName} value="" />,
    });
  };

  public render() {
    const { onSubmit, children } = this.props;
    const { input } = this.state;

    return (
      <>
        <Formsy onSubmit={onSubmit}>
          {input}
          {children}
        </Formsy>
        <button type="button" onClick={this.addInput}>
          Add input
        </button>
      </>
    );
  }
}

export default DynamicInputForm;
