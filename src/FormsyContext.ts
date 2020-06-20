import React from 'react';
import { FormsyContextInterface } from './interfaces';

const noFormsyErrorMessage = 'Could not find Formsy Context Provider. Did you use withFormsy outside <Formsy />?';

const throwNoFormsyProvider = () => {
  // istanbul ignore next
  throw new Error(noFormsyErrorMessage);
};

const defaultValue = {
  attachToForm: throwNoFormsyProvider,
  detachFromForm: throwNoFormsyProvider,
  isFormDisabled: true,
  isValidValue: throwNoFormsyProvider,
  validate: throwNoFormsyProvider,
  runValidation: throwNoFormsyProvider,
};

export default React.createContext<FormsyContextInterface>(defaultValue);
