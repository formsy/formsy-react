export declare type IValue = any;
export interface IValues {
    [key: string]: IValue;
}
export declare type IValidationFunction = (values: IValues, value: IValue, extra?: any) => boolean;
