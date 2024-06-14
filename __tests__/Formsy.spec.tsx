/* eslint-disable max-classes-per-file, react/destructuring-assignment */
import { createEvent, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { useRef, useState } from 'react';

import DynamicInputForm from '../__test_utils__/DynamicInputForm';
import TestInput from '../__test_utils__/TestInput';
import TestInputHoc from '../__test_utils__/TestInputHoc';
import Formsy, { addValidationRule } from '../src';
import { ValidationError } from '../src/interfaces';

describe('Setting up a form', () => {
  it('should expose the users DOM node through an innerRef prop', () => {
    const refSpy = jest.fn();

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInputHoc
              name="name"
              innerRef={(ref: any) => {
                if (!ref) {
                  return;
                }

                refSpy(ref.constructor.name);
              }}
              testId="test-input"
            />
          </Formsy>
        );
      }
    }

    render(<TestForm />);

    expect(refSpy).toHaveBeenCalledWith('TestComponent');
  });

  it('should render a form into the document', () => {
    const screen = render(<Formsy data-testid="form" />);
    const form = screen.getByTestId('form') as HTMLFormElement;

    expect(form.tagName.toLowerCase()).toEqual('form');
  });

  it('should set a class name if passed', () => {
    const screen = render(<Formsy data-testid="form" className="foo" />);
    const form = screen.getByTestId('form') as HTMLFormElement;

    expect(form.classList.contains('foo')).toBe(true);
  });

  it('should allow for null/undefined children', () => {
    const submitSpy = jest.fn();

    function TestForm() {
      return (
        <Formsy onSubmit={(formModel) => submitSpy(formModel)} data-testid="form">
          <h1>Test</h1>
          {null}
          {undefined}
          <TestInput name="name" value="foo" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledWith({ name: 'foo' });
  });

  it('should allow for inputs being added dynamically', () => {
    const submitSpy = jest.fn();

    const screen = render(<DynamicInputForm onSubmit={(formModel) => submitSpy(formModel)} inputName="test" />);
    const form = screen.getByTestId('form');
    const addInputBtn = screen.getByTestId('add-input-btn');

    fireEvent.click(addInputBtn);
    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledWith({ test: '' });
  });

  it('should allow dynamically added inputs to update the form-model', () => {
    const submitSpy = jest.fn();

    const screen = render(<DynamicInputForm onSubmit={(formModel) => submitSpy(formModel)} inputName="test" />);
    const form = screen.getByTestId('form');
    const addInputBtn = screen.getByTestId('add-input-btn');

    fireEvent.click(addInputBtn);

    fireEvent.change(screen.getByTestId('test-input'), {
      target: { value: 'foo' },
    });

    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledWith({ test: 'foo' });
  });

  it('should allow a dynamically updated input to update the form-model', () => {
    const submitSpy = jest.fn();

    class TestForm extends React.Component<{ inputValue: any }, { inputValue: any }> {
      constructor(props) {
        super(props);
        this.state = { inputValue: props.inputValue };
      }

      updateInputValue = () => this.setState({ inputValue: 'bar' });

      render() {
        const { inputValue } = this.state;
        return (
          <Formsy onSubmit={(formModel) => submitSpy(formModel)} data-testid="form">
            <TestInput name="test" value={inputValue} testId="test-input" />
            <button type="button" onClick={this.updateInputValue} data-testid="update-btn">
              Update
            </button>
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm inputValue="foo" />);
    const form = screen.getByTestId('form');
    const updateBtn = screen.getByTestId('update-btn');

    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledWith({ test: 'foo' });

    fireEvent.click(updateBtn);
    fireEvent.submit(form);

    expect(submitSpy).toHaveBeenCalledWith({ test: 'bar' });
  });
});

describe('mapModel', () => {
  it('should honor mapModel transformations', () => {
    const mapping = jest.fn((model) => ({
      ...model,
      testChange: true,
    }));
    const onSubmit = jest.fn();

    function TestForm() {
      return (
        <Formsy mapping={mapping} onSubmit={onSubmit} data-testid="form">
          <TestInput name="parent.child" value="test" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(mapping).toHaveBeenCalledWith({ 'parent.child': 'test' });
    expect(onSubmit).toHaveBeenCalledWith(
      { 'parent.child': 'test', testChange: true },
      expect.any(Function),
      expect.any(Function),
      expect.any(Object),
    );
  });
});

describe('validations', () => {
  it('should run when the input changes', () => {
    const runRule = jest.fn();
    const notRunRule = jest.fn();

    addValidationRule('runRule', runRule);
    addValidationRule('notRunRule', notRunRule);

    const screen = render(
      <Formsy>
        <TestInput name="one" validations="runRule" value="foo" testId="test-input" />
      </Formsy>,
    );

    const input = screen.getByTestId('test-input');
    fireEvent.change(input, {
      target: { value: 'bar' },
    });

    expect(runRule).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
    expect(notRunRule).not.toHaveBeenCalled();
  });

  it('should allow the validation to be changed', () => {
    const ruleA = jest.fn();
    const ruleB = jest.fn();
    addValidationRule('ruleA', ruleA);
    addValidationRule('ruleB', ruleB);

    class TestForm extends React.Component<{}, { rule: string }> {
      constructor(props) {
        super(props);
        this.state = { rule: 'ruleA' };
      }

      changeRule = () => {
        this.setState({
          rule: 'ruleB',
        });
      };

      render() {
        return (
          <Formsy>
            <TestInput name="one" validations={this.state.rule} value="foo" testId="test-input" />
            <button type="button" onClick={this.changeRule} data-testid="change-rule-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const changeRuleBtn = screen.getByTestId('change-rule-btn');
    const input = screen.getByTestId('test-input');

    fireEvent.click(changeRuleBtn);

    fireEvent.change(input, {
      target: { value: 'bar' },
    });

    expect(ruleB).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
  });

  it('should invalidate a form if dynamically inserted input is invalid', () => {
    const isInValidSpy = jest.fn();
    const isValidSpy = jest.fn();

    class TestForm extends React.Component<{}, { showSecondInput: boolean }> {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = { showSecondInput: false };
      }

      addInput = () => {
        this.setState({
          showSecondInput: true,
        });
      };

      render() {
        return (
          <Formsy ref={this.formRef} onInvalid={isInValidSpy} onValid={isValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
            <button type="button" onClick={this.addInput} data-testid="add-input-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const addInputBtn = screen.getByTestId('add-input-btn');

    expect(isValidSpy).toHaveBeenCalled();

    fireEvent.click(addInputBtn);

    expect(isInValidSpy).toHaveBeenCalled();
  });

  it('should validate a form when removing an invalid input', () => {
    const isValidSpy = jest.fn();
    const isInValidSpy = jest.fn();

    class TestForm extends React.Component<{}, { showSecondInput: boolean }> {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = { showSecondInput: true };
      }

      removeInput = () => {
        this.setState({
          showSecondInput: false,
        });
      };

      render() {
        return (
          <Formsy ref={this.formRef} onValid={isValidSpy} onInvalid={isInValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
            <button type="button" onClick={this.removeInput} data-testid="remove-input-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const removeInputBtn = screen.getByTestId('remove-input-btn');

    expect(isInValidSpy).toHaveBeenCalled();

    fireEvent.click(removeInputBtn);

    expect(isValidSpy).toHaveBeenCalled();
  });

  it('runs multiple validations', () => {
    const ruleA = jest.fn();
    const ruleB = jest.fn();
    addValidationRule('ruleA', ruleA);
    addValidationRule('ruleB', ruleB);

    const screen = render(
      <Formsy>
        <TestInput name="one" validations="ruleA,ruleB" value="foo" testId="test-input" />
      </Formsy>,
    );

    const input = screen.getByTestId('test-input');

    fireEvent.change(input, { target: { value: 'bar' } });

    expect(ruleA).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
    expect(ruleB).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
  });
});

describe('onChange', () => {
  it('should not trigger onChange when form is mounted', () => {
    const hasChanged = jest.fn();

    function TestForm() {
      return <Formsy onChange={hasChanged} data-testid="form" />;
    }

    render(<TestForm />);
    expect(hasChanged).not.toHaveBeenCalled();
  });

  it('should trigger onChange once when form element is changed', () => {
    const hasChanged = jest.fn();
    const screen = render(
      <Formsy onChange={hasChanged}>
        <TestInput name="foo" value="" testId="test-input" />
      </Formsy>,
    );

    fireEvent.change(screen.getByTestId('test-input'), { target: { value: 'bar' } });

    expect(hasChanged).toHaveBeenCalledTimes(1);
  });

  it('should trigger onChange once when new input is added to form', () => {
    const hasChanged = jest.fn();

    class TestForm extends React.Component<{}, { showInput: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          showInput: false,
        };
      }

      showInput = () => {
        this.setState({
          showInput: true,
        });
      };

      render() {
        return (
          <Formsy onChange={hasChanged}>
            {this.state.showInput ? <TestInput name="test" /> : null}
            <button type="button" onClick={this.showInput} data-testid="show-input-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const showInputBtn = screen.getByTestId('show-input-btn');

    fireEvent.click(showInputBtn);

    expect(hasChanged).toHaveBeenCalledTimes(1);
  });

  it('onChange should honor dot notation transformations', () => {
    const hasChanged = jest.fn();

    class TestForm extends React.Component<{}, { showInput: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          showInput: false,
        };
      }

      showInput = () => {
        this.setState({
          showInput: true,
        });
      };

      render() {
        return (
          <Formsy onChange={hasChanged}>
            {this.state.showInput ? <TestInput name="parent.child" value="test" /> : null}
            <button type="button" onClick={this.showInput} data-testid="show-input-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const showInputBtn = screen.getByTestId('show-input-btn');

    fireEvent.click(showInputBtn);

    expect(hasChanged).toHaveBeenCalledWith({ parent: { child: 'test' } }, false);
  });
});

describe('Update a form', () => {
  it('should allow elements to check if the form is disabled', () => {
    class TestForm extends React.Component<{}, { disabled: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          disabled: true,
        };
      }

      enableForm = () => {
        this.setState({ disabled: false });
      };

      render() {
        return (
          <Formsy disabled={this.state.disabled}>
            <TestInput name="foo" testId="test-input" />
            <button type="button" onClick={this.enableForm} data-testid="enable-form-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');
    const enableFormBtn = screen.getByTestId('enable-form-btn');

    expect(input.dataset.isFormDisabled).toEqual('true');

    fireEvent.click(enableFormBtn);

    expect(input.dataset.isFormDisabled).toEqual('false');
  });

  it('should be possible to pass error state of elements by changing an errors attribute', () => {
    class TestForm extends React.Component<
      {},
      { validationErrors: { [key: string]: React.ReactNode }; value: string }
    > {
      constructor(props) {
        super(props);
        this.state = {
          validationErrors: { foo: 'bar' },
          value: '',
        };
      }

      onChange = (values) => {
        this.setState(values.foo ? { validationErrors: {} } : { validationErrors: { foo: 'bar' } });
      };

      changeValue = () => {
        this.setState({ value: 'new value' });
      };

      render() {
        return (
          <Formsy onChange={this.onChange} validationErrors={this.state.validationErrors}>
            <TestInput name="foo" value={this.state.value} testId="test-input" />
            <button type="button" onClick={this.changeValue} data-testid="change-value-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');
    const changeValueBtn = screen.getByTestId('change-value-btn');
    expect(input.dataset.errorMessage).toEqual('bar');

    fireEvent.click(changeValueBtn);

    expect(input.dataset.errorMessage).toEqual(undefined);
  });

  it('should prevent a default submit', () => {
    function TestForm() {
      return (
        <Formsy data-testid="form">
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    const event = createEvent.submit(form);
    event.preventDefault = jest.fn();

    fireEvent(form, event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent a default submit when preventDefaultSubmit is passed', () => {
    function TestForm() {
      return (
        <Formsy data-testid="form" preventDefaultSubmit={false}>
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    const event = createEvent.submit(form);
    event.preventDefault = jest.fn();

    fireEvent(form, event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should trigger an onValidSubmit when submitting a valid form', () => {
    const isCalled = jest.fn();

    function TestForm() {
      return (
        <Formsy onValidSubmit={isCalled} data-testid="form">
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(isCalled).toHaveBeenCalled();
  });

  it('should trigger an onInvalidSubmit when submitting an invalid form', () => {
    const isCalled = jest.fn();

    function TestForm() {
      return (
        <Formsy onInvalidSubmit={isCalled} data-testid="form">
          <TestInput name="foo" validations="isEmail" value="foo@bar" />
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(isCalled).toHaveBeenCalled();
  });
});

describe('value === false', () => {
  it('should call onSubmit correctly', () => {
    const onSubmit = jest.fn();

    function TestForm() {
      return (
        <Formsy onSubmit={onSubmit} data-testid="form">
          <TestInput name="foo" value={false} type="checkbox" />
          <button type="submit">Save</button>
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      { foo: false },
      expect.any(Function),
      expect.any(Function),
      expect.any(Object),
    );
  });

  it('should allow dynamic changes to false', () => {
    const onSubmit = jest.fn();

    class TestForm extends React.Component<{}, { value: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          value: true,
        };
      }

      changeValue = () => {
        this.setState({
          value: false,
        });
      };

      render() {
        return (
          <Formsy onSubmit={onSubmit} data-testid="form">
            <TestInput name="foo" value={this.state.value} type="checkbox" />
            <button type="button" data-testid="change-value-btn" onClick={this.changeValue}>
              Save
            </button>
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    const changeValueBtn = screen.getByTestId('change-value-btn');

    fireEvent.click(changeValueBtn);
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      { foo: false },
      expect.any(Function),
      expect.any(Function),
      expect.any(Object),
    );
  });

  it('should say the form is submitted', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="foo" value type="checkbox" testId="test-input" />
          <button type="submit" data-testid="submit-btn">
            Save
          </button>
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input');
    const submitBtn = screen.getByTestId('submit-btn');

    expect(input.dataset.isFormSubmitted).toEqual('false');

    fireEvent.click(submitBtn);

    expect(input.dataset.isFormSubmitted).toEqual('true');
  });

  it('should be able to reset the form to its pristine state', () => {
    class TestForm extends React.Component<{}, { value: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          value: true,
        };
      }

      changeValue = () => {
        this.setState({
          value: false,
        });
      };

      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={this.state.value} type="checkbox" testId="test-input" />
            <button type="button" onClick={this.changeValue} data-testid="change-value-btn">
              Change value
            </button>
            <button type="reset" data-testid="reset-btn">
              Rest value
            </button>
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    const changeValueBtn = screen.getByTestId('change-value-btn');
    const resetBtn = screen.getByTestId('reset-btn');

    expect(input.dataset.value).toEqual('true');

    fireEvent.click(changeValueBtn);

    expect(input.dataset.value).toEqual('false');

    fireEvent.click(resetBtn);

    expect(input.dataset.value).toEqual('true');
  });

  it('should be able to set a value to components with updateInputsWithValue', () => {
    class TestForm extends React.Component<{}, { valueFoo: boolean; valueBar: boolean }> {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = {
          valueBar: true,
          valueFoo: true,
        };
      }

      updateInputsWithValue = () => {
        this.formRef.current.updateInputsWithValue({ foo: false });
      };

      render() {
        return (
          <Formsy ref={this.formRef}>
            <TestInput name="foo" value={this.state.valueFoo} type="checkbox" testId="test-input1" />
            <TestInput name="bar" value={this.state.valueBar} type="checkbox" testId="test-input2" />
            <button type="button" onClick={this.updateInputsWithValue} data-testid="update-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input1 = screen.getByTestId('test-input1');
    const input2 = screen.getByTestId('test-input2');
    const updateBtn = screen.getByTestId('update-btn');

    expect(input1.dataset.value).toEqual('true');
    expect(input2.dataset.value).toEqual('true');

    fireEvent.click(updateBtn);

    expect(input1.dataset.value).toEqual('false');
    expect(input2.dataset.value).toEqual('true');
  });

  it('should be able to set a deep value with updateInputsWithValue', () => {
    class TestForm extends React.Component<
      {},
      {
        valueBar: number;
        valueFoo: { valueBar: number };
      }
    > {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = {
          valueFoo: { valueBar: 1 },
          valueBar: 2,
        };
      }

      updateInputsWithValue = () => {
        this.formRef.current.updateInputsWithValue({ foo: { bar: 3 }, bar: 4 });
      };

      render() {
        return (
          <Formsy ref={this.formRef}>
            <TestInput name="foo.bar" value={this.state.valueFoo.valueBar} testId="test-input1" />
            <TestInput name="bar" value={this.state.valueBar} testId="test-input2" />
            <button type="button" onClick={this.updateInputsWithValue} data-testid="update-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input1 = screen.getByTestId('test-input1') as HTMLInputElement;
    const input2 = screen.getByTestId('test-input2') as HTMLInputElement;
    const updateBtn = screen.getByTestId('update-btn');

    expect(input1.value).toEqual('1');
    expect(input2.value).toEqual('2');

    fireEvent.click(updateBtn);

    expect(input1.dataset.value).toEqual('3');
    expect(input2.dataset.value).toEqual('4');
  });

  it('should be able to reset the form using custom data', () => {
    class TestForm extends React.Component<{}, { value: number; valueDeep: number }> {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = {
          value: 1,
          valueDeep: 11,
        };
      }

      changeValue = () => {
        this.setState({
          value: 2,
          valueDeep: 12,
        });
      };

      resetValues = () => {
        this.formRef.current.reset({
          foo: 3,
          bar: { foo: 13 },
        });
      };

      render() {
        const { value, valueDeep } = this.state;

        return (
          <Formsy ref={this.formRef}>
            <TestInput name="foo" value={value} testId="test-input1" />
            <TestInput name="bar.foo" value={valueDeep} testId="test-input2" />
            <button type="button" onClick={this.changeValue} data-testid="change-value-btn" />
            <button type="button" onClick={this.resetValues} data-testid="reset-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const input1 = screen.getByTestId('test-input1') as HTMLInputElement;
    const input2 = screen.getByTestId('test-input2') as HTMLInputElement;
    const updateValueBtn = screen.getByTestId('change-value-btn');
    const resetBtn = screen.getByTestId('reset-btn');

    expect(input1.value).toEqual('1');
    expect(input2.value).toEqual('11');

    fireEvent.click(updateValueBtn);

    expect(input1.value).toEqual('2');
    expect(input2.value).toEqual('12');

    fireEvent.click(resetBtn);

    expect(input1.value).toEqual('3');
    expect(input2.value).toEqual('13');
  });
});

describe('.reset()', () => {
  it('should be able to reset the form to empty values', () => {
    function TestForm() {
      const formRef = useRef<Formsy>();
      return (
        <Formsy ref={formRef}>
          <TestInput name="foo" value="42" type="checkbox" testId="test-input" />
          <button
            type="button"
            onClick={() =>
              formRef.current.reset({
                foo: '',
              })
            }
            data-testid="reset-btn"
          >
            Reset
          </button>
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    const resetBtn = screen.getByTestId('reset-btn');

    fireEvent.click(resetBtn);

    expect(input.value).toEqual('');
  });

  it('should be able to reset the form using a button', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="foo" value="foo" testId="test-input" />
          <button type="reset" data-testid="reset-btn">
            Reset
          </button>
        </Formsy>
      );
    }

    const screen = render(<TestForm />);
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    const resetBtn = screen.getByTestId('reset-btn');

    expect(input.value).toEqual('foo');

    fireEvent.change(input, { target: { value: 'foobar' } });

    expect(input.value).toEqual('foobar');

    fireEvent.click(resetBtn);

    expect(input.value).toEqual('foo');
  });
});

describe('.isChanged()', () => {
  it('initially returns false', () => {
    const hasOnChanged = jest.fn();
    const formRef = React.createRef<Formsy>();
    render(
      <Formsy onChange={hasOnChanged} ref={formRef}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );

    expect(formRef.current.isChanged()).toEqual(false);
    expect(hasOnChanged).not.toHaveBeenCalled();
  });

  it('returns true when changed', () => {
    const hasOnChanged = jest.fn();
    const screen = render(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" testId="test-input" />
      </Formsy>,
    );
    const input = screen.getByTestId('test-input');
    fireEvent.change(input, {
      target: { value: 'bar' },
    });

    expect(hasOnChanged).toHaveBeenCalledWith({ one: 'bar' }, true);
  });

  it('returns false if changes are undone', () => {
    const hasOnChanged = jest.fn();
    const screen = render(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" testId="test-input" />
      </Formsy>,
    );
    const input = screen.getByTestId('test-input');
    fireEvent.change(input, {
      target: { value: 'bar' },
    });
    expect(hasOnChanged).toHaveBeenCalledWith({ one: 'bar' }, true);

    fireEvent.change(input, {
      target: { value: 'foo' },
    });
    expect(hasOnChanged).toHaveBeenCalledWith({ one: 'foo' }, false);
  });
});

describe('form valid state', () => {
  it('should allow to be changed with updateInputsWithError', () => {
    let isValid = true;

    class TestForm extends React.Component {
      onValidSubmit = (_model, _reset, updateInputsWithError) => {
        updateInputsWithError({ foo: 'bar' }, true);
      };

      onValid = () => {
        isValid = true;
      };

      onInvalid = () => {
        isValid = false;
      };

      render() {
        return (
          <Formsy
            onInvalid={this.onInvalid}
            onValid={this.onValid}
            onValidSubmit={this.onValidSubmit}
            data-testid="form"
          >
            <TestInput name="foo" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');

    expect(isValid).toEqual(true);
    fireEvent.submit(form);

    expect(isValid).toEqual(false);
  });

  it('should throw an error when updateInputsWithError is called with a missing input', () => {
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation(() => {
      // do nothing
    });

    const errorSpy = jest.fn();

    class TestForm extends React.Component {
      onValidSubmit = (_model, _reset, updateInputsWithError) => {
        try {
          updateInputsWithError({ bar: 'bar' }, true);
        } catch (e) {
          errorSpy(e.message);
        }
      };

      public componentDidCatch(error: Error) {
        errorSpy(error);
      }

      render() {
        return (
          <Formsy onValidSubmit={this.onValidSubmit} data-testid="form">
            <TestInput name="foo" testId="test-input" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const form = screen.getByTestId('form');
    fireEvent.submit(form);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('You are trying to update an input that does not exist'),
    );
    mockConsoleError.mockRestore();
  });

  it('should be false when validationErrors is not empty', () => {
    let isValid = true;

    class TestForm extends React.Component<
      {},
      {
        validationErrors: { [key: string]: ValidationError };
      }
    > {
      constructor(props) {
        super(props);
        this.state = {
          validationErrors: {},
        };
      }

      setValidationErrors = (empty?: unknown) => {
        this.setState(!empty ? { validationErrors: { foo: 'bar' } } : { validationErrors: {} });
      };

      onValid = () => {
        isValid = true;
      };

      onInvalid = () => {
        isValid = false;
      };

      render() {
        return (
          <Formsy onInvalid={this.onInvalid} onValid={this.onValid} validationErrors={this.state.validationErrors}>
            <TestInput name="foo" />
            <button type="button" onClick={() => this.setValidationErrors()} data-testid="validation-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const validationBtn = screen.getByTestId('validation-btn');

    expect(isValid).toEqual(true);
    fireEvent.click(validationBtn);
    expect(isValid).toEqual(false);
  });

  it('should be true when validationErrors is not empty and preventExternalInvalidation is true', () => {
    let isValid = true;

    class TestForm extends React.Component<
      {},
      {
        validationErrors: { [key: string]: ValidationError };
      }
    > {
      constructor(props) {
        super(props);
        this.state = {
          validationErrors: {},
        };
      }

      setValidationErrors = (empty?: unknown) => {
        this.setState(!empty ? { validationErrors: { foo: 'bar' } } : { validationErrors: {} });
      };

      onValid = () => {
        isValid = true;
      };

      onInvalid = () => {
        isValid = false;
      };

      render() {
        return (
          <Formsy
            onInvalid={this.onInvalid}
            onValid={this.onValid}
            preventExternalInvalidation
            validationErrors={this.state.validationErrors}
          >
            <TestInput name="foo" />
            <button type="button" onClick={() => this.setValidationErrors()} data-testid="validation-btn" />
          </Formsy>
        );
      }
    }

    const screen = render(<TestForm />);
    const validationBtn = screen.getByTestId('validation-btn');

    expect(isValid).toEqual(true);

    fireEvent.click(validationBtn);

    expect(isValid).toEqual(true);
  });

  it('should revalidate form when input added dynamically', () => {
    let isValid = false;
    const Inputs = () => {
      const [counter, setCounter] = useState(1);

      return (
        <>
          <button type="button" onClick={() => setCounter(counter + 1)} data-testid="add-btn">
            +
          </button>
          {Array.from(Array(counter)).map((_, index) => (
            <TestInput key={index} name={`foo-${index}`} required={true} value={index === 0 ? 'bla' : undefined} />
          ))}
        </>
      );
    };

    const TestForm = () => {
      return (
        <Formsy onInvalid={() => (isValid = false)} onValid={() => (isValid = true)}>
          <Inputs />
        </Formsy>
      );
    };
    jest.useFakeTimers();
    const screen = render(<TestForm />);
    const plusButton = screen.getByTestId('add-btn');

    jest.runAllTimers();

    expect(isValid).toBe(true);

    fireEvent.click(plusButton);

    expect(isValid).toBe(false);
  });

  it('should revalidate form once when mounting multiple inputs', () => {
    const validSpy = jest.fn();
    const TestForm = () => (
      <Formsy onValid={validSpy}>
        // onValid is called each time the form revalidates
        {Array.from(Array(5)).map((_, index) => (
          <TestInput key={index} name={`foo-${index}`} required={true} value={'bla'} />
        ))}
      </Formsy>
    );

    render(<TestForm />);

    expect(validSpy).toHaveBeenCalledTimes(1);
  });

  it('should revalidate form once when unmounting multiple inputs', () => {
    const Inputs = () => {
      const [showInputs, setShowInputs] = useState(true);

      return (
        <>
          <button type="button" onClick={() => setShowInputs(!showInputs)} data-testid="toggle-btn">
            toggle inputs
          </button>
          {showInputs &&
            Array.from({ length: 10 }, (_, index) => (
              <TestInput key={index} name={`foo-${index}`} required={true} value={`${index}`} />
            ))}
        </>
      );
    };

    const validSpy = jest.fn();

    const TestForm = () => (
      <Formsy onValid={validSpy}>
        <Inputs />
      </Formsy>
    );

    jest.useFakeTimers();
    const screen = render(<TestForm />);
    jest.runAllTimers();
    const toggleBtn = screen.getByTestId('toggle-btn');

    validSpy.mockClear();

    fireEvent.click(toggleBtn);
    jest.runAllTimers();

    expect(validSpy).toHaveBeenCalledTimes(1);
  });
});

describe('onSubmit/onValidSubmit/onInvalidSubmit', () => {
  ['onSubmit', 'onValidSubmit', 'onInvalidSubmit'].forEach((key) => {
    it(`should pass submit event to "${key}"`, () => {
      const submitSpy = jest.fn();

      const screen = render(
        <Formsy {...{ [key]: submitSpy }}>
          <button type="submit" data-testid="submit-btn" />
          {key === 'onInvalidSubmit' && <TestInput name="test" required={true} />}
        </Formsy>,
      );
      const button = screen.getByTestId('submit-btn');

      fireEvent.click(button);

      expect(submitSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Function),
        expect.any(Function),
        expect.any(Object),
      );
    });
  });
});

describe('<Formsy /> can render any tag or element with the props as', () => {
  it('as div', () => {
    const screen = render(<Formsy formElement="div" data-testid="form" />);
    const form = screen.getByTestId('form');

    expect(form.tagName.toLowerCase()).toBe('div');
  });

  it('as CustumElement', () => {
    const CustomElement = ({ children }) => <div data-testid="custom-element">{children}</div>;
    const screen = render(<Formsy formElement={CustomElement} />);
    const customElement = screen.getByTestId('custom-element');

    expect(customElement.tagName.toLowerCase()).toBe('div');
  });
});
