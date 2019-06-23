import React from 'react';
import PropTypes from 'prop-types';
import validationRules from './validationRules';
import Wrapper, { propTypes } from './Wrapper';
declare class Formsy extends React.Component<any, any> {
    private inputs;
    private emptyArray;
    private prevInputNames;
    constructor(props: any);
    getChildContext: () => {
        formsy: {
            attachToForm: (component: any) => void;
            detachFromForm: (component: any) => void;
            validate: (component: any) => void;
            isFormDisabled: () => any;
            isValidValue: (component: any, value: any) => boolean;
        };
    };
    componentDidMount: () => void;
    componentWillUpdate: () => void;
    componentDidUpdate: () => void;
    getCurrentValues: () => any;
    getModel: () => any;
    getPristineValues: () => any;
    setFormPristine: (isPristine: any) => void;
    setInputValidationErrors: (errors: any) => void;
    setFormValidState: (allIsValid: any) => void;
    isFormDisabled: () => any;
    mapModel: (model: any) => any;
    reset: (data?: any) => void;
    resetInternal: (event: any) => void;
    resetModel: (data: any) => void;
    runValidation: (component: any, value?: any) => {
        isRequired: boolean;
        isValid: boolean;
        error: any;
    };
    attachToForm: (component: any) => void;
    detachFromForm: (component: any) => void;
    isChanged: () => boolean;
    submit: (event: any) => void;
    updateInputsWithError: (errors: any, invalidate: any) => void;
    validate: (component: any) => void;
    validateForm: () => void;
    render: () => React.DetailedReactHTMLElement<{
        disabled: boolean;
        children?: React.ReactNode;
        onReset: (event: any) => void;
        onSubmit: (event: any) => void;
    }, HTMLElement>;
    static displayName: string;
    static defaultProps: {
        children: any;
        disabled: boolean;
        getErrorMessage: () => void;
        getErrorMessages: () => void;
        getValue: () => void;
        hasValue: () => void;
        isFormDisabled: () => void;
        isFormSubmitted: () => void;
        isPristine: () => void;
        isRequired: () => void;
        isValid: () => void;
        isValidValue: () => void;
        mapping: any;
        onChange: () => void;
        onError: () => void;
        onInvalid: () => void;
        onInvalidSubmit: () => void;
        onReset: () => void;
        onSubmit: () => void;
        onValid: () => void;
        onValidSubmit: () => void;
        preventExternalInvalidation: boolean;
        resetValue: () => void;
        setValidations: () => void;
        setValue: () => void;
        showError: () => void;
        showRequired: () => void;
        validationErrors: any;
    };
    static propTypes: {
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
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
}
declare const addValidationRule: (name: any, func: any) => void;
export { addValidationRule, propTypes, validationRules, Wrapper as withFormsy };
export default Formsy;
