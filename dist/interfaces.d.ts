import React, { ComponentClass } from 'react';
import { WrapperProps, WrapperState } from './Wrapper';
export interface Values {
    [key: string]: any;
}
export declare type IModel = any;
export declare type IData = any;
export declare type IResetModel = (model?: IModel) => void;
export declare type IUpdateInputsWithValue<V> = (values: any, validate?: boolean) => void;
export declare type IUpdateInputsWithError = (errors: any, invalidate?: boolean) => void;
export declare type ValidationFunction<V> = (values: Values, value: V, extra?: any) => boolean | string;
export declare type Validation<V> = string | boolean | ValidationFunction<V>;
export declare type Validations<V> = ValidationsStructure<V> | string | object;
export interface ValidationsStructure<V> {
    [key: string]: Validation<V>;
}
export declare type RequiredValidation<V> = boolean | Validations<V>;
export interface ComponentWithStaticAttributes extends ComponentClass {
    defaultValue?: any;
}
export declare type WrappedComponentClass = React.FC | ComponentWithStaticAttributes;
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
