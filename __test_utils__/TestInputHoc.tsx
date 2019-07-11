import React from 'react';
import { withFormsy } from './..';

class TestComponent extends React.Component {
  render() {
    return <input />;
  }
}

export default withFormsy(TestComponent);
