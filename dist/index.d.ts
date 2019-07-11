import React from 'react';
import PropTypes from 'prop-types';
import validationRules from './validationRules';
import Wrapper, { propTypes } from './Wrapper';
import { IModel, InputComponent, IResetModel, IUpdateInputsWithError, ValidationFunction } from './interfaces';
export interface FormsyProps {
    disabled: boolean;
    getErrorMessage: any;
    getErrorMessages: any;
    getValue: any;
    hasValue: any;
    isFormDisabled: any;
    isFormSubmitted: any;
    isPristine: any;
    isRequired: any;
    isValid: any;
    isValidValue: any;
    mapping: null | ((model: IModel) => IModel);
    onChange: (model: IModel, isChanged: boolean) => void;
    onError: any;
    onInvalid: () => void;
    onInvalidSubmit: any;
    onReset?: () => void;
    onSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
    onValid: () => void;
    onValidSubmit?: (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError) => void;
    preventExternalInvalidation?: boolean;
    resetValue: any;
    setValidations: any;
    setValue: any;
    showError: any;
    showRequired: any;
    validationErrors?: null | object;
}
export interface FormsyState {
    canChange: boolean;
    formSubmitted?: boolean;
    isPristine?: boolean;
    isSubmitting: boolean;
    isValid: boolean;
}
declare class Formsy extends React.Component<FormsyProps, FormsyState> {
    inputs: any[];
    emptyArray: any[];
    prevInputNames: any[] | null;
    static displayName: string;
    static defaultProps: Partial<FormsyProps>;
    static propTypes: {
        disabled: PropTypes.Requireable<boolean>;
        getErrorMessage: PropTypes.Requireable<(...args: any[]) => any>;
        getErrorMessages: PropTypes.Requireable<(...args: any[]) => any>;
        getValue: PropTypes.Requireable<(...args: any[]) => any>;
        hasValue: PropTypes.Requireable<(...args: any[]) => any>;
        isFormDisabled: PropTypes.Requireable<(...args: any[]) => any>;
        isFormSubmitted: PropTypes.Requireable<(...args: any[]) => any>;
        isPristine: PropTypes.Requireable<(...args: any[]) => any>;
        isRequired: PropTypes.Requireable<(...args: any[]) => any>;
        isValid: PropTypes.Requireable<(...args: any[]) => any>;
        isValidValue: PropTypes.Requireable<(...args: any[]) => any>;
        mapping: PropTypes.Requireable<(...args: any[]) => any>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        onInvalid: PropTypes.Requireable<(...args: any[]) => any>;
        onInvalidSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        onReset: PropTypes.Requireable<(...args: any[]) => any>;
        onSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        onValid: PropTypes.Requireable<(...args: any[]) => any>;
        onValidSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        preventExternalInvalidation: PropTypes.Requireable<boolean>;
        resetValue: PropTypes.Requireable<(...args: any[]) => any>;
        setValidations: PropTypes.Requireable<(...args: any[]) => any>;
        setValue: PropTypes.Requireable<(...args: any[]) => any>;
        showError: PropTypes.Requireable<(...args: any[]) => any>;
        showRequired: PropTypes.Requireable<(...args: any[]) => any>;
        validationErrors: PropTypes.Requireable<object>;
    };
    static childContextTypes: {
        formsy: PropTypes.Requireable<object>;
    };
    constructor(props: FormsyProps);
    getChildContext: () => {
        formsy: {
            attachToForm: (component: any) => void;
            detachFromForm: (component: InputComponent) => void;
            isFormDisabled: () => boolean;
            isValidValue: (component: any, value: any) => boolean;
            validate: (component: InputComponent) => void;
        };
    };
    componentDidMount: () => void;
    componentWillUpdate: () => void;
    componentDidUpdate: () => void;
    getCurrentValues: () => any;
    getModel: () => any;
    getPristineValues: () => any;
    setFormPristine: (isPristine: boolean) => void;
    setInputValidationErrors: (errors: any) => void;
    setFormValidState: (allIsValid: boolean) => void;
    isFormDisabled: () => boolean;
    mapModel: (model: any) => any;
    reset: (data?: any) => void;
    resetInternal: (event: any) => void;
    resetModel: IResetModel;
    runValidation: (component: InputComponent, value?: any) => {
        isRequired: boolean;
        isValid: boolean;
        error: any;
    };
    attachToForm: (component: any) => void;
    detachFromForm: (component: InputComponent) => void;
    isChanged: () => boolean;
    submit: (event: any) => void;
    updateInputsWithError: IUpdateInputsWithError;
    validate: (component: InputComponent) => void;
    validateForm: () => void;
    render: () => React.DetailedReactHTMLElement<{
        disabled: boolean;
        onError: any;
        children?: React.ReactNode;
        onReset: (event: any) => void;
        onSubmit: (event: any) => void;
    }, HTMLElement>;
}
declare const addValidationRule: (name: string, func: ValidationFunction) => void;
export { addValidationRule, propTypes, validationRules, Wrapper as withFormsy };
export default Formsy;
