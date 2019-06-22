import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Formsy, { withFormsy } from './..';
import { InputFactory } from '../__test_utils__/TestInput';
import immediate from '../__test_utils__/immediate';
import sinon from 'sinon';

class MyTest extends React.Component {
  static defaultProps = { type: 'text' };

  handleChange = event => {
    this.props.setValue(event.target.value);
  };

  render() {
    return (
      <input
        type={this.props.type}
        value={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}
const FormsyTest = withFormsy(MyTest);

describe('Validation', () => {
  it('should reset only changed form element when external error is passed', () => {
    const form = TestUtils.renderIntoDocument(
      <Formsy
        onSubmit={(model, reset, invalidate) =>
          invalidate({ foo: 'bar', bar: 'foo' })
        }
      >
        <FormsyTest name="foo" />
        <FormsyTest name="bar" />
      </Formsy>,
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT')[0];
    const inputComponents = TestUtils.scryRenderedComponentsWithType(
      form,
      FormsyTest,
    );

    form.submit();
    expect(inputComponents[0].isValid()).toEqual(false);
    expect(inputComponents[1].isValid()).toEqual(false);

    TestUtils.Simulate.change(input, { target: { value: 'bar' } });
    immediate(() => {
      expect(inputComponents[0].isValid()).toEqual(true);
      expect(inputComponents[1].isValid()).toEqual(false);
    });
  });

  it('should let normal validation take over when component with external error is changed', () => {
    const form = TestUtils.renderIntoDocument(
      <Formsy
        onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}
      >
        <FormsyTest name="foo" validations="isEmail" />
      </Formsy>,
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      FormsyTest,
    );

    form.submit();
    expect(inputComponent.isValid()).toEqual(false);

    TestUtils.Simulate.change(input, { target: { value: 'bar' } });
    immediate(() => {
      expect(inputComponent.getValue()).toEqual('bar');
      expect(inputComponent.isValid()).toEqual(false);
    });
  });

  it('should trigger an onValid handler, if passed, when form is valid', () => {
    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    TestUtils.renderIntoDocument(
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

    TestUtils.renderIntoDocument(
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

    TestUtils.renderIntoDocument(
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
    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <CustomInput name="foo" value="foo" required />
      </Formsy>,
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).toEqual(true);
  });

  it('should provide invalidate callback on onValidSubmit', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy
            onValidSubmit={(model, reset, invalidate) =>
              invalidate({ foo: 'bar' })
            }
          >
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm />);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toEqual(false);
  });

  it('should provide invalidate callback on onInvalidSubmit', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy
            onInvalidSubmit={(model, reset, invalidate) =>
              invalidate({ foo: 'bar' })
            }
          >
            <FormsyTest name="foo" value="foo" validations="isEmail" />
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm />);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    expect(input.getErrorMessage()).toEqual('bar');
  });

  it('should not invalidate inputs on external errors with preventExternalInvalidation prop', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy
            preventExternalInvalidation
            onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}
          >
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm />);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toEqual(true);
  });

  it('should invalidate inputs on external errors without preventExternalInvalidation prop', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy
            onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}
          >
            <FormsyTest name="foo" value="foo" />
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm />);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toEqual(false);
  });
});
