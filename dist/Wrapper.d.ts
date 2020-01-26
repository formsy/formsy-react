import React from 'react';
import PropTypes from 'prop-types';
import { Validations, RequiredValidation, Value } from './interfaces';
declare const propTypes: {
    innerRef: PropTypes.Requireable<(...args: any[]) => any>;
    name: PropTypes.Validator<string>;
    required: PropTypes.Requireable<string | boolean | object>;
    validations: PropTypes.Requireable<string | object>;
    value: PropTypes.Requireable<any>;
};
export interface WrapperProps {
    innerRef?: (ref: any) => void;
    name: string;
    required?: RequiredValidation;
    validationError?: any;
    validationErrors?: any;
    validations?: Validations;
    value?: Value;
}
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
export interface InjectedProps {
    errorMessage: any;
    errorMessages: any;
    hasValue: boolean;
    isFormDisabled: boolean;
    isFormSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    isValidValue: (value: Value) => boolean;
    ref?: any;
    resetValue: any;
    setValidations: any;
    setValue: (value: Value) => void;
    showError: boolean;
    showRequired: boolean;
}
export declare type PassDownProps = WrapperProps & InjectedProps;
export { propTypes };
export default function <T>(WrappedComponent: React.ComponentType<T & PassDownProps>): React.ComponentType<Omit<T & WrapperProps, keyof InjectedProps>>;
