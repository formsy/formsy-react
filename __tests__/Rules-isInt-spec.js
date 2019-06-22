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
          validations="isInt"
          value={this.props.inputValue}
        />
      </Formsy>
    );
  }
}

describe('isInt', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with an empty string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="abc" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with a number as string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="+42" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail string with digits', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue="42 is an answer" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with an int', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={42} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a float', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue={Math.PI} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with a float in science notation', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="-1e3" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with null', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={null} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with a zero', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={0} />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });
});
