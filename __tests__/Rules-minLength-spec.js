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
          validations={this.props.rule}
          value={this.props.inputValue}
        />
      </Formsy>
    );
  }
}

describe('minLength:3', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue="myValue" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should fail when a string's length is smaller", () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue="my" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with empty string', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue="" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with an undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue={null} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:3" inputValue={42} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});

describe('minLength:0', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:0" inputValue="myValue" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with empty string', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:0" inputValue="" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with an undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:0" inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:0" inputValue={null} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="minLength:0" inputValue={42} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});
