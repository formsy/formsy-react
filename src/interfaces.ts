import React, { ComponentClass } from 'react';
import { WrapperProps, WrapperState } from './Wrapper';

export type Value = any;
export interface Values {
  [key: string]: Value;
}
export type IModel = any;
export type IData = any;
export type IResetModel = (model?: IModel) => void;
export type ISetInputValue = (name: string, value: Value, validate?: boolean) => void;
export type IUpdateInputsWithError = (errors: any, invalidate?: boolean) => void;

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

export interface InputComponent extends React.Component<WrapperProps, WrapperState> {
  validations?: Validations;
  requiredValidations?: Validations;
}

export interface FormsyContextInterface {
  attachToForm: (component: InputComponent) => void;
  detachFromForm: (component: InputComponent) => void;
  isFormDisabled: boolean;
  isValidValue: (component: InputComponent, value: any) => boolean;
  validate: (component: InputComponent) => void;
}
