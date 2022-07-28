import React from 'react';
import { withFormsy } from '../src';
import { PassDownProps } from '../src/withFormsy';

type TestComponentProps = { testId?: string; name?: string } & PassDownProps<string>;

class TestComponent extends React.Component<TestComponentProps> {
  render() {
    const { testId, name } = this.props;
    return <input data-testid={testId} name={name} />;
  }
}

export default withFormsy<TestComponentProps, any>(TestComponent);
