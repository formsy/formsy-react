import React, { ComponentClass } from 'react';
import { WrapperProps, WrapperState } from './Wrapper';
export declare type Value = any;
export interface Values {
    [key: string]: Value;
}
export declare type IModel = any;
export declare type IData = any;
export declare type IResetModel = (model?: IModel) => void;
export declare type ISetInputValue = (name: string, value: Value, validate?: boolean) => void;
export declare type IUpdateInputsWithError = (errors: any, invalidate?: boolean) => void;
export declare type ValidationFunction = (values: Values, value: Value, extra?: any) => boolean;
export declare type Validation = string | true | ValidationFunction;
export interface Validations {
    [key: string]: Validation;
}
export declare type RequiredValidation = string | true | Validations;
export interface ComponentWithStaticAttributes extends ComponentClass {
    string?: any;
    defaultValue?: any;
}
export declare type WrappedComponentClass = React.FC | ComponentWithStaticAttributes;
export interface InputComponent extends React.Component<WrapperProps, WrapperState> {
    validations?: Validations;
    requiredValidations?: Validations;
}
