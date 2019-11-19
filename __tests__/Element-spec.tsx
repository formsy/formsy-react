import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Formsy, { withFormsy } from '../src';
import immediate from '../__test_utils__/immediate';
import TestInput, { InputFactory } from '../__test_utils__/TestInput';

describe('Element', () => {
  it('should pass down correct value prop after using setValue()', () => {
    const form = mount(
      <Formsy>
        <TestInput name="foo" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');
    expect(input.instance().value).toEqual('foo');
    input.simulate('change', { target: { value: 'foobar' } });
    expect(input.instance().value).toEqual('foobar');
  });

  it('withFormsy: should only set the value and not validate when calling setValue(val, false)', () => {
    const Input = withFormsy(
      class TestInput extends React.Component {
        updateValue = event => {
          this.props.setValue(event.target.value, false);
        };
        render() {
          return <input type="text" value={this.props.value} onChange={this.updateValue} />;
        }
      },
    );
    const form = mount(
      <Formsy>
        <Input name="foo" value="foo" innerRef="comp" />
      </Formsy>,
    );
    const inputComponent = form.find(Input);
    const setStateSpy = sinon.spy(inputComponent.instance(), 'setState');
    const inputElement = form.find('input');

    expect(setStateSpy.called).toEqual(false);
    inputElement.simulate('change', { target: { value: 'foobar' } });
    expect(setStateSpy.calledOnce).toEqual(true);
    expect(setStateSpy.calledWithExactly({ value: 'foobar' })).toEqual(true);
  });

  it('should set back to pristine value when running reset', () => {
    let reset = null;
    const Input = InputFactory({
      componentDidUpdate() {
        reset = this.props.resetValue;
      },
    });
    const form = mount(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');
    input.simulate('change', { target: { value: 'foobar' } });
    reset();
    expect(input.instance().value).toEqual('foo');
  });

  it('should return error message passed when calling getErrorMessage()', () => {
    let errorMessage = null;
    const Input = InputFactory({
      componentDidUpdate() {
        errorMessage = this.props.errorMessage;
      },
    });
    mount(
      <Formsy>
        <Input name="foo" value="foo" validations="isEmail" validationError="Has to be email" />
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
    const form = mount(
      <Formsy action="/users">
        <Input name="foo" value="foo" validations="isEmail" />
      </Formsy>,
    );

    expect(isValid).toEqual(false);
    const input = form.find('input');
    input.simulate('change', { target: { value: 'foo@foo.com' } });
    expect(isValid).toEqual(true);
  });

  it('should return true or false when calling isRequired() depending on passed required attribute', () => {
    const isRequireds = [];
    const Input = InputFactory({
      componentDidUpdate() {
        isRequireds.push(this.props.isRequired);
      },
    });
    mount(
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
      componentDidUpdate() {
        showRequireds.push(this.props.showRequired);
      },
    });
    mount(
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
    const form = mount(
      <Formsy action="/users">
        <Input name="A" value="foo" />
      </Formsy>,
    );

    expect(form.instance().inputs[0].isPristine()).toEqual(true);
    const input = form.find('input');
    input.simulate('change', { target: { value: 'foo' } });
    expect(form.instance().inputs[0].isPristine()).toEqual(false);
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
    const form = mount(<TestForm />);

    form.instance().changeValue();
    const input = form.find('input');
    immediate(() => {
      expect(input.instance().value).toEqual('foo');
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
    const form = mount(<TestForm />);

    const input = form.find(TestInput);
    expect(input.instance().isValidValue('foo@bar.com')).toEqual(true);
    expect(input.instance().isValidValue('foo@bar')).toEqual(false);
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
    const form = mount(<TestForm />);

    const input = form.find(TestInput);
    expect(input.instance().isValidValue('foo@bar.com')).toEqual(true);
    expect(input.instance().isValidValue('foo@bar')).toEqual(false);
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(true);
    const input = form.find('input');
    input.simulate('change', { target: { value: 'bar' } });
    expect(inputComponent.instance().isValid()).toEqual(false);
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(
      inputComponent
        .at(0)
        .instance()
        .isValid(),
    ).toEqual(true);
    expect(
      inputComponent
        .at(1)
        .instance()
        .isValid(),
    ).toEqual(true);
    const input = form.find('input');
    input.at(0).simulate('change', { target: { value: 'bar' } });
    expect(
      inputComponent
        .at(0)
        .instance()
        .isValid(),
    ).toEqual(false);
    expect(
      inputComponent
        .at(1)
        .instance()
        .isValid(),
    ).toEqual(false);
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().getErrorMessage()).toEqual('bar3');
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().getErrorMessage()).toEqual('bar');
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().getErrorMessage()).toEqual('bar3');
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().getErrorMessage()).toEqual('bar1');
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
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
    const form = mount(<TestForm />);

    const inputComponent = form.find(TestInput);
    expect(inputComponent.instance().isValid()).toEqual(false);
    expect(inputComponent.instance().getErrorMessage()).toEqual('Field is required');
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
    const form = mount(<TestForm />);

    form.setState({
      foo: { foo: 'foo' },
      bar: ['bar'],
    });

    const inputs = form.find(TestInput);
    expect(
      inputs
        .at(0)
        .instance()
        .getValue(),
    ).toEqual({ foo: 'foo' });
    expect(
      inputs
        .at(1)
        .instance()
        .getValue(),
    ).toEqual(['bar']);
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
            {this.state.bool ? <TestInput name="foo" /> : <TestInput name="bar" />}
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);

    const input = form.find(TestInput);
    expect(input.instance().isFormDisabled()).toEqual(true);
    form.instance().flip();
    expect(input.instance().isFormDisabled()).toEqual(false);
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
    const form = mount(<TestForm />);

    expect(true).toBe(true);

    const formEl = form.find('form');
    formEl.simulate('submit');
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
    const form = mount(<TestForm />);

    expect(true).toBe(true);

    const formEl = form.find('form');
    formEl.simulate('submit');
  });

  it('input should rendered once with PureRenderMixin', () => {
    var renderSpy = sinon.spy();

    const Input = InputFactory({
      shouldComponentUpdate: function() {
        return false;
      },
      render: function() {
        renderSpy();
        return <input type={this.props.type} value={this.props.value} onChange={this.updateValue} />;
      },
    });

    const form = mount(
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
        return <input type={this.props.type} value={this.props.value} onChange={this.updateValue} />;
      },
    });

    const form = mount(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');

    expect(renderSpy.calledOnce).toEqual(true);

    input.simulate('change', { target: { value: 'fooz' } });
    expect(input.instance().value).toEqual('fooz');
    expect(renderSpy.calledTwice).toEqual(true);
  });

  it('binds all necessary methods', () => {
    const onInputRef = input => {
      ['isValidValue', 'resetValue', 'setValidations', 'setValue'].forEach(fnName => {
        const fn = input[fnName];
        try {
          fn();
        } catch (e) {
          throw new Error(`Method '${fnName}' isn't bound.`);
        }
      });
    };

    mount(
      <Formsy>
        <TestInput ref={onInputRef} name="name" value="foo" />
      </Formsy>,
    );
  });

  it('unregisters on unmount', () => {
    const TestComponent = ({ hasInput }) => <Formsy>{hasInput ? <TestInput name="foo" value="foo" /> : null}</Formsy>;

    const wrapper = mount(<TestComponent hasInput />);
    const formsy = wrapper.find(Formsy).instance();

    expect(formsy.inputs).toHaveLength(1);

    wrapper.setProps({ hasInput: false });

    expect(formsy.inputs).toHaveLength(0);
  });
});
