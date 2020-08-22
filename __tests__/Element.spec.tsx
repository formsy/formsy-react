import { mount } from 'enzyme';
import React from 'react';
import { getFormInstance, getInputInstance, getWrapperInstance } from '../__test_utils__/getInput';
import immediate from '../__test_utils__/immediate';
import TestInput, { FormsyInputProps, InputFactory } from '../__test_utils__/TestInput';

import Formsy, { withFormsy } from '../src';

describe('Element', () => {
  it('should pass down correct value prop after using setValue()', () => {
    const form = mount(
      <Formsy>
        <TestInput name="foo" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');
    expect(getInputInstance(input).value).toEqual('foo');
    input.simulate('change', { target: { value: 'foobar' } });
    expect(getInputInstance(input).value).toEqual('foobar');
  });

  it('withFormsy: should only set the value and not validate when calling setValue(val, false)', () => {
    const Input = withFormsy(
      class NoValidateInput extends React.Component<FormsyInputProps> {
        updateValue = (event) => {
          this.props.setValue(event.target.value, false);
        };

        render() {
          return <input type="text" value={this.props.value || ''} onChange={this.updateValue} />;
        }
      },
    );
    const form = mount(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );
    const inputComponent = form.find('Formsy(NoValidateInput)');
    const setStateSpy = jest.spyOn(getWrapperInstance(inputComponent) as any, 'setState');
    const inputElement = form.find('input');

    expect(setStateSpy).not.toHaveBeenCalled();
    inputElement.simulate('change', { target: { value: 'foobar' } });
    expect(setStateSpy).toHaveBeenCalledTimes(1);
    expect(setStateSpy).toHaveBeenCalledWith({ value: 'foobar' });
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
    expect(getInputInstance(input).value).toEqual('foo');
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
      componentDidUpdate() {
        isValid = this.props.isValid;
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
      componentDidMount() {
        isRequireds.push(this.props.isRequired);
      },
    });
    mount(
      <Formsy action="/users">
        <Input name="foo" value="" />
        <Input name="foo" value="" required  />
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
      componentDidMount() {
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
    const Input = InputFactory({});
    const form = mount(
      <Formsy action="/users">
        <Input name="A" value="foo" />
      </Formsy>,
    );

    expect(getFormInstance(form).inputs[0].isPristine()).toEqual(true);
    const input = form.find('input');
    input.simulate('change', { target: { value: 'foo' } });
    expect(getFormInstance(form).inputs[0].isPristine()).toEqual(false);
  });

  it('should allow an undefined value to be updated to a value', () => {
    class TestForm extends React.Component<{}, { value?: string }> {
      constructor(props) {
        super(props);
        this.state = {
          value: undefined,
        };
      }

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

    const form = mount<TestForm>(<TestForm />);

    form.instance().changeValue();
    const input = form.find('input');
    immediate(() => {
      expect(getInputInstance(input).value).toEqual('foo');
    });
  });

  it('should be able to test a values validity', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" validations="isEmail" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).isValidValue('foo@bar.com')).toEqual(true);
    expect(getWrapperInstance(input).isValidValue('foo@bar')).toEqual(false);
  });

  it('should be able to use an object as validations property', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).isValidValue('foo@bar.com')).toEqual(true);
    expect(getWrapperInstance(input).isValidValue('foo@bar')).toEqual(false);
  });

  it('should be able to pass complex values to a validation rule', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).isValid()).toEqual(true);
    const input = form.find('input');
    input.simulate('change', { target: { value: 'bar' } });
    expect(getWrapperInstance(inputComponent).isValid()).toEqual(false);
  });

  it('should be able to run a function to validate', () => {
    const customValidationA = (_values, value) => {
      return value === 'foo';
    };

    const customValidationB = (values, value) => {
      return value === 'foo' && values.A === 'foo';
    };

    function TestForm() {
      return (
        <Formsy>
          <TestInput
            name="A"
            validations={{
              custom: customValidationA,
            }}
            value="foo"
          />
          <TestInput
            name="B"
            validations={{
              custom: customValidationB,
            }}
            value="foo"
          />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent.at(0)).isValid()).toEqual(true);
    expect(getWrapperInstance(inputComponent.at(1)).isValid()).toEqual(true);
    const input = form.find('input');
    input.at(0).simulate('change', { target: { value: 'bar' } });
    expect(getWrapperInstance(inputComponent.at(0)).isValid()).toEqual(false);
    expect(getWrapperInstance(inputComponent.at(1)).isValid()).toEqual(false);
  });

  it('should not override error messages with error messages passed by form if passed error messages is an empty object', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('bar3');
  });

  it('should handle multiple validation error messages passed from validators', () => {
    function customValidationA() {
      return 'error message one';
    }

    function customValidationB() {
      return 'error message two';
    }

    function TestForm() {
      return (
        <Formsy>
          <TestInput
            name="A"
            validations={{
              customValidationA,
              customValidationB,
            }}
            value="foo"
          />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const inputComponent = form.find('Formsy(TestInput)');

    const formEl = form.find('form');
    formEl.simulate('submit');

    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('error message one');
    expect(getWrapperInstance(inputComponent).getErrorMessages()).toEqual(['error message one', 'error message two']);
  });

  it('should override all error messages with error messages passed by form', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('bar');
  });

  it('should override validation rules with required rules', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('bar3');
  });

  it('should fall back to default error message when non exist in validationErrors map', () => {
    function TestForm() {
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

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('bar1');
  });

  it('should not be valid if it is required and required rule is true', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" required />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).isValid()).toEqual(false);
  });

  it('should return the validationError if the field is invalid and required rule is true', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" validationError="Field is required" required />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const inputComponent = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputComponent).isValid()).toEqual(false);
    expect(getWrapperInstance(inputComponent).getErrorMessage()).toEqual('Field is required');
  });

  it('should handle objects and arrays as values', () => {
    class TestForm extends React.Component<{}, { foo: { [key: string]: string }; bar: string[] }> {
      constructor(props) {
        super(props);
        this.state = {
          foo: { foo: 'bar' },
          bar: ['foo'],
        };
      }

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

    const inputs = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(inputs.at(0)).getValue()).toEqual({ foo: 'foo' });
    expect(getWrapperInstance(inputs.at(1)).getValue()).toEqual(['bar']);
  });

  it('should handle isFormDisabled with dynamic inputs', () => {
    class TestForm extends React.Component<{}, { bool: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          bool: true,
        };
      }

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

    const form = mount<TestForm>(<TestForm />);

    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).isFormDisabled()).toEqual(true);
    form.instance().flip();
    expect(getWrapperInstance(input).isFormDisabled()).toEqual(false);
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

    // TODO: Beef up this smoke test
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

    // TODO: Beef up this smoke test
    expect(true).toBe(true);

    const formEl = form.find('form');
    formEl.simulate('submit');
  });

  it('input should rendered once with PureRenderMixin', () => {
    const renderSpy = jest.fn();

    const Input = InputFactory({
      shouldComponentUpdate() {
        return false;
      },

      render() {
        renderSpy();
        return <input type={this.props.type} value={this.props.value} onChange={this.updateValue} />;
      },
    });

    mount(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('input should call shouldComponentUpdate with correct value', () => {
    const renderSpy = jest.fn();

    const Input = InputFactory({
      shouldComponentUpdate(prevProps) {
        return prevProps.value !== this.props.value;
      },

      render() {
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

    expect(renderSpy).toHaveBeenCalledTimes(1);

    input.simulate('change', { target: { value: 'fooz' } });
    expect(getInputInstance(input).value).toEqual('fooz');
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('unregisters on unmount', () => {
    const TestComponent = ({ hasInput }) => <Formsy>{hasInput ? <TestInput name="foo" value="foo" /> : null}</Formsy>;

    const wrapper = mount(<TestComponent hasInput />);
    const formsy = getFormInstance(wrapper.find(Formsy));

    expect(formsy.inputs).toHaveLength(1);

    wrapper.setProps({ hasInput: false });

    expect(formsy.inputs).toHaveLength(0);
  });
});
