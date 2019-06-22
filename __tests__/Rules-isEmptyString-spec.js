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
          validations="isEmptyString"
          value={this.props.inputValue}
        />
      </Formsy>
    );
  }
}

describe('isEmptyString', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with non-empty string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="abc" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with an empty string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with null', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={null} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={42} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with a zero', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={0} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});
