export declare type IValue = any;
export declare type IValues = {
    [key: string]: IValue;
};
export declare type IValidationFunction = (values: IValues, value: IValue, extra?: any) => boolean;
