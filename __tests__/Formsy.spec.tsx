/* eslint-disable max-classes-per-file, react/destructuring-assignment */
import { mount } from 'enzyme';
import * as React from 'react';
import { useState } from 'react';

import DynamicInputForm from '../__test_utils__/DynamicInputForm';
import { getFormInstance, getWrapperInstance } from '../__test_utils__/getInput';
import TestInput from '../__test_utils__/TestInput';
import TestInputHoc from '../__test_utils__/TestInputHoc';
import Formsy, { addValidationRule } from '../src';
import { ValidationError } from '../src/interfaces';

describe('Setting up a form', () => {
  it('should expose the users DOM node through an innerRef prop', () => {
    class TestForm extends React.Component {
      public inputRef: any;

      render() {
        return (
          <Formsy>
            <TestInputHoc
              name="name"
              innerRef={(c) => {
                this.inputRef = c;
              }}
            />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const input = ((form.instance() as TestForm) as TestForm).inputRef;
    expect(input.props.name).toEqual('name');
  });

  it('should render a form into the document', () => {
    const form = mount(<Formsy />);
    expect(form.find('form').name()).toEqual('form');
  });

  it('should set a class name if passed', () => {
    const form = mount(<Formsy className="foo" />);
    expect(form.find('form').hasClass('foo')).toBe(true);
  });

  it('should allow for null/undefined children', () => {
    let model = null;

    function TestForm() {
      return (
        <Formsy
          onSubmit={(formModel) => {
            model = formModel;
          }}
        >
          <h1>Test</h1>
          {null}
          {undefined}
          <TestInput name="name" value="foo" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    form.simulate('submit');
    expect(model).toEqual({ name: 'foo' });
  });

  it('should allow for inputs being added dynamically', () => {
    let model = null;

    const form = mount(
      <DynamicInputForm
        onSubmit={(formModel) => {
          model = formModel;
        }}
        inputName="test"
      />,
    );
    form.find('button').simulate('click');
    form.update();

    form.simulate('submit');
    expect(model).toHaveProperty('test');
  });

  it('should allow dynamically added inputs to update the form-model', () => {
    let model = null;

    const form = mount(
      <DynamicInputForm
        onSubmit={(formModel) => {
          model = formModel;
        }}
        inputName="test"
      />,
    );
    form.find('button').simulate('click');
    form.update();

    form.find('input').simulate('change', {
      target: { value: 'foo' },
    });
    form.simulate('submit');
    expect(model).toHaveProperty('test', 'foo');
  });

  it('should allow a dynamically updated input to update the form-model', () => {
    let model = null;

    class TestForm extends React.Component<{ inputValue: any }, { inputValue: any }> {
      constructor(props) {
        super(props);
        this.state = { inputValue: props.inputValue };
      }

      updateInputValue = () => this.setState({ inputValue: 'bar' });

      render() {
        const { inputValue } = this.state;
        return (
          <Formsy
            onSubmit={(formModel) => {
              model = formModel;
            }}
          >
            <TestInput name="test" value={inputValue} />
            <button type="button" onClick={this.updateInputValue}>
              Update
            </button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm inputValue="foo" />);

    form.simulate('submit');

    expect(model).toHaveProperty('test', 'foo');

    form.find('button').simulate('click');
    form.update();
    form.simulate('submit');
    form.update();

    expect(model).toHaveProperty('test', 'bar');
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
        <Formsy mapping={mapping} onSubmit={onSubmit}>
          <TestInput name="parent.child" value="test" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    form.simulate('submit');
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

    const form = mount(
      <Formsy>
        <TestInput name="one" validations="runRule" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');
    input.simulate('change', {
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
            <TestInput name="one" validations={this.state.rule} value="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    (form.instance() as TestForm).changeRule();
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(ruleB).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
  });

  it('should invalidate a form if dynamically inserted input is invalid', () => {
    const isInValidSpy = jest.fn();

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
          <Formsy ref={this.formRef} onInvalid={isInValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect((form.instance() as TestForm).formRef.current.state.isValid).toEqual(true);
    (form.instance() as TestForm).addInput();

    expect(isInValidSpy).toHaveBeenCalled();
  });

  it('should validate a form when removing an invalid input', () => {
    const isValidSpy = jest.fn();

    class TestForm extends React.Component<{}, { showSecondInput: boolean }> {
      formRef = React.createRef<Formsy>();

      constructor(props) {
        super(props);
        this.state = { showSecondInput: true };
      }

      removeInput() {
        this.setState({
          showSecondInput: false,
        });
      }

      render() {
        return (
          <Formsy ref={this.formRef} onValid={isValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect((form.instance() as TestForm).formRef.current.state.isValid).toEqual(false);
    (form.instance() as TestForm).removeInput();

    expect(isValidSpy).toHaveBeenCalled();
  });

  it('runs multiple validations', () => {
    const ruleA = jest.fn();
    const ruleB = jest.fn();
    addValidationRule('ruleA', ruleA);
    addValidationRule('ruleB', ruleB);

    const form = mount(
      <Formsy>
        <TestInput name="one" validations="ruleA,ruleB" value="foo" />
      </Formsy>,
    );

    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(ruleA).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
    expect(ruleB).toHaveBeenCalledWith({ one: 'bar' }, 'bar', true);
  });
});

describe('onChange', () => {
  it('should not trigger onChange when form is mounted', () => {
    const hasChanged = jest.fn();

    function TestForm() {
      return <Formsy onChange={hasChanged} />;
    }

    mount(<TestForm />);
    expect(hasChanged).not.toHaveBeenCalled();
  });

  it('should trigger onChange once when form element is changed', () => {
    const hasChanged = jest.fn();
    const form = mount(
      <Formsy onChange={hasChanged}>
        <TestInput name="foo" value="" />
      </Formsy>,
    );
    form.find('input').simulate('change', { target: { value: 'bar' } });
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

      addInput() {
        this.setState({
          showInput: true,
        });
      }

      render() {
        return <Formsy onChange={hasChanged}>{this.state.showInput ? <TestInput name="test" /> : null}</Formsy>;
      }
    }

    const form = mount(<TestForm />);
    (form.instance() as TestForm).addInput();
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

      addInput() {
        this.setState({
          showInput: true,
        });
      }

      render() {
        return (
          <Formsy onChange={hasChanged}>
            {this.state.showInput ? <TestInput name="parent.child" value="test" /> : null}
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    (form.instance() as TestForm).addInput();
    form.update();

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

      enableForm() {
        this.setState({ disabled: false });
      }

      render() {
        return (
          <Formsy disabled={this.state.disabled}>
            <TestInput name="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).isFormDisabled()).toEqual(true);

    (form.instance() as TestForm).enableForm();

    expect(getWrapperInstance(input).isFormDisabled()).toEqual(false);
  });

  it('should be possible to pass error state of elements by changing an errors attribute', () => {
    class TestForm extends React.Component<{}, { validationErrors: { [key: string]: React.ReactNode } }> {
      constructor(props) {
        super(props);
        this.state = {
          validationErrors: { foo: 'bar' },
        };
      }

      onChange = (values) => {
        this.setState(values.foo ? { validationErrors: {} } : { validationErrors: { foo: 'bar' } });
      };

      render() {
        return (
          <Formsy onChange={this.onChange} validationErrors={this.state.validationErrors}>
            <TestInput name="foo" value="" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).getErrorMessage()).toEqual('bar');
    getWrapperInstance(input).setValue('gotValue');

    expect(getWrapperInstance(input).getErrorMessage()).toEqual(null);
  });

  it('should prevent a default submit', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const FoundForm = form.find(TestForm);
    const submitEvent = { preventDefault: jest.fn() };
    FoundForm.simulate('submit', submitEvent);
    expect(submitEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent a default submit when preventDefaultSubmit is passed', () => {
    function TestForm() {
      return (
        <Formsy preventDefaultSubmit={false}>
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const FoundForm = form.find(TestForm);
    const submitEvent = { preventDefault: jest.fn() };
    FoundForm.simulate('submit', submitEvent);
    expect(submitEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should trigger an onValidSubmit when submitting a valid form', () => {
    const isCalled = jest.fn();

    function TestForm() {
      return (
        <Formsy onValidSubmit={isCalled}>
          <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const FoundForm = form.find(TestForm);
    FoundForm.simulate('submit');
    expect(isCalled).toHaveBeenCalled();
  });

  it('should trigger an onInvalidSubmit when submitting an invalid form', () => {
    const isCalled = jest.fn();

    function TestForm() {
      return (
        <Formsy onInvalidSubmit={isCalled}>
          <TestInput name="foo" validations="isEmail" value="foo@bar" />
        </Formsy>
      );
    }

    const form = mount(<TestForm />);

    const FoundForm = form.find(TestForm);
    FoundForm.simulate('submit');
    expect(isCalled).toHaveBeenCalled();
  });
});

describe('value === false', () => {
  it('should call onSubmit correctly', () => {
    const onSubmit = jest.fn();

    function TestForm() {
      return (
        <Formsy onSubmit={onSubmit}>
          <TestInput name="foo" value={false} type="checkbox" />
          <button type="submit">Save</button>
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    form.simulate('submit');
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

      changeValue() {
        this.setState({
          value: false,
        });
      }

      render() {
        return (
          <Formsy onSubmit={onSubmit}>
            <TestInput name="foo" value={this.state.value} type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    (form.instance() as TestForm).changeValue();
    form.simulate('submit');
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
          <TestInput name="foo" value type="checkbox" />
          <button type="submit">Save</button>
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)');
    expect(getWrapperInstance(input).isFormSubmitted()).toEqual(false);
    form.simulate('submit');
    expect(getWrapperInstance(input).isFormSubmitted()).toEqual(true);
  });

  it('should be able to reset the form to its pristine state', () => {
    class TestForm extends React.Component<{}, { value: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          value: true,
        };
      }

      changeValue() {
        this.setState({
          value: false,
        });
      }

      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={this.state.value} type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)');
    const formsyForm = form.find(Formsy);
    expect(getWrapperInstance(input).getValue()).toEqual(true);
    (form.instance() as TestForm).changeValue();
    expect(getWrapperInstance(input).getValue()).toEqual(false);
    getFormInstance(formsyForm).reset();
    expect(getWrapperInstance(input).getValue()).toEqual(true);
  });

  it('should be able to set a value to components with updateInputsWithValue', () => {
    class TestForm extends React.Component<{}, { valueFoo: boolean; valueBar: boolean }> {
      constructor(props) {
        super(props);
        this.state = {
          valueBar: true,
          valueFoo: true,
        };
      }

      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={this.state.valueFoo} type="checkbox" />
            <TestInput name="bar" value={this.state.valueBar} type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const inputs = form.find('Formsy(TestInput)');
    const formsyForm = form.find(Formsy);
    expect(getWrapperInstance(inputs.at(0)).getValue()).toEqual(true);
    expect(getWrapperInstance(inputs.at(1)).getValue()).toEqual(true);
    getFormInstance(formsyForm).updateInputsWithValue({ foo: false });
    expect(getWrapperInstance(inputs.at(0)).getValue()).toEqual(false);
    expect(getWrapperInstance(inputs.at(1)).getValue()).toEqual(true);
  });

  it('should be able to reset the form using custom data', () => {
    class TestForm extends React.Component<{}, { value: number; valueDeep: number }> {
      constructor(props) {
        super(props);
        this.state = {
          value: 1,
          valueDeep: 11,
        };
      }

      changeValue() {
        this.setState({
          value: 2,
          valueDeep: 12,
        });
      }

      render() {
        const { value, valueDeep } = this.state;

        return (
          <Formsy>
            <TestInput name="foo" value={value} />
            <TestInput name="bar.foo" value={valueDeep} />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)').at(0);
    const inputDeep = form.find('Formsy(TestInput)').at(1);
    const formsyForm = form.find(Formsy);

    expect(getWrapperInstance(input).getValue()).toEqual(1);
    expect(getWrapperInstance(inputDeep).getValue()).toEqual(11);

    ((form.instance() as TestForm) as TestForm).changeValue();
    expect(getWrapperInstance(input).getValue()).toEqual(2);
    expect(getWrapperInstance(inputDeep).getValue()).toEqual(12);

    getFormInstance(formsyForm).reset({
      foo: 3,
      bar: { foo: 13 },
    });
    expect(getWrapperInstance(input).getValue()).toEqual(3);
    expect(getWrapperInstance(inputDeep).getValue()).toEqual(13);
  });
});

describe('.reset()', () => {
  it('should be able to reset the form to empty values', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="foo" value="42" type="checkbox" />
          <button type="submit">Save</button>
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)');
    const formsyForm = form.find(Formsy);

    getFormInstance(formsyForm).reset({
      foo: '',
    });
    expect(getWrapperInstance(input).getValue()).toEqual('');
  });

  it('should be able to reset the form using a button', () => {
    function TestForm() {
      return (
        <Formsy>
          <TestInput name="foo" value="foo" />
          <button type="submit">Save</button>
        </Formsy>
      );
    }

    const form = mount(<TestForm />);
    const input = form.find('Formsy(TestInput)');
    const formsyForm = form.find(Formsy);

    expect(getWrapperInstance(input).getValue()).toEqual('foo');
    input.simulate('change', { target: { value: 'foobar' } });
    expect(getWrapperInstance(input).getValue()).toEqual('foobar');
    formsyForm.simulate('reset');
    expect(getWrapperInstance(input).getValue()).toEqual('foo');
  });
});

describe('.isChanged()', () => {
  it('initially returns false', () => {
    const hasOnChanged = jest.fn();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    expect(getFormInstance(form).isChanged()).toEqual(false);
    expect(hasOnChanged).not.toHaveBeenCalled();
  });

  it('returns true when changed', () => {
    const hasOnChanged = jest.fn();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(getFormInstance(form).isChanged()).toEqual(true);
    expect(hasOnChanged).toHaveBeenCalledWith({ one: 'bar' }, true);
  });

  it('returns false if changes are undone', () => {
    const hasOnChanged = jest.fn();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(hasOnChanged).toHaveBeenCalledWith({ one: 'bar' }, true);

    input.simulate('change', {
      target: { value: 'foo' },
    });

    expect(getFormInstance(form).isChanged()).toEqual(false);
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
          <Formsy onInvalid={this.onInvalid} onValid={this.onValid} onValidSubmit={this.onValidSubmit}>
            <TestInput name="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect(isValid).toEqual(true);
    form.simulate('submit');

    expect(isValid).toEqual(false);
  });

  it('should throw an error when updateInputsWithError is called with a missing input', () => {
    const mockConsoleError = jest.spyOn(console, 'error');
    mockConsoleError.mockImplementation(() => {
      // do nothing
    });

    class TestForm extends React.Component {
      onValidSubmit = (_model, _reset, updateInputsWithError) => {
        updateInputsWithError({ bar: 'bar' }, true);
      };

      render() {
        return (
          <Formsy onValidSubmit={this.onValidSubmit}>
            <TestInput name="foo" />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    expect(() => form.simulate('submit')).toThrow();
    mockConsoleError.mockRestore();
  });

  it('should be false when validationErrors is not empty', () => {
    let isValid = true;

    class TestForm extends React.Component<{}, { validationErrors: { [key: string]: ValidationError } }> {
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
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect(isValid).toEqual(true);
    (form.instance() as TestForm).setValidationErrors();
    expect(isValid).toEqual(false);
  });

  it('should be true when validationErrors is not empty and preventExternalInvalidation is true', () => {
    let isValid = true;

    class TestForm extends React.Component<{}, { validationErrors: { [key: string]: ValidationError } }> {
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
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect(isValid).toEqual(true);
    (form.instance() as TestForm).setValidationErrors();

    expect(isValid).toEqual(true);
  });

  it('should revalidate form when input added dynamically', () => {
    let isValid = false;
    const Inputs = () => {
      const [counter, setCounter] = useState(1);

      return (
        <>
          <button type="button" onClick={() => setCounter(counter + 1)} id="add">
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
    const form = mount(<TestForm />);
    const plusButton = form.find('#add');
    jest.runAllTimers();

    expect(isValid).toBe(true);

    plusButton.simulate('click');

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

    mount(<TestForm />);

    expect(validSpy).toHaveBeenCalledTimes(1 + 1); // one for form mount & 1 for all attachToForm calls
  });
});

describe('onSubmit/onValidSubmit/onInvalidSubmit', () => {
  ['onSubmit', 'onValidSubmit', 'onInvalidSubmit'].forEach((key) => {
    it(`should pass submit event to "${key}"`, () => {
      const submitSpy = jest.fn();

      const form = mount(
        <Formsy {...{ [key]: submitSpy }}>
          <button id="submit">submit</button>
          {key === 'onInvalidSubmit' && <TestInput name="test" required={true} />}
        </Formsy>,
      );
      const button = form.find('#submit');
      button.simulate('submit');

      expect(submitSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Function),
        expect.any(Function),
        expect.objectContaining({ type: 'submit' }),
      );
    });
  });
});

describe('<Formsy /> can render any tag or element with the props as', () => {
  it('as div', () => {
    const form = mount(
      <Formsy formElement="div" />
    );
    expect(form.find('div').length).toBe(1)
  })
  it('as CustumElement', () => {
    const CustomElement = ({ children }) => <div>{children}</div>;
    const form = mount(
      <Formsy formElement={CustomElement} />
    );
    expect(form.find(CustomElement).length).toBe(1)
  })
})