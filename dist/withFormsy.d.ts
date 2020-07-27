import PropTypes from 'prop-types';
import React from 'react';
import { RequiredValidation, ValidationError, Validations } from './interfaces';
export declare const propTypes: {
    innerRef: PropTypes.Requireable<(...args: any[]) => any>;
    name: PropTypes.Validator<string>;
    required: PropTypes.Requireable<string | boolean | object>;
    validations: PropTypes.Requireable<string | object>;
    value: PropTypes.Requireable<any>;
};
export interface WrapperProps<V> {
    innerRef?: (ref: React.Ref<any>) => void;
    name: string;
    required?: RequiredValidation<V>;
    validationError?: ValidationError;
    validationErrors?: {
        [key: string]: ValidationError;
    };
    validations?: Validations<V>;
    value?: V;
}
export interface WrapperState<V> {
    [key: string]: unknown;
    formSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    pristineValue: V;
    validationError: ValidationError[];
    value: V;
}
export interface InjectedProps<V> {
    errorMessage: ValidationError;
    errorMessages: ValidationError[];
    hasValue: boolean;
    isFormDisabled: boolean;
    isFormSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    isValidValue: (value: V) => boolean;
    ref?: React.Ref<any>;
    resetValue: () => void;
    setValidations: (validations: Validations<V>, required: RequiredValidation<V>) => void;
    setValue: (value: V, validate?: boolean) => void;
    showError: boolean;
    showRequired: boolean;
}
export interface WrapperInstanceMethods<V> {
    getErrorMessage: () => null | ValidationError;
    getErrorMessages: () => ValidationError[];
    getValue: () => V;
    isFormDisabled: () => boolean;
    isFormSubmitted: () => boolean;
    isValid: () => boolean;
    isValidValue: (value: V) => boolean;
    setValue: (value: V, validate?: boolean) => void;
}
export declare type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;
export default function withFormsy<T, V>(WrappedComponent: React.ComponentType<T & PassDownProps<V>>): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>>;
