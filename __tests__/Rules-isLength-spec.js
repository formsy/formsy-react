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

describe('isLength:3', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a string too small', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue="hi" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with a string too long', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue="hi ho happ" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with matching length', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue="foo" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with null', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue={null} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with empty string', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue="" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:3" inputValue={123} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});

describe('isLength:0', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a string too small', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue="hi" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should fail with a string too long', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue="hi ho happ" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with matching length', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue="" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with undefined', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue={undefined} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with null', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue={null} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should pass with empty string', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue="" />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = TestUtils.renderIntoDocument(
      <TestForm rule="isLength:0" inputValue={123} />,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });
});
