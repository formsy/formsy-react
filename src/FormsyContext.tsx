import React from 'react';
import type { FormState } from './formsyReducer';
import { FormsyActions } from './interfaces';

const noFormsyErrorMessage =
  'Could not find Formsy Context Provider. Did you use useFormsy or withFormsy outside <Formsy />?';

const throwNoFormsyProvider = () => {
  throw new Error(noFormsyErrorMessage);
};

export interface FormsyStateStore {
  subscribe: (listener: () => void) => () => void;
  getState: () => FormState;
  getDisabled: () => boolean;
}

const defaultStore: FormsyStateStore = {
  subscribe: () => {
    throwNoFormsyProvider();
    return () => undefined;
  },
  getState: () => {
    throwNoFormsyProvider();
    return undefined as never;
  },
  getDisabled: () => {
    throwNoFormsyProvider();
    return false;
  },
};

// Form actions are stable; field state is read through the external store below.
// Separating them keeps an update to one field from invalidating every consumer.
export const FormsyActionsContext = React.createContext<FormsyActions>({
  setValue: throwNoFormsyProvider,
  registerInput: throwNoFormsyProvider,
  unregisterInput: throwNoFormsyProvider,
  resetValue: throwNoFormsyProvider,
  updateValidations: throwNoFormsyProvider,
  isValidValue: () => {
    throwNoFormsyProvider();
    return false;
  },
});
export const FormsyStateStoreContext = React.createContext<FormsyStateStore>(defaultStore);
