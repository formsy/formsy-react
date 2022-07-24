import { fireEvent, render } from '@testing-library/react';
import React, { useState } from 'react';
import TestInput, { FormsyInputProps, InputFactory } from '../__test_utils__/TestInput';

import Formsy, { withFormsy } from '../src';

describe('Element', () => {
  it('should pass down correct value prop after using setValue()', () => {
    const screen = render(
      <Formsy>
        <TestInput name="foo" value="foo" testId="test-input" />
      </Formsy>,
    );

    const input = screen.getByTestId('test-input') as HTMLInputElement;
    expect(input.value).toEqual('foo');

    fireEvent.change(input, { target: { value: 'foobar' } });
    expect(input.value).toEqual('foobar');
  });

  it('withFormsy: should only set the value and not validate when calling setValue(val, false)', () => {
    const Input = withFormsy(
      class NoValidateInput extends React.Component<FormsyInputProps> {
        updateValue = (event) => {
          this.props.setValue(event.target.value, false); // disables validation
        };

        render() {
          return (
            <input
              type="text"
              value={this.props.value || ''}
              onChange={this.updateValue}
              data-isvalid={this.props.isValid}
              data-testid="test-input"
            />
          );
        }
      },
    );

    const screen = render(
      <Formsy>
        <Input name="foo" value="foo" required={true} />
      </Formsy>,
    );

    const inputElement = screen.getByTestId('test-input') as HTMLInputElement;

    expect(inputElement.dataset.isvalid).toEqual('true');

    fireEvent.change(inputElement, { target: { value: '' } });

    expect(inputElement.value).toEqual(''); // new value set
    expect(inputElement.dataset.isvalid).toEqual('true'); // validation not changed;
  });

  it('should set back to pristine value when running reset', () => {
    let reset = null;
    const Input = InputFactory({
      componentDidUpdate() {
        reset = this.props.resetValue;
      },
    });
    const screen = render(
      <Formsy>
        <Input name="foo" value="foo" testId="test-input" />
      </Formsy>,
    );

    const input = screen.getByTestId('test-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'foobar' } });
    reset();
    expect(input.value).toEqual('foo');
  });

  it('should return error message passed when calling getErrorMessage()', () => {
    let errorMessage;
    const Input = InputFactory({
      componentDidUpdate() {
        errorMessage = this.props.errorMessage;
      },
    });

    render(
      <Formsy>
        <Input name="foo" value="foo" validations="isEmail" validationError="Has to be email" />
      </Formsy>,
    );

    expect(errorMessage).toEqual('Has to be email');
  });

  it('should return true or false when calling isRequired() depending on passed required attribute', () => {
    const isRequires = [];
    const Input = InputFactory({
      componentDidMount() {
        isRequires.push(this.props.isRequired);
      },
    });
    render(
      <Formsy action="/users">
        <Input name="foo" value="" />
        <Input name="foo" value="" required />
        <Input name="foo" value="foo" required="isLength:3" />
      </Formsy>,
    );

    expect(isRequires[0]).toEqual(false);
    expect(isRequires[1]).toEqual(true);
    expect(isRequires[2]).toEqual(true);
  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', () => {
    const showRequires = [];
    const Input = InputFactory({
      componentDidMount() {
        showRequires.push(this.props.showRequired);
      },
    });
    render(
      <Formsy action="/users">
        <Input name="A" value="foo" />
        <Input name="B" value="" required />
        <Input name="C" value="" />
      </Formsy>,
    );

    expect(showRequires[0]).toEqual(false);
    expect(showRequires[1]).toEqual(true);
    expect(showRequires[2]).toEqual(false);
  });

  it('should return true or false when calling isPristine() depending on input has been "touched" or not', () => {
    const Input = InputFactory({});
    const screen = render(
      <Formsy action="/users">
        <Input name="A" value="foo" testId="test-input" />
      </Formsy>,
    );

    const input = screen.getByTestId('test-input');
    expect(input.dataset.isPristine).toEqual('true');

    fireEvent.change(input, { target: { value: 'foobar' } });

    expect(input.dataset.isPristine).toEqual('false');
  });

  it('should allow an undefined value to be updated to a value', () => {
    const newValue = 'foo';

    class TestForm extends React.Component<{}, { value?: string }> {
      constructor(props) {
        super(props);
        this.state = {
          value: undefined,
        };
      }

      changeValue = () => {
        this.setState({
          value: newValue,
        });
      };

      render() {
        return (
          <Formsy action="/users">
            <TestInput name="A" value={this.state.value} testId="test-input" />
            <button onClick={this.changeValue} data-testid="btn">
              change value
            </button>
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const btn = screen.getByTestId('btn');
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    expect(input.value).toEqual('');

    fireEvent.click(btn);

    expect(input.value).toEqual(newValue);
  });

  it('should be able to test a values validity', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" validations="isEmail" testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    fireEvent.change(input, { target: { value: 'foo@bar.com' } });
    expect(input.dataset.isValid).toEqual('true');
    fireEvent.change(input, { target: { value: 'foo@bar' } });
    expect(input.dataset.isValid).toEqual('false');
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    fireEvent.change(input, { target: { value: 'foo@bar.com' } });
    expect(input.dataset.isValid).toEqual('true');
    fireEvent.change(input, { target: { value: 'foo@bar' } });
    expect(input.dataset.isValid).toEqual('false');
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    fireEvent.change(input, { target: { value: 'foo' } });
    expect(input.dataset.isValid).toEqual('true');
    fireEvent.change(input, { target: { value: 'bar' } });
    expect(input.dataset.isValid).toEqual('false');
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
            testId="text-input-1"
          />
          <TestInput
            name="B"
            validations={{
              custom: customValidationB,
            }}
            value="foo"
            testId="text-input-2"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);

    const input1 = screen.getByTestId('text-input-1');
    const input2 = screen.getByTestId('text-input-2');

    expect(input1.dataset.isValid).toEqual('true');
    expect(input2.dataset.isValid).toEqual('true');

    fireEvent.change(input1, { target: { value: 'bar' } });

    expect(input1.dataset.isValid).toEqual('false');
    expect(input2.dataset.isValid).toEqual('false');
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    expect(input.dataset.errorMessage).toEqual('bar3');
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
        <Formsy data-testid="form">
          <TestInput
            name="A"
            validations={{
              customValidationA,
              customValidationB,
            }}
            value="foo"
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(input.dataset.errorMessage).toEqual('error message one');
    expect(input.dataset.errorMessages.split(';')).toEqual(['error message one', 'error message two']);
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);

    const input = screen.getByTestId('test-input');
    expect(input.dataset.errorMessage).toEqual('bar');
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    expect(input.dataset.errorMessage).toEqual('bar3');
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
            testId="test-input"
          />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');

    expect(input.dataset.errorMessage).toEqual('bar1');
  });

  it('should not be valid if it is required and required rule is true', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" required testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);

    const input = screen.getByTestId('test-input');
    expect(input.dataset.isValid).toEqual('false');
  });

  it('should return the validationError if the field is invalid and required rule is true', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="A" validationError="Field is required" required testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);

    const input = screen.getByTestId('test-input');
    expect(input.dataset.isValid).toEqual('false');
    expect(input.dataset.errorMessage).toEqual('Field is required');
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

      changeData = () => {
        this.setState({
          foo: { foo: 'foo' },
          bar: ['bar'],
        });
      };

      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={this.state.foo} testId="test-input1" />
            <TestInput name="bar" value={this.state.bar} testId="test-input2" />
            <button type="button" data-testid="btn" onClick={this.changeData} />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input1 = screen.getByTestId('test-input1') as HTMLInputElement;
    const input2 = screen.getByTestId('test-input2') as HTMLInputElement;
    const btn = screen.getByTestId('btn');

    fireEvent.click(btn);

    expect(JSON.parse(input1.dataset.value)).toEqual({ foo: 'foo' });
    expect(JSON.parse(input2.dataset.value)).toEqual(['bar']);
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
            <TestInput name="foo" testId="test-input" />
            <button type="button" data-testid="btn" onClick={this.flip} />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');
    const btn = screen.getByTestId('btn');

    expect(input.dataset.isFormDisabled).toEqual('true');
    fireEvent.click(btn);
    expect(input.dataset.isFormDisabled).toEqual('false');
  });

  it('should allow for dot notation in name which maps to a deep object', () => {
    const spy = jest.fn();

    class TestForm extends React.Component {
      onSubmit(model) {
        spy(model);
      }

      render() {
        return (
          <Formsy onSubmit={this.onSubmit} data-testid="form">
            <TestInput name="foo.bar" value="foo" />
            <TestInput name="foo.test" value="test" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(spy).toHaveBeenCalledWith({ foo: { bar: 'foo', test: 'test' } });
  });

  it('should allow for application/x-www-form-urlencoded syntax and convert to object', () => {
    const spy = jest.fn();

    class TestForm extends React.Component {
      onSubmit(model) {
        spy(model);
      }

      render() {
        return (
          <Formsy onSubmit={this.onSubmit} data-testid="form">
            <TestInput name="foo[0]" value="foo" />
            <TestInput name="foo[1]" value="bar" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(spy).toHaveBeenCalledWith({ foo: ['foo', 'bar'] });
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

    render(
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
        return (
          <input type={this.props.type} value={this.props.value} onChange={this.updateValue} data-testid="test-input" />
        );
      },
    });

    const screen = render(
      <Formsy>
        <Input name="foo" value="foo" />
      </Formsy>,
    );
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    expect(renderSpy).toHaveBeenCalledTimes(1);

    const value = 'fooz';
    fireEvent.change(input, { target: { value } });

    expect(input.value).toEqual(value);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('unregisters on unmount', () => {
    const submitSpy = jest.fn();

    const TestComponent = () => {
      const [hasInput, setInput] = useState(true);
      return (
        <Formsy onSubmit={(model) => submitSpy(model)} data-testid="form">
          {hasInput ? <TestInput name="foo" value="foo" /> : null}
          <button type="button" data-testid="btn" onClick={() => setInput(false)} />
        </Formsy>
      );
    };

    const screen = render(<TestComponent />);
    const form = screen.getByTestId('form');
    const btn = screen.getByTestId('btn');

    fireEvent.submit(form);
    expect(submitSpy).toHaveBeenCalledWith({ foo: 'foo' });

    fireEvent.click(btn);

    fireEvent.submit(form);
    expect(submitSpy).toHaveBeenCalledWith({});
  });
});
