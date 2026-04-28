import { ValidationFunction, Values } from './interfaces';
export declare function isExisty<V>(value: V): boolean;
export declare function isEmpty<V>(value: V): boolean;
export declare function isDefaultRequiredValue(value: unknown): boolean;
export declare function matchRegexp<V>(_values: Values, value: V, regexp: RegExp): boolean;
interface Validations<V> {
    [key: string]: ValidationFunction<V>;
}
export declare const validationRules: Validations<any>;
export declare const addValidationRule: <V>(name: string, func: ValidationFunction<V>) => void;
export {};
