import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Formsy, { addValidationRule } from './..';
import TestInput from '../__test_utils__/TestInput';
import TestInputHoc from '../__test_utils__/TestInputHoc';
import immediate from '../__test_utils__/immediate';

describe('Setting up a form', () => {
  it('should expose the users DOM node through an innerRef prop', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInputHoc
              name="name"
              innerRef={c => {
                this.inputRef = c;
              }}
            />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    const input = form.instance().inputRef;
    expect(input.props.name).toEqual('name');
  });

  it('should render a form into the document', () => {
    const form = mount(<Formsy></Formsy>);
    expect(form.find('form').name()).toEqual('form');
  });

  it('should set a class name if passed', () => {
    const form = mount(<Formsy className="foo"></Formsy>);
    expect(form.find('form').hasClass('foo')).toBe(true);
  });

  it('should allow for null/undefined children', () => {
    let model = null;
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onSubmit={formModel => (model = formModel)}>
            <h1>Test</h1>
            {null}
            {undefined}
            <TestInput name="name" value={'foo'} />
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    immediate(() => {
      expect(model).toEqual({ name: 'foo' });
    });
  });

  it('should allow for inputs being added dynamically', () => {
    const inputs = [];
    let forceUpdate = null;
    let model = null;
    class TestForm extends React.Component {
      componentWillMount() {
        forceUpdate = this.forceUpdate.bind(this);
      }
      render() {
        return <Formsy onSubmit={formModel => (model = formModel)}>{inputs}</Formsy>;
      }
    }
    const form = mount(<TestForm />);

    // Wait before adding the input
    setTimeout(() => {
      inputs.push(<TestInput name="test" value="" key={inputs.length} />);

      forceUpdate(() => {
        // Wait for next event loop, as that does the form
        immediate(() => {
          form.simulate('submit');
          test.ok('test' in model);
        });
      });
    }, 10);
  });

  it('should allow dynamically added inputs to update the form-model', () => {
    const inputs = [];
    let forceUpdate = null;
    let model = null;
    class TestForm extends React.Component {
      componentWillMount() {
        forceUpdate = this.forceUpdate.bind(this);
      }
      render() {
        return <Formsy onSubmit={formModel => (model = formModel)}>{inputs}</Formsy>;
      }
    }
    const form = mount(<TestForm />);

    // Wait before adding the input
    immediate(() => {
      inputs.push(<TestInput name="test" key={inputs.length} />);

      forceUpdate(() => {
        // Wait for next event loop, as that does the form
        immediate(() => {
          form.find('input').simulate({
            target: { value: 'foo' },
          });
          form.simulate('submit');
          expect(model.test).toEqual('foo');
        });
      });
    });
  });

  it('should allow a dynamically updated input to update the form-model', () => {
    let forceUpdate = null;
    let model = null;

    class TestForm extends React.Component {
      componentWillMount() {
        forceUpdate = this.forceUpdate.bind(this);
      }
      render() {
        const input = <TestInput name="test" value={this.props.value} />;

        return <Formsy onSubmit={formModel => (model = formModel)}>{input}</Formsy>;
      }
    }
    let form = mount(<TestForm value="foo" />);

    // Wait before changing the input
    immediate(() => {
      form = mount(<TestForm value="bar" />);

      forceUpdate(() => {
        // Wait for next event loop, as that does the form
        immediate(() => {
          form.simulate('submit');
          expect(model.test).toEqual('bar');
        });
      });
    });
  });
});

