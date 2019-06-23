import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Formsy, { withFormsy } from './..';
import { InputFactory } from '../__test_utils__/TestInput';
import immediate from '../__test_utils__/immediate';

class MyTest extends React.Component {
  static defaultProps = { type: 'text' };

  handleChange = event => {
    this.props.setValue(event.target.value);
  };

  render() {
    return <input type={this.props.type} value={this.props.value} onChange={this.handleChange} />;
  }
}
const FormsyTest = withFormsy(MyTest);

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

    form.instance().submit();
    expect(
      inputComponents
        .at(0)
        .instance()
        .isValid(),
    ).toEqual(false);
    expect(
      inputComponents
        .at(1)
        .instance()
        .isValid(),
    ).toEqual(false);

    input.simulate('change', { target: { value: 'bar' } });
    immediate(() => {
      expect(
        inputComponents
          .at(0)
          .instance()
          .isValid(),
      ).toEqual(true);
      expect(
        inputComponents
          .at(1)
          .instance()
          .isValid(),
      ).toEqual(false);
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

    form.instance().submit();
    expect(inputComponent.instance().isValid()).toEqual(false);

    input.simulate('change', { target: { value: 'bar' } });
    immediate(() => {
      expect(inputComponent.getValue()).toEqual('bar');
      expect(inputComponent.instance().isValid()).toEqual(false);
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
      componentDidMount: function() {
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
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onValidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(input.instance().isValid()).toEqual(false);
  });

  it('should provide invalidate callback on onInvalidSubmit', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo" validations="isEmail" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(input.instance().getErrorMessage()).toEqual('bar');
  });

  it('should not invalidate inputs on external errors with preventExternalInvalidation prop', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy preventExternalInvalidation onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(input.instance().isValid()).toEqual(true);
  });

  it('should invalidate inputs on external errors without preventExternalInvalidation prop', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const formEl = form.find('form');
    const input = form.find(FormsyTest);
    formEl.simulate('submit');
    expect(input.instance().isValid()).toEqual(false);
  });
});
