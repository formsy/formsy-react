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
        <TestInput name="foo" validations="isNumeric" value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('isNumeric', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with an empty string', () => {
    const form = mount(<TestForm inputValue="" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with an unempty string', () => {
    const form = mount(<TestForm inputValue="foo" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with a number as string', () => {
    const form = mount(<TestForm inputValue="+42" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a number as string with not digits', () => {
    const form = mount(<TestForm inputValue="42 is an answer" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with an int', () => {
    const form = mount(<TestForm inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a float', () => {
    const form = mount(<TestForm inputValue={Math.PI} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a float in science notation', () => {
    const form = mount(<TestForm inputValue="-1e3" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
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

  it('should pass with a zero', () => {
    const form = mount(<TestForm inputValue={0} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });
});
