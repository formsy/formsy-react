import { ValidationFunction, Values } from './interfaces';
export declare function isExisty<V>(value: V): boolean;
export declare function isEmpty<V>(value: V): boolean;
export declare function isDefaultRequiredValue(value: unknown): boolean;
export declare function matchRegexp<V>(_values: Values, value: V, regexp: RegExp): boolean;
interface Validations<V> {
    [key: string]: ValidationFunction<V>;
}
declare const validations: Validations<any>;
export default validations;
