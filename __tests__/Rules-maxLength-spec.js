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
          validations="maxLength:3"
          value={this.props.inputValue}
        />
      </Formsy>
    );
  }
}

describe('maxLength', () => {
  it('should pass with a default value', () => {
    const form = TestUtils.renderIntoDocument(<TestForm />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should pass when a string's length is smaller", () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="hi" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should pass when a string's length is equal", () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="bar" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
  });

  it("should fail when a string's length is bigger", () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="foobar" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should pass with empty string', () => {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue="" />);
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
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
