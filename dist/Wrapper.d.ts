<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import { RequiredValidation, Validations } from './interfaces';
declare const propTypes: {
    innerRef: PropTypes.Requireable<(...args: any[]) => any>;
    name: PropTypes.Validator<string>;
    required: PropTypes.Requireable<string | boolean | object>;
    validations: PropTypes.Requireable<string | object>;
    value: PropTypes.Requireable<any>;
};
export interface WrapperProps<V> {
    innerRef?: (ref: any) => void;
    name: string;
    required?: RequiredValidation<V>;
    validationError?: any;
    validationErrors?: any;
    validations?: Validations<V>;
    value?: V;
}
export interface WrapperState<V> {
    [key: string]: unknown;
    externalError: null;
    formSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    pristineValue: any;
    validationError: any[];
    value: V;
}
export interface InjectedProps<V> {
    errorMessage: any;
    errorMessages: any;
    hasValue: boolean;
    isFormDisabled: boolean;
    isFormSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    isValidValue: (value: V) => boolean;
    ref?: any;
    resetValue: any;
    setValidations: any;
    setValue: (value: V) => void;
    showError: boolean;
    showRequired: boolean;
}
export declare type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;
export { propTypes };
export default function <T, V>(WrappedComponent: React.ComponentType<T & PassDownProps<V>>): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>>;
=======
import React from 'react';
import PropTypes from 'prop-types';
import { RequiredValidation, Validations } from './interfaces';
declare const propTypes: {
    innerRef: PropTypes.Requireable<(...args: any[]) => any>;
    name: PropTypes.Validator<string>;
    required: PropTypes.Requireable<string | boolean | object>;
    validations: PropTypes.Requireable<string | object>;
    value: PropTypes.Requireable<any>;
};
export interface WrapperProps<V> {
    innerRef?: (ref: any) => void;
    name: string;
    required?: RequiredValidation<V>;
    validationError?: any;
    validationErrors?: any;
    validations?: Validations<V>;
    value?: V;
}
export interface WrapperState<V> {
    [key: string]: unknown;
    externalError: null;
    formSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    pristineValue: any;
    validationError: any[];
    value: V;
}
export interface InjectedProps<V> {
    errorMessage: any;
    errorMessages: any;
    hasValue: boolean;
    isFormDisabled: boolean;
    isFormSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    isValidValue: (value: V) => boolean;
    ref?: any;
    resetValue: () => void;
    setValidations: (validations: Validations<V>, required: RequiredValidation<V>) => void;
    setValue: (value: V) => void;
    showError: boolean;
    showRequired: boolean;
}
export interface WrapperInstanceMethods {
    isValid: () => boolean;
    getValue: () => any;
    getErrorMessage: () => any;
}
export declare type PassDownProps<V> = WrapperProps<V> & InjectedProps<V>;
export { propTypes };
export default function <T, V>(WrappedComponent: React.ComponentType<T & PassDownProps<V>>): React.ComponentType<Omit<T & WrapperProps<V>, keyof InjectedProps<V>>>;
>>>>>>> 100%
