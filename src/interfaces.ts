export type IValue = any;

export interface IValues {
  [key: string]: IValue;
}

export type IValidationFunction = (values: IValues, value: IValue, extra?: any) => boolean;
