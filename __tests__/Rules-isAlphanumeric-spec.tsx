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
        <TestInput name="foo" validations="isAlphanumeric" value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('isAlphanumeric', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a string is only latin letters', () => {
    const form = mount(<TestForm inputValue="myValue" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a string with numbers', () => {
    const form = mount(<TestForm inputValue="myValue42" />);
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

  it('should pass with an empty string', () => {
    const form = mount(<TestForm inputValue={''} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a number', () => {
    const form = mount(<TestForm inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a non alpha and number symbols', () => {
    const value = '!@#$%^&*()';
    const form = mount(<TestForm inputValue={value} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });
});
