import React from 'react';
import PropTypes from 'prop-types';
import { RequiredValidation, ValidationError, Validations } from './interfaces';
declare const propTypes: {
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
    setValue: (value: V) => void;
    showError: boolean;
    showRequired: boolean;
}
export interface WrapperInstanceMethods<V> {
    getErrorMessage: () => null | ValidationError;
    getErrorMessages: () => ValidationError[];
    getValue: () => V;
    isFormDisabled: () => boolean;
    isValid: () => boolean;
    setValue: (value: V) => void;
}
export declare type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;
export { propTypes };
export default function <T, V>(WrappedComponent: React.ComponentType<T & PassDownProps<V>>): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>>;