describe('validations', () => {
  it('should run when the input changes', () => {
    const runRule = sinon.spy();
    const notRunRule = sinon.spy();

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
    expect(runRule.calledWith({ one: 'bar' })).toBe(true);
    expect(notRunRule.called).toEqual(false);
  });

  it('should allow the validation to be changed', () => {
    const ruleA = sinon.spy();
    const ruleB = sinon.spy();
    addValidationRule('ruleA', ruleA);
    addValidationRule('ruleB', ruleB);

    class TestForm extends React.Component {
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
    form.instance().changeRule();
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(ruleB.calledWith({ one: 'bar' })).toBe(true);
  });

  it('should invalidate a form if dynamically inserted input is invalid', () => {
    const isInValidSpy = sinon.spy();

    class TestForm extends React.Component {
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
          <Formsy ref="formsy" onInvalid={isInValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect(form.instance().refs.formsy.state.isValid).toEqual(true);
    form.instance().addInput();

    immediate(() => {
      expect(isInValidSpy.called).toEqual(true);
    });
  });

  it('should validate a form when removing an invalid input', () => {
    const isValidSpy = sinon.spy();

    class TestForm extends React.Component {
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
          <Formsy ref="formsy" onValid={isValidSpy}>
            <TestInput name="one" validations="isEmail" value="foo@bar.com" />
            {this.state.showSecondInput ? <TestInput name="two" validations="isEmail" value="foo@bar" /> : null}
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);

    expect(form.instance().refs.formsy.state.isValid).toEqual(false);
    form.instance().removeInput();

    immediate(() => {
      expect(isValidSpy.called).toEqual(true);
    });
  });

  it('runs multiple validations', () => {
    const ruleA = sinon.spy();
    const ruleB = sinon.spy();
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
    expect(ruleA.calledWith({ one: 'bar' })).toBe(true);
    expect(ruleB.calledWith({ one: 'bar' })).toBe(true);
  });
});

describe('onChange', () => {
  it('should not trigger onChange when form is mounted', () => {
    const hasChanged = sinon.spy();
    class TestForm extends React.Component {
      render() {
        return <Formsy onChange={hasChanged}></Formsy>;
      }
    }
    mount(<TestForm />);
    expect(hasChanged.called).toEqual(false);
  });

  it('should trigger onChange once when form element is changed', () => {
    const hasChanged = sinon.spy();
    const form = mount(
      <Formsy onChange={hasChanged}>
        <TestInput name="foo" />
      </Formsy>,
    );
    form.find('input').simulate('change', { target: { value: 'bar' } });
    expect(hasChanged.calledOnce).toEqual(true);
  });

  it('should trigger onChange once when new input is added to form', () => {
    const hasChanged = sinon.spy();
    class TestForm extends React.Component {
      state = {
        showInput: false,
      };
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
    form.instance().addInput();
    immediate(() => {
      expect(hasChanged.calledOnce).toEqual(true);
    });
  });

  it('onChange should honor dot notation transformations', () => {
    const hasChanged = sinon.spy();
    class TestForm extends React.Component {
      state = {
        showInput: false,
      };
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
    form.instance().addInput();
    immediate(() => {
      expect(hasChanged.args[0][0]).toEqual({ parent: { child: 'test' } });
    });
  });
});

describe('Update a form', () => {
  it('should allow elements to check if the form is disabled', () => {
    class TestForm extends React.Component {
      state = { disabled: true };
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
    const input = form.find(TestInput);
    expect(input.instance().isFormDisabled()).toEqual(true);

    form.instance().enableForm();
    immediate(() => {
      expect(input.instance().isFormDisabled()).toEqual(false);
    });
  });

  it('should be possible to pass error state of elements by changing an errors attribute', () => {
    class TestForm extends React.Component {
      state = { validationErrors: { foo: 'bar' } };
      onChange = values => {
        this.setState(values.foo ? { validationErrors: {} } : { validationErrors: { foo: 'bar' } });
      };
      render() {
        return (
          <Formsy onChange={this.onChange} validationErrors={this.state.validationErrors}>
            <TestInput name="foo" />
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);

    // Wait for update
    immediate(() => {
      const input = form.find(TestInput);
      expect(input.instance().getErrorMessage()).toEqual('bar');
      input.setValue('gotValue');

      // Wait for update
      immediate(() => {
        expect(input.instance().getErrorMessage()).toEqual(null);
      });
    });
  });

  it('should trigger an onValidSubmit when submitting a valid form', () => {
    let isCalled = sinon.spy();
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onValidSubmit={isCalled}>
            <TestInput name="foo" validations="isEmail" value="foo@bar.com" />
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);
    const FoundForm = form.find(TestForm);
    FoundForm.simulate('submit');
    expect(isCalled.called).toEqual(true);
  });

  it('should trigger an onInvalidSubmit when submitting an invalid form', () => {
    let isCalled = sinon.spy();
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onInvalidSubmit={isCalled}>
            <TestInput name="foo" validations="isEmail" value="foo@bar" />
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);

    const FoundForm = form.find(TestForm);
    FoundForm.simulate('submit');
    expect(isCalled.called).toEqual(true);
  });
});

describe('value === false', () => {
  it('should call onSubmit correctly', () => {
    const onSubmit = sinon.spy();
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onSubmit={onSubmit}>
            <TestInput name="foo" value={false} type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }

    const form = mount(<TestForm />);
    form.simulate('submit');
    expect(onSubmit.calledWith({ foo: false })).toEqual(true);
  });

  it('should allow dynamic changes to false', () => {
    const onSubmit = sinon.spy();
    class TestForm extends React.Component {
      state = {
        value: true,
      };
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
    form.instance().changeValue();
    form.simulate('submit');
    expect(onSubmit.calledWith({ foo: false })).toEqual(true);
  });

  it('should say the form is submitted', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="foo" value={true} type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);
    const input = form.find(TestInput);
    expect(input.instance().isFormSubmitted()).toEqual(false);
    form.simulate('submit');
    expect(input.instance().isFormSubmitted()).toEqual(true);
  });

  it('should be able to reset the form to its pristine state', () => {
    class TestForm extends React.Component {
      state = {
        value: true,
      };
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
    const input = form.find(TestInput);
    const formsyForm = form.find(Formsy);
    expect(input.instance().getValue()).toEqual(true);
    form.instance().changeValue();
    expect(input.instance().getValue()).toEqual(false);
    formsyForm.instance().reset();
    expect(input.instance().getValue()).toEqual(true);
  });

  it('should be able to reset the form using custom data', () => {
    class TestForm extends React.Component {
      state = {
        value: true,
      };
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
    const input = form.find(TestInput);
    const formsyForm = form.find(Formsy);

    expect(input.instance().getValue()).toEqual(true);
    form.instance().changeValue();
    expect(input.instance().getValue()).toEqual(false);
    formsyForm.instance().reset({
      foo: 'bar',
    });
    expect(input.instance().getValue()).toEqual('bar');
  });
});

describe('.reset()', () => {
  it('should be able to reset the form to empty values', () => {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="foo" value="42" type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }
    const form = mount(<TestForm />);
    const input = form.find(TestInput);
    const formsyForm = form.find(Formsy);

    formsyForm.instance().reset({
      foo: '',
    });
    expect(input.instance().getValue()).toEqual('');
  });
});

describe('.isChanged()', () => {
  it('initially returns false', () => {
    const hasOnChanged = sinon.spy();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    expect(form.instance().isChanged()).toEqual(false);
    expect(hasOnChanged.called).toEqual(false);
  });

  it('returns true when changed', () => {
    const hasOnChanged = sinon.spy();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(form.instance().isChanged()).toEqual(true);
    expect(hasOnChanged.calledWith({ one: 'bar' })).toEqual(true);
  });

  it('returns false if changes are undone', () => {
    const hasOnChanged = sinon.spy();
    const form = mount(
      <Formsy onChange={hasOnChanged}>
        <TestInput name="one" value="foo" />
      </Formsy>,
    );
    const input = form.find('input');
    input.simulate('change', {
      target: { value: 'bar' },
    });
    expect(hasOnChanged.calledWith({ one: 'bar' })).toBe(true);

    input.simulate('change', {
      target: { value: 'foo' },
    });
    expect(form.instance().isChanged()).toEqual(false);
    expect(hasOnChanged.calledWith({ one: 'foo' })).toBe(true);
  });
});

describe('form valid state', () => {
  it('should allow to be changed with updateInputsWithError', () => {
    class TestForm extends React.Component {
      state = { isValid: true };
      onValidSubmit = (model, reset, updateInputsWithError) => {
        updateInputsWithError({ foo: 'bar' }, true);
      };
      onValid = () => {
        this.setState({ isValid: true });
      };
      onInvalid = () => {
        this.setState({ isValid: false });
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

    // Wait for update
    immediate(() => {
      expect(form.state.isValid).toEqual(true);
      form.simulate('submit');

      // Wait for update
      immediate(() => {
        expect(form.state.isValid).toEqual(false);
      });
    });
  });

  it('should be false when validationErrors is not empty', () => {
    class TestForm extends React.Component {
      state = { validationErrors: {}, isValid: true };
      setValidationErrors = empty => {
        this.setState(!empty ? { validationErrors: { foo: 'bar' } } : { validationErrors: {} });
      };
      onValid = () => {
        this.setState({ isValid: true });
      };
      onInvalid = () => {
        this.setState({ isValid: false });
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

    // Wait for update
    immediate(() => {
      expect(form.state.isValid).toEqual(true);
      form.setValidationErrors();

      // Wait for update
      immediate(() => {
        expect(form.state.isValid).toEqual(false);
      });
    });
  });

  it('should be true when validationErrors is not empty and preventExternalInvalidation is true', () => {
    class TestForm extends React.Component {
      state = { validationErrors: {}, isValid: true };
      setValidationErrors = empty => {
        this.setState(!empty ? { validationErrors: { foo: 'bar' } } : { validationErrors: {} });
      };
      onValid = () => {
        this.setState({ isValid: true });
      };
      onInvalid = () => {
        this.setState({ isValid: false });
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

    // Wait for update
    immediate(() => {
      expect(form.state.isValid).toEqual(true);
      form.setValidationErrors();

      // Wait for update
      immediate(() => {
        expect(form.state.isValid).toEqual(true);
      });
    });
  });
});
