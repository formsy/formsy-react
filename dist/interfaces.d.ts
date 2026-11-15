import React from 'react';
export interface Values {
    [key: string]: any;
}
export type IModel = any;
export type IResetModel = (model?: IModel) => void;
export type IUpdateInputsWithValue<V> = (values: {
    [key: string]: V;
}, validate?: boolean) => void;
export type IUpdateInputsWithError = (errors: {
    [key: string]: ValidationError;
}, invalidate?: boolean) => void;
export type ValidationError = string | React.ReactNode;
export type ValidationFunction<V> = (values: Values, value: V, extra?: any) => boolean | ValidationError;
export type Validation<V> = string | boolean | ValidationFunction<V>;
export type Validations<V> = ValidationsStructure<V> | string | object;
export interface ValidationsStructure<V> {
    [key: string]: Validation<V>;
}
export type RequiredValidation<V> = boolean | Validations<V>;
export interface InputRegistration<V = any> {
    validations: Validations<V>;
    requiredValidations: Validations<V>;
    validationError?: ValidationError;
    validationErrors?: {
        [key: string]: ValidationError;
    };
}
export interface FormsyContextValue {
    values: Map<string, any>;
    errors: Map<string, ValidationError[]>;
    isPristine: Map<string, boolean>;
    isValid: Map<string, boolean>;
    isRequired: Map<string, boolean>;
    formSubmitted: boolean;
    formIsValid: boolean;
    isFormDisabled: boolean;
    inputs: Map<string, InputRegistration>;
    setValue: (name: string, value: any, validate?: boolean) => void;
    registerInput: (name: string, config: InputRegistration, initialValue: any) => void;
    unregisterInput: (name: string) => void;
    resetValue: (name: string) => void;
    updateValidations: (name: string, config: InputRegistration) => void;
    isValidValue: (name: string, value: any) => boolean;
}
export type FormsyActions = Omit<FormsyContextValue, 'values' | 'errors' | 'isPristine' | 'isValid' | 'isRequired' | 'formSubmitted' | 'formIsValid' | 'isFormDisabled' | 'inputs'>;
export interface FormsyImperativeAPI {
    submit: (event?: React.SyntheticEvent<HTMLFormElement>) => void;
    reset: (model?: IModel) => void;
    updateInputsWithValue: IUpdateInputsWithValue<any>;
    updateInputsWithError: IUpdateInputsWithError;
    isChanged: () => boolean;
    getModel: () => IModel;
    getPristineValues: () => Record<string, any>;
    getCurrentValues: () => Record<string, any>;
}
