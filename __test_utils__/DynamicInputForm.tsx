import * as React from 'react';
import Formsy from '../src';
import TestInput from './TestInput';

interface DynamicInputFormProps {
  onSubmit: (model: any) => void;
  inputName?: string;
}

class DynamicInputForm extends React.Component<DynamicInputFormProps> {
  public state = {
    input: null,
  };

  private addInput = () => {
    const { inputName } = this.props;
    this.setState({
      input: <TestInput name={inputName} value="" />,
    });
  };

  public render() {
    return (
      <>
        <Formsy onSubmit={this.props.onSubmit}>
          {this.state.input}
          {this.props.children}
        </Formsy>
        <button type="button" onClick={this.addInput} />
      </>
    );
  }
}

export default DynamicInputForm;
