import React, { PropsWithChildren } from 'react';
import { FormsyImperativeAPI, IModel, IResetModel, IUpdateInputsWithError } from './interfaces';
type FormHTMLAttributesCleaned = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'>;
type OnSubmitCallback = (model: IModel, resetModel: IResetModel, updateInputsWithError: IUpdateInputsWithError, event: React.SyntheticEvent<HTMLFormElement>) => void;
type FormElementType = string | React.ComponentType<PropsWithChildren<{
    onReset?: (e: React.SyntheticEvent) => void;
    onSubmit?: (e: React.SyntheticEvent) => void;
    disabled?: boolean;
}>>;
export interface FormsyProps extends FormHTMLAttributesCleaned {
    disabled?: boolean;
    mapping?: null | ((model: IModel) => IModel);
    onChange?: (model: IModel, isChanged: boolean) => void;
    onInvalid?: () => void;
    onReset?: () => void;
    onSubmit?: OnSubmitCallback;
    onValidSubmit?: OnSubmitCallback;
    onInvalidSubmit?: OnSubmitCallback;
    onValid?: () => void;
    preventDefaultSubmit?: boolean;
    preventExternalInvalidation?: boolean;
    validationErrors?: null | object;
    formElement?: FormElementType;
}
declare function FormsyInner(props: PropsWithChildren<FormsyProps>, ref: React.Ref<FormsyImperativeAPI>): React.JSX.Element;
declare namespace FormsyInner {
    var displayName: string;
}
declare const Formsy: React.ForwardRefExoticComponent<FormsyProps & {
    children?: React.ReactNode | undefined;
} & React.RefAttributes<FormsyImperativeAPI>>;
export default Formsy;
export { FormsyInner as Formsy };
