import { InputRegistration, ValidationError } from './interfaces';
export interface FormState {
    values: Map<string, any>;
    initialValues: Map<string, any>;
    errors: Map<string, ValidationError[]>;
    isPristine: Map<string, boolean>;
    isValid: Map<string, boolean>;
    isRequired: Map<string, boolean>;
    inputs: Map<string, InputRegistration>;
    formSubmitted: boolean;
    formIsValid: boolean;
    isSubmitting: boolean;
    canChange: boolean;
    externalValidationErrors: Map<string, any>;
    preventExternalInvalidation: boolean;
}
export type FormAction = {
    type: 'REGISTER';
    name: string;
    config: InputRegistration;
    initialValue: any;
} | {
    type: 'UNREGISTER';
    name: string;
} | {
    type: 'SET_VALUE';
    name: string;
    value: any;
    validate: boolean;
} | {
    type: 'SET_VALUES';
    values: Map<string, any>;
    validate: boolean;
} | {
    type: 'SET_SUBMITTED';
    submitted: boolean;
} | {
    type: 'SET_EXTERNAL_ERRORS';
    errors: Map<string, any>;
    preventInvalidation: boolean;
} | {
    type: 'SET_CAN_CHANGE';
    canChange: boolean;
} | {
    type: 'VALIDATE';
} | {
    type: 'RESET';
    values?: Map<string, any>;
} | {
    type: 'UPDATE_VALIDATIONS';
    name: string;
    config: InputRegistration;
};
export declare function formsyReducer(state: FormState, action: FormAction): FormState;
