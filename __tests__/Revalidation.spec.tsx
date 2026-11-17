import { fireEvent, render } from '@testing-library/react';
import React, { useState } from 'react';
import TestInput from '../__test_utils__/TestInput';
import Formsy, { addValidationRule } from '../src';
import { validationRules } from '../src/validationRules';

describe('Revalidation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('changing one field', () => {
    it('only revalidates that field, not every registered input', () => {
      const isEmail = jest.spyOn(validationRules, 'isEmail');
      const screen = render(
        <Formsy>
          <TestInput name="a" validations="isEmail" testId="input-a" />
          <TestInput name="b" validations="isEmail" testId="input-b" />
          <TestInput name="c" validations="isEmail" testId="input-c" />
        </Formsy>
      );
      isEmail.mockClear();

      fireEvent.change(screen.getByTestId('input-a'), { target: { value: 'not-an-email' } });

      expect(isEmail).toHaveBeenCalledTimes(1);
      expect(isEmail).toHaveBeenCalledWith(expect.anything(), 'not-an-email', true);
    });

    it('still revalidates fields whose rules depend on other fields', () => {
      const screen = render(
        <Formsy>
          <TestInput name="a" testId="input-a" />
          <TestInput name="b" validations="equalsField:a" testId="input-b" />
        </Formsy>
      );
      const a = screen.getByTestId('input-a');
      const b = screen.getByTestId('input-b');

      expect(b.dataset.isValid).toEqual('true');

      fireEvent.change(a, { target: { value: 'foo' } });
      expect(b.dataset.isValid).toEqual('false');

      fireEvent.change(b, { target: { value: 'foo' } });
      expect(b.dataset.isValid).toEqual('true');
    });

    it('still revalidates fields with custom function rules when another field changes', () => {
      const screen = render(
        <Formsy>
          <TestInput name="a" testId="input-a" />
          <TestInput
            name="b"
            testId="input-b"
            validations={{
              custom: (values, value) => value === 'yes' && values.a === 'foo',
            }}
          />
        </Formsy>
      );
      const a = screen.getByTestId('input-a');
      const b = screen.getByTestId('input-b');

      fireEvent.change(a, { target: { value: 'foo' } });
      fireEvent.change(b, { target: { value: 'no' } });
      expect(b.dataset.isValid).toEqual('false');

      // Re-evaluating b's cross-field rule against the new value of `a`
      // must not turn it valid while the rule itself still fails.
      fireEvent.change(a, { target: { value: 'bar' } });
      fireEvent.change(a, { target: { value: 'foo' } });
      expect(b.dataset.isValid).toEqual('false');
    });

    it('still revalidates fields using rules registered with addValidationRule', () => {
      addValidationRule('matchesOtherField', (values, value, field: string) => value === values[field]);

      const screen = render(
        <Formsy>
          <TestInput name="a" testId="input-a" />
          <TestInput name="b" validations="matchesOtherField:a" testId="input-b" />
        </Formsy>
      );
      const a = screen.getByTestId('input-a');
      const b = screen.getByTestId('input-b');

      fireEvent.change(a, { target: { value: 'foo' } });
      expect(b.dataset.isValid).toEqual('false');

      fireEvent.change(b, { target: { value: 'foo' } });
      expect(b.dataset.isValid).toEqual('true');
    });
  });

  describe('parent re-renders with value-equal inline props', () => {
    it('does not revalidate for an inline validations object', () => {
      const isEmail = jest.spyOn(validationRules, 'isEmail');

      function Form() {
        const [, setTick] = useState(0);
        return (
          <Formsy>
            <TestInput name="a" validations={{ isEmail: true }} testId="input-a" />
            <button type="button" data-testid="rerender" onClick={() => setTick((t) => t + 1)} />
          </Formsy>
        );
      }

      const screen = render(<Form />);
      isEmail.mockClear();

      fireEvent.click(screen.getByTestId('rerender'));

      expect(isEmail).not.toHaveBeenCalled();
    });

    it('does not revalidate for an inline validationErrors object', () => {
      const isEmail = jest.spyOn(validationRules, 'isEmail');

      function Form() {
        const [, setTick] = useState(0);
        return (
          <Formsy validationErrors={{ a: 'Server error' }}>
            <TestInput name="a" validations="isEmail" testId="input-a" />
            <button type="button" data-testid="rerender" onClick={() => setTick((t) => t + 1)} />
          </Formsy>
        );
      }

      const screen = render(<Form />);
      isEmail.mockClear();

      fireEvent.click(screen.getByTestId('rerender'));

      expect(isEmail).not.toHaveBeenCalled();
    });
  });
});
