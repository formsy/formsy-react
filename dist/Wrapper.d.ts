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
    isRequired?: RequiredValidation;
    validationError?: any;
    validationErrors?: any;
    validations?: Validations | string;
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
export interface PassDownProps extends WrapperProps {
    errorMessage: any;
    errorMessages: any;
    getValue: () => Value;
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
export { propTypes };
export default function <T>(WrappedComponent: React.ComponentType<T & PassDownProps>): React.ComponentType<T & WrapperProps>;
