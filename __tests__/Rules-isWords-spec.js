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
        <TestInput name="foo" validations="isWords" value={this.props.inputValue} />
      </Formsy>
    );
  }
}

describe('isWord', () => {
  it('should pass with a default value', () => {
    const form = mount(<TestForm />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with a 1 word', () => {
    const form = mount(<TestForm inputValue="sup" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should pass with 2 words', () => {
    const form = mount(<TestForm inputValue="sup dude" />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
  });

  it('should fail with a string with numbers', () => {
    const form = mount(<TestForm inputValue="sup 42" />);
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

  it('should fail with a number', () => {
    const form = mount(<TestForm inputValue={42} />);
    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
  });
});
