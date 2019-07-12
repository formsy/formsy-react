import React from 'react';
import { mount } from 'enzyme';

import Formsy from '../src';
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
        <TestInput name="foo" validations="isEmail" value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('isEmail', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with "foo"', () => {
    const form = mount(<TestForm inputValue="foo" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });

  it('should pass with "foo@foo.com"', () => {
    const form = mount(<TestForm inputValue="foo@foo.com" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with new long domains', () => {
    const form = mount(<TestForm inputValue="tickets@now.diamonds" />);
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

  it('should fail with a number', () => {
    const form = mount(<TestForm inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });
});
