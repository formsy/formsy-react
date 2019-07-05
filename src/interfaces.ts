import React, { ComponentClass } from 'react';
import { WrapperProps } from './Wrapper';

export type Value = any;
export interface Values {
  [key: string]: Value;
}
export type IModel = any;
export type IData = any;
export type IResetModel = (model?: IModel) => void;
export type IUpdateInputsWithError = (errors: any, invalidate: boolean) => void;

export interface FormsyProps {
  disabled: boolean;
  getErrorMessage: any;
  getErrorMessages: any;
  getValue: any;
  hasValue: any;
  isFormDisabled: any;
  isFormSubmitted: any;
  isPristine: any;
  isRequired: any;
  isValid: any;
  isValidValue: any;
  mapping: null | ((model: IModel) => IModel);
  onChange: (model: IModel, isChanged: boolean) => void;
  onError: any;
  onInvalid: () => void;
  onInvalidSubmit: any;
  onReset?: () => void;
  onSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
  onValid: () => void;
  onValidSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
  preventExternalInvalidation?: boolean;
  resetValue: any;
  setValidations: any;
  setValue: any;
  showError: any;
  showRequired: any;
  validationErrors?: null | object;
}

export interface FormsyState {
  canChange: boolean;
  formSubmitted?: boolean;
  isPristine?: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

export type ValidationFunction = (values: Values, value: Value, extra?: any) => boolean;

export type Validation = string | true | ValidationFunction;

export interface Validations {
  [key: string]: Validation;
}

export type RequiredValidation = string | true | Validations;

export interface ComponentWithStaticAttributes extends ComponentClass {
  string?: any;
  defaultValue?: any;
}

export type WrappedComponentClass = React.FC | ComponentWithStaticAttributes;

export interface WrapperState {
  [key: string]: unknown;
  externalError: null;
  formSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  pristineValue: any;
  validationError: any[];
  value: any;
}

export interface PassDownProps {
  errorMessage: any;
  errorMessages: any;
  hasValue: boolean;
  isFormDisabled: boolean;
  isFormSubmitted: boolean;
  isPristine: boolean;
  isRequired: boolean;
  isValid: boolean;
  isValidValue: (value: Value) => boolean;
  name: string;
  ref?: any;
  resetValue: any;
  setValidations: any;
  setValue: (value: Value) => void;
  showError: boolean;
  showRequired: boolean;
  validationError: any;
  validationErrors: any;
  value: Value;
}

export interface WrappedComponentSomething extends React.Component<WrapperProps, WrapperState> {
  validations?: Validations;
  requiredValidations?: Validations;
}
