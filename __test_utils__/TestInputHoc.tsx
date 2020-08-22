import React from 'react';
import { withFormsy } from '../src';

class TestComponent extends React.Component {
  render() {
    return <input />;
  }
}

export default withFormsy(TestComponent as any);
