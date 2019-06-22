import React from 'react';
import TestUtils from 'react-dom/test-utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import sinon from 'sinon';

import Formsy, { withFormsy } from './..';
import TestInput, { InputFactory } from '../__test_utils__/TestInput';
import immediate from '../__test_utils__/immediate';

describe('Element', () => {
  it('should pass down correct value prop after using setValue()', () => {
    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <TestInput name="foo" value="foo" />
      </Formsy>,
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(input.value).toEqual('foo');
    TestUtils.Simulate.change(input, { target: { value: 'foobar' } });
    expect(input.value).toEqual('foobar');
  });

  it('withFormsy: should only set the value and not validate when calling setValue(val, false)', () => {
    const Input = withFormsy(
      class TestInput extends React.Component {
        updateValue = event => {
          this.props.setValue(event.target.value, false);
        };
        render() {
          return (
            <input
              type="text"
              value={this.props.value}
              onChange={this.updateValue}
            />
          );
        }
      },
    );
    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <Input name="foo" value="foo" innerRef="comp" />
      </Formsy>,
    );
    const inputComponent = TestUtils.findRenderedComponentWithType(form, Input);
    const setStateSpy = sinon.spy(inputComponent, 'setState');
    const inputElement = TestUtils.findRenderedDOMComponentWithTag(
      form,
      'INPUT',
    );

    expect(setStateSpy.called).toEqual(false);
    TestUtils.Simulate.change(inputElement, { target: { value: 'foobar' } });
    expect(setStateSpy.calledOnce).toEqual(true);
    expect(setStateSpy.calledWithExactly({ value: 'foobar' })).toEqual(true);
  });

  it('should set back to pristine value when running reset', () => {
    let reset = null;
    const Input = InputFactory({
      componentDidMount: function() {
        reset = this.props.resetValue;
      },
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, { target: { value: 'foobar' } });
    reset();
    expect(input.value).toEqual('foo');
  });

  it('should return error message passed when calling getErrorMessage()', () => {
    let errorMessage = null;
    const Input = InputFactory({
      componentDidMount: function() {
        errorMessage = this.props.errorMessage;
      },
    });
    TestUtils.renderIntoDocument(
      <Formsy>
        <Input
          name="foo"
          value="foo"
          validations="isEmail"
          validationError="Has to be email"
        />
      </Formsy>,
    );

    expect(errorMessage).toEqual('Has to be email');
  });

  it('should return true or false when calling isValid() depending on valid state', () => {
    let isValid = null;
    const Input = InputFactory({
      componentWillReceiveProps: function(nextProps) {
        isValid = nextProps.isValid;
      },
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy action="/users">
        <Input name="foo" value="foo" validations="isEmail" />
      </Formsy>,
    );

    expect(isValid).toEqual(false);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, { target: { value: 'foo@foo.com' } });
    expect(isValid).toEqual(true);
  });

  it('should return true or false when calling isRequired() depending on passed required attribute', () => {
    const isRequireds = [];
    const Input = InputFactory({
      componentDidMount: function() {
        isRequireds.push(this.props.isRequired);
      },
    });
    TestUtils.renderIntoDocument(
      <Formsy action="/users">
        <Input name="foo" value="" />
        <Input name="foo" value="" required />
        <Input name="foo" value="foo" required="isLength:3" />
      </Formsy>,
    );

    expect(isRequireds[0]).toEqual(false);
    expect(isRequireds[1]).toEqual(true);
    expect(isRequireds[2]).toEqual(true);
  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', () => {
    const showRequireds = [];
    const Input = InputFactory({
      componentDidMount: function() {
        showRequireds.push(this.props.showRequired);
      },
    });
    TestUtils.renderIntoDocument(
      <Formsy action="/users">
        <Input name="A" value="foo" />
        <Input name="B" value="" required />
        <Input name="C" value="" />
      </Formsy>,
    );

    expect(showRequireds[0]).toEqual(false);
    expect(showRequireds[1]).toEqual(true);
    expect(showRequireds[2]).toEqual(false);
  });

  it('should return true or false when calling isPristine() depending on input has been "touched" or not', () => {
    const Input = InputFactory();
    const form = TestUtils.renderIntoDocument(
      <Formsy action="/users">
        <Input name="A" value="foo" />
      </Formsy>,
    );

    expect(form.inputs[0].isPristine()).toEqual(true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, { target: { value: 'foo' } });
    expect(form.inputs[0].isPristine()).toEqual(false);
  });

  it('should allow an undefined value to be updated to a value', () => {
    class TestForm extends React.Component {
      state = { value: undefined };
      changeValue = () => {
        this.setState({
          value: 'foo',
        });
      };
      render() {
        return (
          <Formsy action="/users">
            <TestInput name="A" value={this.state.value} />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    form.changeValue();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    immediate(() => {
      expect(input.value).toEqual('foo');
    });
  });

  it('should be able to test a values validity', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="A" validations="isEmail" />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toEqual(true);
    expect(input.isValidValue('foo@bar')).toEqual(false);
  });

  it('should be able to use an object as validations property', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput
              name="A"
              validations={{
                isEmail: true,
              }}
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toEqual(true);
    expect(input.isValidValue('foo@bar')).toEqual(false);
  });

  it('should be able to pass complex values to a validation rule', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput
              name="A"
              validations={{
                matchRegexp: /foo/,
              }}
              value="foo"
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, { target: { value: 'bar' } });
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should be able to run a function to validate', () => {
    class TestForm extends React.Component {
      customValidationA(values, value) {
        return value === 'foo';
      }
      customValidationB(values, value) {
        return value === 'foo' && values.A === 'foo';
      }
      render() {
        return (
          <Formsy>
            <TestInput
              name="A"
              validations={{
                custom: this.customValidationA,
              }}
              value="foo"
            />
            <TestInput
              name="B"
              validations={{
                custom: this.customValidationB,
              }}
              value="foo"
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.scryRenderedComponentsWithType(
      form,
      TestInput,
    );
    expect(inputComponent[0].isValid()).toEqual(true);
    expect(inputComponent[1].isValid()).toEqual(true);
    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input[0], { target: { value: 'bar' } });
    expect(inputComponent[0].isValid()).toEqual(false);
    expect(inputComponent[1].isValid()).toEqual(false);
  });

  it('should not override error messages with error messages passed by form if passed eror messages is an empty object', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy validationErrors={{}}>
            <TestInput
              name="A"
              validations={{
                isEmail: true,
              }}
              validationError="bar2"
              validationErrors={{ isEmail: 'bar3' }}
              value="foo"
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.getErrorMessage()).toEqual('bar3');
  });

  it('should override all error messages with error messages passed by form', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy validationErrors={{ A: 'bar' }}>
            <TestInput
              name="A"
              validations={{
                isEmail: true,
              }}
              validationError="bar2"
              validationErrors={{ isEmail: 'bar3' }}
              value="foo"
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.getErrorMessage()).toEqual('bar');
  });

  it('should override validation rules with required rules', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput
              name="A"
              validations={{
                isEmail: true,
              }}
              validationError="bar"
              validationErrors={{ isEmail: 'bar2', isLength: 'bar3' }}
              value="f"
              required={{
                isLength: 1,
              }}
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.getErrorMessage()).toEqual('bar3');
  });

  it('should fall back to default error message when non exist in validationErrors map', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput
              name="A"
              validations={{
                isEmail: true,
              }}
              validationError="bar1"
              validationErrors={{ foo: 'bar2' }}
              value="foo"
            />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.getErrorMessage()).toEqual('bar1');
  });

  it('should not be valid if it is required and required rule is true', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="A" required />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
  });

  it('should return the validationError if the field is invalid and required rule is true', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="A" validationError="Field is required" required />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const inputComponent = TestUtils.findRenderedComponentWithType(
      form,
      TestInput,
    );
    expect(inputComponent.isValid()).toEqual(false);
    expect(inputComponent.getErrorMessage()).toEqual('Field is required');
  });

  it('should handle objects and arrays as values', () => {
    class TestForm extends React.Component {
      state = {
        foo: { foo: 'bar' },
        bar: ['foo'],
      };
      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={this.state.foo} />
            <TestInput name="bar" value={this.state.bar} />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    form.setState({
      foo: { foo: 'foo' },
      bar: ['bar'],
    });

    const inputs = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(inputs[0].getValue()).toEqual({ foo: 'foo' });
    expect(inputs[1].getValue()).toEqual(['bar']);
  });

  it('should handle isFormDisabled with dynamic inputs', () => {
    class TestForm extends React.Component {
      state = { bool: true };
      flip = () => {
        this.setState({
          bool: !this.state.bool,
        });
      };
      render() {
        return (
          <Formsy disabled={this.state.bool}>
            {this.state.bool ? (
              <TestInput name="foo" />
            ) : (
              <TestInput name="bar" />
            )}
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isFormDisabled()).toEqual(true);
    form.flip();
    expect(input.isFormDisabled()).toEqual(false);
  });

  it('should allow for dot notation in name which maps to a deep object', () => {
    class TestForm extends React.Component {
      onSubmit(model) {
        expect(model).toEqual({ foo: { bar: 'foo', test: 'test' } });
      }
      render() {
        return (
          <Formsy onSubmit={this.onSubmit}>
            <TestInput name="foo.bar" value="foo" />
            <TestInput name="foo.test" value="test" />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    expect(true).toBe(true);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);
  });

  it('should allow for application/x-www-form-urlencoded syntax and convert to object', () => {
    class TestForm extends React.Component {
      onSubmit(model) {
        expect(model).toEqual({ foo: ['foo', 'bar'] });
      }
      render() {
        return (
          <Formsy onSubmit={this.onSubmit}>
            <TestInput name="foo[0]" value="foo" />
            <TestInput name="foo[1]" value="bar" />
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm />);

    expect(true).toBe(true);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);
  });

  it('input should rendered once with PureRenderMixin', () => {
    var renderSpy = sinon.spy();

    const Input = InputFactory({
      shouldComponentUpdate: function() {
        return false;
      },
      render: function() {
        renderSpy();
        return (
          <input
            type={this.props.type}
            value={this.props.value}
            onChange={this.updateValue}
          />
        );
      },
    });

    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    expect(renderSpy.calledOnce).toEqual(true);
  });

  it('input should call shouldComponentUpdate with correct value', () => {
    var renderSpy = sinon.spy();

    const Input = InputFactory({
      shouldComponentUpdate: function(prevProps) {
        return prevProps.value !== this.props.value;
      },
      render: function() {
        renderSpy();
        return (
          <input
            type={this.props.type}
            value={this.props.value}
            onChange={this.updateValue}
          />
        );
      },
    });

    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

    expect(renderSpy.calledOnce).toEqual(true);

    TestUtils.Simulate.change(input, { target: { value: 'fooz' } });
    expect(input.value).toEqual('fooz');
    expect(renderSpy.calledTwice).toEqual(true);
  });

  it('binds all necessary methods', () => {
    const onInputRef = input => {
      ['isValidValue', 'resetValue', 'setValidations', 'setValue'].forEach(
        fnName => {
          const fn = input[fnName];
          try {
            fn();
          } catch (e) {
            throw new Error(`Method '${fnName}' isn't bound.`);
          }
        },
      );
    };

    TestUtils.renderIntoDocument(
      <Formsy>
        <TestInput ref={onInputRef} name="name" value="foo" />
      </Formsy>,
    );
  });
});
