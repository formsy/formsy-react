import { ValidationError, Validations, RequiredValidation } from './interfaces';
interface UseFormsyProps<V = any> {
    name: string;
    value?: V;
    validations?: Validations<V>;
    required?: RequiredValidation<V>;
    validationError?: ValidationError;
    validationErrors?: {
        [key: string]: ValidationError;
    };
}
export interface UseFormsyOutput<V = any> {
    value: V;
    setValue: (value: V, validate?: boolean) => void;
    errorMessage: ValidationError | null;
    errorMessages: ValidationError[];
    hasValue: boolean;
    isFormDisabled: boolean;
    isFormSubmitted: boolean;
    isPristine: boolean;
    isRequired: boolean;
    isValid: boolean;
    isValidValue: (value: V) => boolean;
    resetValue: () => void;
    setValidations: (validations: Validations<V>, required: RequiredValidation<V>) => void;
    showError: boolean;
    showRequired: boolean;
}
export declare function useFormsy<V = any>(props: UseFormsyProps<V>): UseFormsyOutput<V>;
export {};
