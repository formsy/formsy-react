import React, { ComponentClass } from 'react';
import { WrapperProps, WrapperState } from './Wrapper';

type PromiseOrValue<T> = T | Promise<T>;

export type Value = any;
export interface Values {
  [key: string]: Value;
}
export type IModel = any;
export type IData = any;
export type IResetModel = (model?: IModel) => void;
export type ISetInputValue = (name: string, value: Value, validate?: boolean) => void;
export type IUpdateInputsWithError = (errors: any, invalidate?: boolean) => void;

export type ValidationFunction = (
  values: Values,
  value: Value,
  extra?: any,
) => PromiseOrValue<boolean | object | string>;

export type Validation = string | boolean | ValidationFunction;

export interface Validations {
  [key: string]: Validation;
}

export type RequiredValidation = string | boolean | Validations;

export interface ComponentWithStaticAttributes extends ComponentClass {
  string?: any;
  defaultValue?: any;
}

export type WrappedComponentClass = React.FC | ComponentWithStaticAttributes;

export interface InputComponent extends React.Component<WrapperProps, WrapperState> {
  validations?: Validations;
  requiredValidations?: Validations;
}
