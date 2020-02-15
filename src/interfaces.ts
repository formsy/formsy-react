import React, { ComponentClass } from 'react';
import { WrapperProps, WrapperState } from './Wrapper';

export interface Values {
  [key: string]: any;
}

export type IModel = any;
export type IData = any;
export type IResetModel = (model?: IModel) => void;
export type IUpdateInputsWithValue<V> = (values: any, validate?: boolean) => void;
export type IUpdateInputsWithError = (errors: any, invalidate?: boolean) => void;

export type ValidationFunction<V> = (values: Values, value: V, extra?: any) => boolean | string;

export type Validation<V> = string | boolean | ValidationFunction<V>;

export type Validations<V> = ValidationsStructure<V> | string | object;
export interface ValidationsStructure<V> {
  [key: string]: Validation<V>;
}

export type RequiredValidation<V> = boolean | Validations<V>;

export interface ComponentWithStaticAttributes extends ComponentClass {
  string?: any;
  defaultValue?: any;
}

export type WrappedComponentClass = React.FC | ComponentWithStaticAttributes;

export interface InputComponent<V> extends React.Component<WrapperProps<V>, WrapperState<V>> {
  validations?: Validations<V>;
  requiredValidations?: Validations<V>;
}

export interface FormsyContextInterface {
  attachToForm: (component: InputComponent<any>) => void;
  detachFromForm: (component: InputComponent<any>) => void;
  isFormDisabled: boolean;
  isValidValue: (component: InputComponent<any>, value: any) => boolean;
  validate: (component: InputComponent<any>) => void;
}
