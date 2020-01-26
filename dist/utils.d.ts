import { Validations, Values } from './interfaces';
export declare function arraysDiffer(a: unknown[], b: unknown[]): boolean;
export declare function objectsDiffer(a: object, b: object): boolean;
export declare function isSame(a: unknown, b: unknown): boolean;
export declare function find<T>(collection: T[], fn: (item: T) => boolean): T;
export declare function runRules<V>(value: V, currentValues: Values, validations: Validations<V>, validationRules: Validations<V>): {
    errors: string[];
    failed: string[];
    success: string[];
};
export declare function noop(): void;
export declare function cloneIfObject(value: unknown): unknown;
