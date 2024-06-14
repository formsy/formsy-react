import PropTypes from 'prop-types';
import React from 'react';
import { FormsyContextInterface, IModel, InputComponent, IResetModel, IUpdateInputsWithError, IUpdateInputsWithValue, ValidationError } from './interfaces';
import { PassDownProps } from './withFormsy';
declare type FormHTMLAttributesCleaned = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'>;
declare type OnSubmitCallback = (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError, event: React.SyntheticEvent<HTMLFormElement>) => void;
declare type FormElementType = string | React.ComponentType<{
    onReset?: (e: React.SyntheticEvent) => void;
    onSubmit?: (e: React.SyntheticEvent) => void;
    disabled?: boolean;
    children?: React.ReactChildren;
}>;
export interface FormsyProps extends FormHTMLAttributesCleaned {
    disabled: boolean;
    mapping: null | ((model: IModel) => IModel);
    onChange: (model: IModel, isChanged: boolean) => void;
    onInvalid: () => void;
    onReset?: () => void;
    onSubmit?: OnSubmitCallback;
    onValidSubmit?: OnSubmitCallback;
    onInvalidSubmit: OnSubmitCallback;
    onValid: () => void;
    preventDefaultSubmit?: boolean;
    preventExternalInvalidation?: boolean;
    validationErrors?: null | object;
    formElement?: FormElementType;
}
export interface FormsyState {
    canChange: boolean;
    contextValue: FormsyContextInterface;
    formSubmitted?: boolean;
    isPristine?: boolean;
    isSubmitting: boolean;
    isValid: boolean;
}
export declare class Formsy extends React.Component<FormsyProps, FormsyState> {
    inputs: InstanceType<any & PassDownProps<any>>[];
    emptyArray: any[];
    prevInputNames: any[] | null;
    static displayName: string;
    static propTypes: {
        disabled: PropTypes.Requireable<boolean>;
        mapping: PropTypes.Requireable<(...args: any[]) => any>;
        formElement: PropTypes.Requireable<string | object>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        onInvalid: PropTypes.Requireable<(...args: any[]) => any>;
        onInvalidSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        onReset: PropTypes.Requireable<(...args: any[]) => any>;
        onSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        onValid: PropTypes.Requireable<(...args: any[]) => any>;
        onValidSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        preventDefaultSubmit: PropTypes.Requireable<boolean>;
        preventExternalInvalidation: PropTypes.Requireable<boolean>;
        validationErrors: PropTypes.Requireable<object>;
    };
    static defaultProps: Partial<FormsyProps>;
    private readonly debouncedValidateForm;
    constructor(props: FormsyProps);
    componentDidMount: () => void;
    componentDidUpdate: (prevProps: FormsyProps) => void;
    getCurrentValues: () => any;
    getModel: () => any;
    getPristineValues: () => any;
    setFormPristine: (isPristine: boolean) => void;
    setInputValidationErrors: (errors: any) => void;
    setFormValidState: (allIsValid: boolean) => void;
    isValidValue: (component: any, value: any) => boolean;
    isFormDisabled: () => boolean;
    mapModel: (model: IModel) => IModel;
    reset: (model?: IModel) => void;
    private resetInternal;
    private resetModel;
    runValidation: <V>(component: InputComponent<V>, value?: V) => {
        isRequired: boolean;
        isValid: boolean;
        validationError: ValidationError[];
    };
    attachToForm: (component: any) => void;
    detachFromForm: <V>(component: InputComponent<V>) => void;
    isChanged: () => boolean;
    submit: (event?: React.SyntheticEvent<HTMLFormElement>) => void;
    updateInputsWithError: IUpdateInputsWithError;
    updateInputsWithValue: IUpdateInputsWithValue<any>;
    validate: <V>(component: InputComponent<V>) => void;
    validateForm: () => void;
    render(): React.FunctionComponentElement<React.ProviderProps<FormsyContextInterface>>;
}
export {};
