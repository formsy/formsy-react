import React from 'react';
import { mount } from 'enzyme';

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
        <TestInput name="foo" validations={this.props.rule} value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('minLength:3', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm rule="minLength:3" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    const form = mount(<TestForm rule="minLength:3" inputValue="myValue" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it("should fail when a string's length is smaller", () => {
    const form = mount(<TestForm rule="minLength:3" inputValue="my" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with empty string', () => {
    const form = mount(<TestForm rule="minLength:3" inputValue="" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with an undefined', () => {
    const form = mount(<TestForm rule="minLength:3" inputValue={undefined} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = mount(<TestForm rule="minLength:3" inputValue={null} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = mount(<TestForm rule="minLength:3" inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });
});

describe('minLength:0', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm rule="minLength:0" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it("should pass when a string's length is bigger", () => {
    const form = mount(<TestForm rule="minLength:0" inputValue="myValue" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with empty string', () => {
    const form = mount(<TestForm rule="minLength:0" inputValue="" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with an undefined', () => {
    const form = mount(<TestForm rule="minLength:0" inputValue={undefined} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = mount(<TestForm rule="minLength:0" inputValue={null} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = mount(<TestForm rule="minLength:0" inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });
});
