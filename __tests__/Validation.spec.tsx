import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { InputFactory } from '../__test_utils__/TestInput';

import Formsy, { withFormsy } from '../src';
import { PassDownProps } from '../src/withFormsy';

type MyTestProps = { type?: string; testId?: string };

class MyTest extends React.Component<MyTestProps & PassDownProps<string>> {
  public static defaultProps = { type: 'text' };

  handleChange = (event) => {
    const { setValue } = this.props;
    setValue(event.target.value);
  };

  render() {
    const { type, value, testId, errorMessage, isValid } = this.props;
    return (
      <input
        type={type}
        value={value || ''}
        onChange={this.handleChange}
        data-is-valid={isValid}
        data-error-message={errorMessage}
        data-testid={testId}
      />
    );
  }
}

const FormsyTest = withFormsy<MyTestProps, string>(MyTest);

describe('Validation', () => {
  it('should reset only changed form element when external error is passed', () => {
    const screen = render(
      <Formsy onSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar', bar: 'foo' })} data-testid="form">
        <FormsyTest name="foo" testId="test-input1" />
        <FormsyTest name="bar" testId="test-input2" />
      </Formsy>,
    );

    const form = screen.getByTestId('form');
    const input1 = screen.getByTestId('test-input1');
    const input2 = screen.getByTestId('test-input2');

    fireEvent.submit(form);

    expect(input1.dataset.isValid).toEqual('false');
    expect(input2.dataset.isValid).toEqual('false');

    fireEvent.change(input1, { target: { value: 'bar' } });

    expect(input1.dataset.isValid).toEqual('true');
  });

  it('should let normal validation take over when component with external error is changed', () => {
    const screen = render(
      <Formsy onSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })} data-testid="form">
        <FormsyTest name="foo" validations="isEmail" testId="test-input" />
      </Formsy>,
    );

    const form = screen.getByTestId('form');
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    fireEvent.submit(form);
    expect(input.dataset.isValid).toEqual('false');

    fireEvent.change(input, { target: { value: 'bar' } });

    expect(input.value).toEqual('bar');
    expect(input.dataset.isValid).toEqual('false');
  });

  it('should trigger an onValid handler, if passed, when form is valid', () => {
    const onValid = jest.fn();
    const onInvalid = jest.fn();

    render(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" value="bar" required />
      </Formsy>,
    );

    expect(onValid).toHaveBeenCalled();
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it('should trigger an onInvalid handler, if passed, when form is invalid', () => {
    const onValid = jest.fn();
    const onInvalid = jest.fn();

    render(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" required />
      </Formsy>,
    );

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
  });

  it('should trigger the `onInvalid` handler if a required element receives `null` as the value', () => {
    const onValid = jest.fn();
    const onInvalid = jest.fn();

    render(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest value={null} name="foo" required />
      </Formsy>,
    );

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
  });

  it('should be able to use provided validate function', () => {
    let isValid = false;
    const CustomInput = InputFactory({
      componentDidMount() {
        isValid = this.props.isValid;
      },
    });

    render(
      <Formsy>
        <CustomInput name="foo" value="foo" required />
      </Formsy>,
    );

    expect(isValid).toEqual(true);
  });

  it('should provide invalidate callback on onValidSubmit', () => {
    function TestForm() {
      return (
        <Formsy onValidSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })} data-testid="form">
          <FormsyTest name="foo" value="foo" testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);

    const form = screen.getByTestId('form');
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    fireEvent.submit(form);

    expect(input.dataset.isValid).toEqual('false');
  });

  it('should provide invalidate callback on onInvalidSubmit', () => {
    function TestForm() {
      return (
        <Formsy onInvalidSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })} data-testid="form">
          <FormsyTest name="foo" value="foo" validations="isEmail" testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    fireEvent.submit(form);

    expect(input.dataset.errorMessage).toEqual('bar');
  });

  it('should not invalidate inputs on external errors with preventExternalInvalidation prop', () => {
    function TestForm() {
      return (
        <Formsy
          preventExternalInvalidation
          onSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })}
          data-testid="form"
        >
          <FormsyTest name="foo" value="foo" testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    fireEvent.submit(form);

    expect(input.dataset.isValid).toEqual('true');
  });

  it('should invalidate inputs on external errors without preventExternalInvalidation prop', () => {
    function TestForm() {
      return (
        <Formsy onSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })} data-testid="form">
          <FormsyTest name="foo" value="foo" testId="test-input" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    fireEvent.submit(form);

    expect(input.dataset.isValid).toEqual('false');
  });

  it('should throw errors on invalid validation string', () => {
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation(() => {
      // do nothing
    });

    function TestForm() {
      return (
        <Formsy onInvalidSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="foo" value="foo" validations="isLength:3:7" />
        </Formsy>
      );
    }

    expect(() => render(<TestForm />)).toThrow(
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
        <Formsy onInvalidSubmit={(_model, _reset, invalidate) => invalidate({ foo: 'bar' })}>
          <FormsyTest name="" value="foo" />
        </Formsy>
      );
    }

    expect(() => render(<TestForm />)).toThrow('Form Input requires a name property when used');

    mockConsoleError.mockRestore();
  });
});
