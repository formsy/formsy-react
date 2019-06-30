export type Value = any;

export interface Values {
  [key: string]: Value;
}

export type IValidationFunction = (values: Values, value: Value, extra?: any) => boolean;
