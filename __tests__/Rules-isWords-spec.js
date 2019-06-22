import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Formsy from './..';
import { InputFactory } from '../__test_utils__/TestInput';

const TestInput = InputFactory({
  render() {
    return <input value={this.props.value} readOnly />;
  },
});

class TestForm extends React.Component {
  render() {
    return (
      <Formsy>
        <TestInput
          name="foo"
          validations="isWords"
          value={this.props.inputValue}
        />
      </Formsy>
    );
  }
}

describe('isWord', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with a 1 word', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="sup" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with 2 words', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue="sup dude" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a string with numbers', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="sup 42" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with an undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={null} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={42} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});
