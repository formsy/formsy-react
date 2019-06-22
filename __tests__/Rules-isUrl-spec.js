import React from 'react';

import Formsy from './..';
import { InputFactory } from '../__test_utils__/TestInput';
import { mount } from 'enzyme';

const TestInput = InputFactory({
  render() {
    return <input value={this.props.value} readOnly />;
  },
});

class TestForm extends React.Component {
  render() {
    return (
      <Formsy>
        <TestInput name="foo" validations="isUrl" value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('isUrl', () => {
  it('should pass with default value', () => {
    const form = mount(<TestForm />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with "foo"', () => {
    const form = mount(<TestForm inputValue="foo" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with "https://www.google.com/"', () => {
    const form = mount(<TestForm inputValue="https://www.google.com/" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with an undefined', () => {
    const form = mount(<TestForm inputValue={undefined} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a null', () => {
    const form = mount(<TestForm inputValue={null} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a number', () => {
    const form = mount(<TestForm inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with an empty string', () => {
    const form = mount(<TestForm inputValue="" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });
});
