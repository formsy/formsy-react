import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Formsy, { withFormsy } from '../src';
import immediate from '../__test_utils__/immediate';
import { InputFactory } from '../__test_utils__/TestInput';
import { PassDownProps } from '../src/Wrapper';
import { getFormInstance, getInputInstance } from '../__test_utils__/getInput';

class MyTest extends React.Component<{ type?: string } & PassDownProps<string>> {
  public static defaultProps = { type: 'text' };

  handleChange = event => {
    const { setValue } = this.props;
    setValue(event.target.value);
  };

  render() {
    const { type, value } = this.props;
    return <input type={type} value={value || ''} onChange={this.handleChange} />;
  }
}
const FormsyTest = withFormsy<{ type?: string }, string>(MyTest);

describe('Validation', () => {
  it('should reset only changed form element when external error is passed', () => {
    const form = mount(
      <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar', bar: 'foo' })}>
        <FormsyTest name="foo" />
        <FormsyTest name="bar" />
      </Formsy>,
    );

    const input = form.find('input').at(0);
    const inputComponents = form.find(FormsyTest);

    getFormInstance(form).submit();
    expect(getInputInstance(inputComponents.at(0)).isValid()).toEqual(false);
    expect(getInputInstance(inputComponents.at(1)).isValid()).toEqual(false);

    input.simulate('change', { target: { value: 'bar' } });
    immediate(() => {
      expect(getInputInstance(inputComponents.at(0)).isValid()).toEqual(true);
      expect(getInputInstance(inputComponents).isValid()).toEqual(false);
    });
  });

  it('should let normal validation take over when component with external error is changed', () => {
    const form = mount(
      <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
        <FormsyTest name="foo" validations="isEmail" />
      </Formsy>,
    );

    const input = form.find('input');
    const inputComponent = form.find(FormsyTest);

    getFormInstance(form).submit();
    expect(getInputInstance(inputComponent).isValid()).toEqual(false);

    input.simulate('change', { target: { value: 'bar' } });
    immediate(() => {
      expect(getInputInstance(inputComponent).getValue()).toEqual('bar');
      expect(getInputInstance(inputComponent).isValid()).toEqual(false);
    });
  });

  it('should trigger an onValid handler, if passed, when form is valid', () => {
    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    mount(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" value="bar" required />
      </Formsy>,
    );

    expect(onValid.called).toEqual(true);
    expect(onInvalid.called).toEqual(false);
  });

  it('should trigger an onInvalid handler, if passed, when form is invalid', () => {
    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    mount(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" required />
      </Formsy>,
    );

    expect(onValid.called).toEqual(false);
    expect(onInvalid.called).toEqual(true);
  });

  it('should trigger the `onInvalid` handler if a required element receives `null` as the value', () => {
    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    mount(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest value={null} name="foo" required />
      </Formsy>,
    );

    expect(onValid.called).toEqual(false);
    expect(onInvalid.called).toEqual(true);
  });

  it('should be able to use provided validate function', () => {
    let isValid = false;
    const CustomInput = InputFactory({
      componentDidMount() {
        isValid = this.props.isValid;
      },
    });
    mount(
      <Formsy>
        <CustomInput name="foo" value="foo" required />
      </Formsy>,
    );

    expect(isValid).toEqual(true);
  });

  it('should provide invalidate callback on onValidSubmit', () => {
    function TestForm() {
      return (
        <Formsy onValidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(getInputInstance(input).isValid()).toEqual(false);
  });

  it('should provide invalidate callback on onInvalidSubmit', () => {
    function TestForm() {
      return (
        <Formsy onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" validations="isEmail" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(getInputInstance(input).getErrorMessage()).toEqual('bar');
  });

  it('should not invalidate inputs on external errors with preventExternalInvalidation prop', () => {
    function TestForm() {
      return (
        <Formsy preventExternalInvalidation onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(getInputInstance(input).isValid()).toEqual(true);
  });

  it('should invalidate inputs on external errors without preventExternalInvalidation prop', () => {
    function TestForm() {
      return (
        <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(getInputInstance(input).isValid()).toEqual(false);
  });

  it('should throw errors on invalid validation string', () => {
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation(() => {
      // do nothing
    });

    function TestForm() {
      return (
        <Formsy onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" validations="isLength:3:7" />
        </Formsy>
      );
    }

    expect(() => mount(<TestForm />)).toThrow(
      'Formsy does not support multiple args on string validations. Use object format of validations instead.',
    );

    mockConsoleError.mockRestore();
  });

  it('should throw errors on missing input name', () => {
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation(() => {
      // do nothing
    });

    function TestForm() {
      return (
        <Formsy onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="" value="foo" />
        </Formsy>
      );
    }

    expect(() => mount(<TestForm />)).toThrow('Form Input requires a name property when used');

    mockConsoleError.mockRestore();
  });
});
