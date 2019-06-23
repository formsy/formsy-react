declare const _default: {
    arraysDiffer(a: any, b: any): boolean;
    objectsDiffer(a: any, b: any): boolean;
    isSame(a: any, b: any): boolean;
    find(collection: any, fn: any): any;
    runRules(value: any, currentValues: any, validations: any, validationRules: any): {
        errors: any[];
        failed: any[];
        success: any[];
    };
};
export default _default;
