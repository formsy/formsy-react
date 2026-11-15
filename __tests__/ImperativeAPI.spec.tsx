import { fireEvent, render } from '@testing-library/react';
import React, { useState } from 'react';
import TestInput from '../__test_utils__/TestInput';
import Formsy from '../src';
import type { FormsyImperativeAPI } from '../src/interfaces';

describe('Imperative API', () => {
  it('keeps the same imperative API object across parent re-renders', () => {
    const handles: FormsyImperativeAPI[] = [];

    function ReRenderForm() {
      const [, setTick] = useState(0);
      const formRef = React.useRef<FormsyImperativeAPI>(null);
      React.useEffect(() => {
        handles.push(formRef.current);
      });
      return (
        <Formsy ref={formRef}>
          <TestInput name="a" testId="input-a" />
          <button type="button" data-testid="rerender" onClick={() => setTick((t) => t + 1)} />
        </Formsy>
      );
    }

    const screen = render(<ReRenderForm />);

    fireEvent.click(screen.getByTestId('rerender'));
    fireEvent.click(screen.getByTestId('rerender'));

    expect(handles.length).toBeGreaterThanOrEqual(3);
    expect(new Set(handles).size).toEqual(1);
  });

  it('still exposes a working imperative API after re-renders', () => {
    const submitSpy = jest.fn();

    function ReRenderForm() {
      const [, setTick] = useState(0);
      const formRef = React.useRef<FormsyImperativeAPI>(null);
      return (
        <Formsy ref={formRef} onSubmit={submitSpy} data-testid="form">
          <TestInput name="a" value="foo" testId="input-a" />
          <button type="button" data-testid="rerender" onClick={() => setTick((t) => t + 1)} />
        </Formsy>
      );
    }

    const screen = render(<ReRenderForm />);
    fireEvent.click(screen.getByTestId('rerender'));
    fireEvent.click(screen.getByTestId('rerender'));

    expect(screen.getByTestId('input-a').dataset.value).toEqual(JSON.stringify('foo'));

    fireEvent.submit(screen.getByTestId('form'));
    expect(submitSpy).toHaveBeenCalledWith({ a: 'foo' }, expect.any(Function), expect.any(Function), expect.anything());
  });
});
