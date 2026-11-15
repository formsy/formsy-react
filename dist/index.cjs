"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = (exports1, getters, values)=>{
        var define = (defs, kind)=>{
            for(var key in defs)if (__webpack_require__.o(defs, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
                enumerable: true,
                [kind]: defs[key]
            });
        };
        define(getters, "get");
        define(values, "value");
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ("u" > typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    addValidationRule: ()=>addValidationRule,
    default: ()=>src,
    useFormsy: ()=>useFormsy,
    validationRules: ()=>validationRules_validationRules,
    withFormsy: ()=>withFormsy
});
const isPlainObject_js_namespaceObject = require("lodash/isPlainObject.js");
var isPlainObject_js_default = /*#__PURE__*/ __webpack_require__.n(isPlainObject_js_namespaceObject);
function isArray(value) {
    return Array.isArray(value);
}
function isObject(value) {
    return isPlainObject_js_default()(value);
}
function isTypeUndefined(value) {
    return void 0 === value;
}
function isDate(value) {
    return value instanceof Date;
}
function isFunction(value) {
    return null !== value && 'function' == typeof value;
}
function isString(value) {
    return 'string' == typeof value;
}
function isNumber(value) {
    return 'number' == typeof value;
}
function isRegex(value) {
    return value instanceof RegExp;
}
function isValueStringEmpty(value) {
    return '' === value;
}
function isValueNullOrUndefined(value) {
    return null == value;
}
function isValueUndefined(value) {
    return void 0 === value;
}
function isSame(a, b) {
    if (typeof a !== typeof b) return false;
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index)=>isSame(item, b[index]));
    }
    if (isFunction(a) && isFunction(b)) return a.toString() === b.toString();
    if (isDate(a) && isDate(b)) return a.toString() === b.toString();
    if (isObject(a) && isObject(b)) {
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        return Object.keys(a).every((key)=>isSame(a[key], b[key]));
    }
    if (isRegex(a) && isRegex(b)) return a.toString() === b.toString();
    return a === b;
}
function runRules(value, currentValues, validations, validationRules) {
    const results = {
        errors: [],
        failed: [],
        success: []
    };
    Object.keys(validations).forEach((validationName)=>{
        const validationsVal = validations[validationName];
        const validationRulesVal = validationRules[validationName];
        const addToResults = (validation)=>{
            if (isString(validation)) {
                results.errors.push(validation);
                results.failed.push(validationName);
            } else if (validation) results.success.push(validationName);
            else results.failed.push(validationName);
        };
        if (validationRulesVal && isFunction(validationsVal)) throw new Error(`Formsy does not allow you to override default validations: ${validationName}`);
        if (!validationRulesVal && !isFunction(validationsVal)) throw new Error(`Formsy does not have the validation rule: ${validationName}`);
        if (isFunction(validationsVal)) return addToResults(validationsVal(currentValues, value));
        return addToResults(validationRulesVal(currentValues, value, validationsVal));
    });
    return results;
}
function isExisty(value) {
    return !isValueNullOrUndefined(value);
}
function isEmpty(value) {
    if (isString(value)) return isValueStringEmpty(value);
    if (isTypeUndefined(value)) return false;
    return isValueUndefined(value);
}
function isDefaultRequiredValue(value) {
    return isString(value) ? isValueStringEmpty(value) : isValueNullOrUndefined(value);
}
function matchRegexp(_values, value, regexp) {
    return !isExisty(value) || isEmpty(value) || regexp.test(`${value}`);
}
const REGEX_PATTERNS = {
    ALPHA: /^[A-Z]+$/i,
    ALPHANUMERIC: /^[0-9A-Z]+$/i,
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    FLOAT: /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/,
    INT: /^(?:[-+]?(?:0|[1-9]\d*))$/,
    NUMERIC: /^[-+]?(?:\d*[.])?\d+$/,
    SPECIAL_WORDS: /^[\sA-ZÀ-ÖØ-öø-ÿ]+$/i,
    URL: /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i,
    WORDS: /^[A-Z\s]+$/i
};
const validationRules_validationRules = {
    equals: (_values, value, eql)=>!isExisty(value) || isEmpty(value) || value === eql,
    equalsField: (values, value, field)=>value === values[field],
    isAlpha: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.ALPHA),
    isAlphanumeric: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.ALPHANUMERIC),
    isDefaultRequiredValue: (_values, value)=>isDefaultRequiredValue(value),
    isEmail: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.EMAIL),
    isEmptyString: (_values, value)=>isEmpty(value),
    isExisty: (_values, value)=>isExisty(value),
    isFalse: (_values, value)=>false === value,
    isFloat: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.FLOAT),
    isInt: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.INT),
    isLength: (_values, value, length)=>!isExisty(value) || isEmpty(value) || value.length === length,
    isNumeric: (values, value)=>isNumber(value) || matchRegexp(values, value, REGEX_PATTERNS.NUMERIC),
    isSpecialWords: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.SPECIAL_WORDS),
    isTrue: (_values, value)=>true === value,
    isUndefined: (_values, value)=>isValueUndefined(value),
    isUrl: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.URL),
    isWords: (values, value)=>matchRegexp(values, value, REGEX_PATTERNS.WORDS),
    matchRegexp,
    maxLength: (_values, value, length)=>!isExisty(value) || value.length <= length,
    minLength: (_values, value, length)=>!isExisty(value) || isEmpty(value) || value.length >= length
};
const addValidationRule = (name, func)=>{
    validationRules_validationRules[name] = func;
};
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const noFormsyErrorMessage = 'Could not find Formsy Context Provider. Did you use useFormsy or withFormsy outside <Formsy />?';
const throwNoFormsyProvider = ()=>{
    throw new Error(noFormsyErrorMessage);
};
const defaultStore = {
    subscribe: ()=>{
        throwNoFormsyProvider();
        return ()=>void 0;
    },
    getState: ()=>{
        throwNoFormsyProvider();
    },
    getDisabled: ()=>{
        throwNoFormsyProvider();
        return false;
    }
};
const FormsyActionsContext = /*#__PURE__*/ external_react_default().createContext({
    setValue: throwNoFormsyProvider,
    registerInput: throwNoFormsyProvider,
    unregisterInput: throwNoFormsyProvider,
    resetValue: throwNoFormsyProvider,
    updateValidations: throwNoFormsyProvider,
    isValidValue: ()=>{
        throwNoFormsyProvider();
        return false;
    }
});
const FormsyStateStoreContext = /*#__PURE__*/ external_react_default().createContext(defaultStore);
const EMPTY_ERRORS = [];
function areSnapshotsEqual(a, b) {
    return Object.is(a.value, b.value) && a.isPristine === b.isPristine && a.isRequired === b.isRequired && a.isValid === b.isValid && a.isFormDisabled === b.isFormDisabled && a.isFormSubmitted === b.isFormSubmitted && a.errors.length === b.errors.length && a.errors.every((error, index)=>error === b.errors[index]);
}
const convertValidationsToObject = (validations)=>{
    if (isString(validations)) return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation)=>{
        let args = validation.split(':');
        const validateMethod = args.shift() || '';
        args = args.map((arg)=>{
            try {
                return JSON.parse(arg);
            } catch  {
                return arg;
            }
        });
        if (args.length > 1) throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
        const validationsAccumulatorCopy = {
            ...validationsAccumulator
        };
        validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
        return validationsAccumulatorCopy;
    }, {});
    return validations || {};
};
function computeLocalValidation(value, validations, requiredValidations, validationError, validationErrors) {
    const currentValues = {};
    const validationResults = runRules(value, currentValues, validations || {}, validationRules_validationRules);
    const requiredResults = runRules(value, currentValues, requiredValidations || {}, validationRules_validationRules);
    const isRequired = Object.keys(requiredValidations || {}).length ? !!requiredResults.success.length : false;
    const isCustomValid = !validationResults.failed.length;
    const isValid = isRequired ? false : isCustomValid;
    const errors = (()=>{
        if (isValid && !isRequired) return [];
        if (validationResults.errors.length) return validationResults.errors;
        if (isRequired) {
            const error = (validationErrors || {})[requiredResults.success[0]] || validationError;
            return error ? [
                error
            ] : [];
        }
        if (validationResults.failed.length) return validationResults.failed.map((failed)=>(validationErrors || {})[failed] || validationError).filter((x, pos, arr)=>arr.indexOf(x) === pos).filter(Boolean);
        return [];
    })();
    return {
        isRequired,
        isValid,
        errors
    };
}
function useFormsy(props) {
    const actions = (0, external_react_namespaceObject.useContext)(FormsyActionsContext);
    const stateStore = (0, external_react_namespaceObject.useContext)(FormsyStateStoreContext);
    const { isValidValue: validateValue, registerInput, resetValue: resetFieldValue, setValue: setFieldValue, unregisterInput, updateValidations } = actions;
    const { name, value: externalValue, validations, required, validationError, validationErrors } = props;
    const prevExternalValue = (0, external_react_namespaceObject.useRef)(externalValue);
    const previousSnapshot = (0, external_react_namespaceObject.useRef)(null);
    const registrationRef = (0, external_react_namespaceObject.useRef)();
    const convertRequired = (required)=>{
        if (true === required) return {
            isDefaultRequiredValue: true
        };
        return convertValidationsToObject(required);
    };
    if (!name) throw new Error('Form Input requires a name property when used');
    if (!registrationRef.current) registrationRef.current = {
        validations: convertValidationsToObject(validations),
        requiredValidations: convertRequired(required),
        validationError,
        validationErrors
    };
    const getSnapshot = (0, external_react_namespaceObject.useCallback)(()=>{
        const state = stateStore.getState();
        if (!state.inputs.has(name)) {
            previousSnapshot.current = null;
            return null;
        }
        const snapshot = {
            value: state.values.get(name),
            errors: state.errors.get(name) || EMPTY_ERRORS,
            isPristine: state.isPristine.get(name) ?? true,
            isRequired: state.isRequired.get(name) ?? false,
            isValid: state.isValid.get(name) ?? true,
            isFormDisabled: stateStore.getDisabled(),
            isFormSubmitted: state.formSubmitted
        };
        if (previousSnapshot.current && areSnapshotsEqual(previousSnapshot.current, snapshot)) return previousSnapshot.current;
        previousSnapshot.current = snapshot;
        return snapshot;
    }, [
        name,
        stateStore
    ]);
    const fieldState = (0, external_react_namespaceObject.useSyncExternalStore)(stateStore.subscribe, getSnapshot, getSnapshot);
    (0, external_react_namespaceObject.useLayoutEffect)(()=>{
        registerInput(name, registrationRef.current, prevExternalValue.current);
        prevExternalValue.current = externalValue;
        return ()=>{
            unregisterInput(name);
        };
    }, [
        name
    ]);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (!isSame(externalValue, prevExternalValue.current)) {
            prevExternalValue.current = externalValue;
            if (void 0 !== externalValue) setFieldValue(name, externalValue);
        }
    }, [
        externalValue,
        name,
        setFieldValue
    ]);
    (0, external_react_namespaceObject.useLayoutEffect)(()=>{
        updateValidations(name, {
            validations: convertValidationsToObject(validations),
            requiredValidations: convertRequired(required),
            validationError,
            validationErrors
        });
    }, [
        updateValidations,
        name,
        validations,
        required,
        validationError,
        validationErrors
    ]);
    const localVal = (0, external_react_namespaceObject.useMemo)(()=>computeLocalValidation(externalValue, convertValidationsToObject(validations), convertRequired(required), validationError, validationErrors), [
        externalValue,
        validations,
        required,
        validationError,
        validationErrors
    ]);
    const inputValue = fieldState ? fieldState.value : externalValue;
    const errors = fieldState ? fieldState.errors : localVal.errors;
    const isPristine = fieldState ? fieldState.isPristine : true;
    const isValid = fieldState ? fieldState.isValid : localVal.isValid;
    const isRequired = fieldState ? fieldState.isRequired : localVal.isRequired;
    const setValue = (0, external_react_namespaceObject.useCallback)((value, validate = true)=>{
        setFieldValue(name, value, validate);
    }, [
        name,
        setFieldValue
    ]);
    const resetValue = (0, external_react_namespaceObject.useCallback)(()=>{
        resetFieldValue(name);
    }, [
        name,
        resetFieldValue
    ]);
    const isValidValue = (0, external_react_namespaceObject.useCallback)((value)=>validateValue(name, value), [
        name,
        validateValue
    ]);
    const setValidations = (0, external_react_namespaceObject.useCallback)((validations, required)=>{
        updateValidations(name, {
            validations: convertValidationsToObject(validations),
            requiredValidations: convertRequired(required),
            validationError,
            validationErrors
        });
    }, [
        name,
        updateValidations,
        validationError,
        validationErrors
    ]);
    return {
        value: inputValue,
        setValue,
        errorMessage: errors.length ? errors[0] : null,
        errorMessages: errors.length ? errors : EMPTY_ERRORS,
        hasValue: !isDefaultRequiredValue(inputValue),
        isFormDisabled: fieldState?.isFormDisabled ?? stateStore.getDisabled(),
        isFormSubmitted: fieldState?.isFormSubmitted ?? false,
        isPristine,
        isRequired,
        isValid,
        isValidValue,
        resetValue,
        setValidations,
        showError: !isRequired && !isValid,
        showRequired: isRequired
    };
}
function getDisplayName(component) {
    return component.displayName || component.name || (isString(component) ? component : 'Component');
}
function withFormsy(WrappedComponent) {
    const MemoizedWrappedComponent = /*#__PURE__*/ external_react_default().memo(WrappedComponent);
    const WithFormsy = (props)=>{
        const formsyProps = useFormsy(props);
        const allProps = {
            ...props,
            ...formsyProps
        };
        if (props.innerRef) allProps.ref = props.innerRef;
        return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(MemoizedWrappedComponent, {
            ...allProps
        });
    };
    WithFormsy.displayName = `Formsy(${getDisplayName(WrappedComponent)})`;
    return WithFormsy;
}
const set_js_namespaceObject = require("lodash/set.js");
var set_js_default = /*#__PURE__*/ __webpack_require__.n(set_js_namespaceObject);
const has_js_namespaceObject = require("lodash/has.js");
var has_js_default = /*#__PURE__*/ __webpack_require__.n(has_js_namespaceObject);
const get_js_namespaceObject = require("lodash/get.js");
var get_js_default = /*#__PURE__*/ __webpack_require__.n(get_js_namespaceObject);
function runSingleValidation(value, allValues, input, externalError) {
    const currentValues = Object.fromEntries(allValues);
    const validationResults = runRules(value, currentValues, input.validations || {}, validationRules_validationRules);
    const requiredResults = runRules(value, currentValues, input.requiredValidations || {}, validationRules_validationRules);
    const isRequired = Object.keys(input.requiredValidations || {}).length ? !!requiredResults.success.length : false;
    const isCustomValid = !validationResults.failed.length;
    const isValid = isRequired ? false : isCustomValid && !externalError;
    const validationErrors = input.validationErrors || {};
    const componentValidationError = input.validationError;
    const validationError = (()=>{
        if (isValid && !isRequired) return [];
        if (validationResults.errors.length) return validationResults.errors;
        if (externalError) return isString(externalError) ? [
            externalError
        ] : [
            externalError
        ];
        if (isRequired) {
            const error = validationErrors[requiredResults.success[0]] || componentValidationError;
            return error ? [
                error
            ] : null;
        }
        if (validationResults.failed.length) return validationResults.failed.map((failed)=>validationErrors[failed] ? validationErrors[failed] : componentValidationError).filter((x, pos, arr)=>arr.indexOf(x) === pos);
        return [];
    })();
    return {
        isRequired,
        isValid,
        validationError: validationError || []
    };
}
function validateAll(state) {
    const newErrors = new Map();
    const newIsValid = new Map();
    const newIsRequired = new Map();
    let formIsValid = true;
    state.inputs.forEach((input, name)=>{
        const value = state.values.get(name);
        const externalError = state.externalValidationErrors.get(name);
        const result = runSingleValidation(value, state.values, input, externalError);
        const prevented = state.preventExternalInvalidation && state.externalValidationErrors.has(name);
        newErrors.set(name, result.validationError);
        newIsValid.set(name, prevented ? true : result.isValid);
        newIsRequired.set(name, result.isRequired);
        if (!newIsValid.get(name)) formIsValid = false;
    });
    return {
        ...state,
        errors: newErrors,
        isValid: newIsValid,
        isRequired: newIsRequired,
        formIsValid
    };
}
function formsyReducer(state, action) {
    switch(action.type){
        case 'REGISTER':
            {
                if (!action.name) return state;
                if (state.inputs.has(action.name)) return state;
                const newInputs = new Map(state.inputs).set(action.name, action.config);
                const newValues = new Map(state.values).set(action.name, action.initialValue);
                const newInitialValues = new Map(state.initialValues).set(action.name, action.initialValue);
                const newPristine = new Map(state.isPristine).set(action.name, true);
                let newState = {
                    ...state,
                    inputs: newInputs,
                    values: newValues,
                    initialValues: newInitialValues,
                    isPristine: newPristine
                };
                newState = validateAll(newState);
                return newState;
            }
        case 'UNREGISTER':
            {
                if (!state.inputs.has(action.name)) return state;
                const newInputs = new Map(state.inputs);
                newInputs.delete(action.name);
                const newValues = new Map(state.values);
                newValues.delete(action.name);
                const newInitialValues = new Map(state.initialValues);
                newInitialValues.delete(action.name);
                const newErrors = new Map(state.errors);
                newErrors.delete(action.name);
                const newPristine = new Map(state.isPristine);
                newPristine.delete(action.name);
                const newIsValid = new Map(state.isValid);
                newIsValid.delete(action.name);
                const newIsRequired = new Map(state.isRequired);
                newIsRequired.delete(action.name);
                let newState = {
                    ...state,
                    inputs: newInputs,
                    values: newValues,
                    initialValues: newInitialValues,
                    errors: newErrors,
                    isPristine: newPristine,
                    isValid: newIsValid,
                    isRequired: newIsRequired
                };
                newState = validateAll(newState);
                return newState;
            }
        case 'SET_VALUE':
            {
                const newValues = new Map(state.values).set(action.name, action.value);
                const newPristine = action.validate ? new Map(state.isPristine).set(action.name, false) : state.isPristine;
                const newExternalErrors = new Map(state.externalValidationErrors);
                newExternalErrors.delete(action.name);
                let newState = {
                    ...state,
                    values: newValues,
                    isPristine: newPristine,
                    externalValidationErrors: newExternalErrors
                };
                if (action.validate) newState = validateAll(newState);
                return newState;
            }
        case 'SET_VALUES':
            {
                const newValues = new Map(state.values);
                action.values.forEach((value, name)=>{
                    newValues.set(name, value);
                });
                const newState = {
                    ...state,
                    values: newValues
                };
                return action.validate ? validateAll(newState) : newState;
            }
        case 'SET_SUBMITTED':
            return {
                ...state,
                formSubmitted: action.submitted
            };
        case 'SET_EXTERNAL_ERRORS':
            {
                const { errors, preventInvalidation } = action;
                return validateAll({
                    ...state,
                    externalValidationErrors: errors,
                    preventExternalInvalidation: preventInvalidation
                });
            }
        case 'SET_CAN_CHANGE':
            return {
                ...state,
                canChange: action.canChange
            };
        case 'VALIDATE':
            return validateAll(state);
        case 'RESET':
            {
                const newValues = new Map(state.values);
                const newPristine = new Map(state.isPristine);
                if (action.values) action.values.forEach((value, name)=>{
                    newValues.set(name, value);
                    newPristine.set(name, true);
                });
                else state.inputs.forEach((_input, name)=>{
                    newValues.set(name, state.initialValues.get(name));
                    newPristine.set(name, true);
                });
                let newState = {
                    ...state,
                    values: newValues,
                    isPristine: newPristine,
                    formSubmitted: action.values ? state.formSubmitted : false
                };
                newState = validateAll(newState);
                return newState;
            }
        case 'UPDATE_VALIDATIONS':
            {
                if (!state.inputs.has(action.name)) return state;
                const newInputs = new Map(state.inputs).set(action.name, action.config);
                return validateAll({
                    ...state,
                    inputs: newInputs
                });
            }
        default:
            return state;
    }
}
function getInitialState() {
    return {
        values: new Map(),
        initialValues: new Map(),
        errors: new Map(),
        isPristine: new Map(),
        isValid: new Map(),
        isRequired: new Map(),
        inputs: new Map(),
        formSubmitted: false,
        formIsValid: true,
        isSubmitting: false,
        canChange: false,
        externalValidationErrors: new Map(),
        preventExternalInvalidation: false
    };
}
function FormsyInner(props, ref) {
    const { children, mapping, onChange, onInvalid, onInvalidSubmit, onReset, onSubmit, onValid, onValidSubmit, preventDefaultSubmit = true, preventExternalInvalidation = false, validationErrors, disabled = false, formElement = 'form', ...nonFormsyProps } = props;
    const [formState, dispatch] = (0, external_react_namespaceObject.useReducer)(formsyReducer, void 0, getInitialState);
    const stateStoreRef = (0, external_react_namespaceObject.useRef)();
    if (!stateStoreRef.current) {
        const listeners = new Set();
        stateStoreRef.current = {
            state: formState,
            disabled,
            listeners,
            subscribe: (listener)=>{
                listeners.add(listener);
                return ()=>listeners.delete(listener);
            },
            getState: ()=>stateStoreRef.current.state,
            getDisabled: ()=>stateStoreRef.current.disabled
        };
    }
    const stateStore = stateStoreRef.current;
    const prevValidationErrorsRef = (0, external_react_namespaceObject.useRef)(null);
    const onChangeRef = (0, external_react_namespaceObject.useRef)(onChange);
    const onValidRef = (0, external_react_namespaceObject.useRef)(onValid);
    const onInvalidRef = (0, external_react_namespaceObject.useRef)(onInvalid);
    const mappingRef = (0, external_react_namespaceObject.useRef)(mapping);
    const disabledRef = (0, external_react_namespaceObject.useRef)(disabled);
    const formStateRef = (0, external_react_namespaceObject.useRef)(formState);
    onChangeRef.current = onChange;
    onValidRef.current = onValid;
    onInvalidRef.current = onInvalid;
    mappingRef.current = mapping;
    disabledRef.current = disabled;
    formStateRef.current = formState;
    const mapModel = (0, external_react_namespaceObject.useCallback)((model)=>{
        const mappingFn = mappingRef.current;
        if ('function' == typeof mappingFn) return mappingFn(model);
        const returnModel = {};
        Object.keys(model).forEach((key)=>{
            set_js_default()(returnModel, key, model[key]);
        });
        return returnModel;
    }, []);
    const getPristineValues = (0, external_react_namespaceObject.useCallback)(()=>Object.fromEntries(formState.initialValues), [
        formState.initialValues
    ]);
    const handleReset = (0, external_react_namespaceObject.useCallback)((model)=>{
        if (model) {
            const modelMap = new Map();
            formStateRef.current.inputs.forEach((_input, name)=>{
                if (has_js_default()(model, name)) modelMap.set(name, get_js_default()(model, name));
            });
            dispatch({
                type: 'RESET',
                values: modelMap
            });
        } else dispatch({
            type: 'RESET'
        });
    }, []);
    const handleUpdateInputsWithError = (0, external_react_namespaceObject.useCallback)((errors, invalidate)=>{
        const errorsMap = new Map();
        Object.entries(errors).forEach(([name, error])=>{
            if (!formStateRef.current.inputs.has(name) && true === invalidate) throw new Error(`You are trying to update an input that does not exist. Verify errors object with input names. ${JSON.stringify(errors)}`);
            errorsMap.set(name, error);
        });
        dispatch({
            type: 'SET_EXTERNAL_ERRORS',
            errors: errorsMap,
            preventInvalidation: preventExternalInvalidation
        });
    }, [
        preventExternalInvalidation
    ]);
    const handleUpdateInputsWithValue = (0, external_react_namespaceObject.useCallback)((data, validate = true)=>{
        const valuesToSet = new Map();
        formState.inputs.forEach((_input, name)=>{
            if (data && has_js_default()(data, name)) valuesToSet.set(name, get_js_default()(data, name));
        });
        if (valuesToSet.size > 0) dispatch({
            type: 'SET_VALUES',
            values: valuesToSet,
            validate
        });
    }, [
        formState.inputs
    ]);
    const handleSubmit = (0, external_react_namespaceObject.useCallback)((event)=>{
        const currentState = formStateRef.current;
        const { formIsValid } = currentState;
        if (preventDefaultSubmit && event?.preventDefault) event.preventDefault();
        dispatch({
            type: 'SET_SUBMITTED',
            submitted: true
        });
        dispatch({
            type: 'SET_CAN_CHANGE',
            canChange: true
        });
        const model = mapModel(Object.fromEntries(currentState.values));
        const submitEvent = event;
        onSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);
        if (formIsValid) onValidSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);
        else onInvalidSubmit?.(model, handleReset, handleUpdateInputsWithError, submitEvent);
    }, [
        preventDefaultSubmit,
        onSubmit,
        onValidSubmit,
        onInvalidSubmit,
        handleReset,
        handleUpdateInputsWithError,
        mapModel
    ]);
    (0, external_react_namespaceObject.useImperativeHandle)(ref, ()=>({
            submit: handleSubmit,
            reset: handleReset,
            updateInputsWithValue: handleUpdateInputsWithValue,
            updateInputsWithError: handleUpdateInputsWithError,
            isChanged: ()=>!isSame(getPristineValues(), Object.fromEntries(formStateRef.current.values)),
            getModel: ()=>mapModel(Object.fromEntries(formStateRef.current.values)),
            getPristineValues: ()=>getPristineValues(),
            getCurrentValues: ()=>Object.fromEntries(formStateRef.current.values)
        }));
    const canChangeRef = (0, external_react_namespaceObject.useRef)(false);
    const initialEventsFired = (0, external_react_namespaceObject.useRef)(false);
    (0, external_react_namespaceObject.useEffect)(()=>{
        canChangeRef.current = true;
    }, []);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (formState.inputs.size > 0) {
            initialEventsFired.current = true;
            if (formState.formIsValid) onValidRef.current?.();
            else onInvalidRef.current?.();
        } else if (initialEventsFired.current) onValidRef.current?.();
    }, [
        formState.inputs,
        formState.formIsValid
    ]);
    (0, external_react_namespaceObject.useLayoutEffect)(()=>{
        stateStore.state = formState;
        stateStore.disabled = disabled;
        stateStore.listeners.forEach((listener)=>listener());
    }, [
        stateStore,
        formState,
        disabled
    ]);
    const handleSetValue = (0, external_react_namespaceObject.useCallback)((name, value, validate = true)=>{
        dispatch({
            type: 'SET_VALUE',
            name,
            value,
            validate
        });
        if (canChangeRef.current) {
            const state = formStateRef.current;
            const newValues = new Map(state.values);
            newValues.set(name, value);
            const model = mapModel(Object.fromEntries(newValues));
            const changed = !isSame(Object.fromEntries(state.initialValues), Object.fromEntries(newValues));
            onChangeRef.current?.(model, changed);
        }
    }, [
        mapModel
    ]);
    const handleRegisterInput = (0, external_react_namespaceObject.useCallback)((name, config, initialValue)=>{
        dispatch({
            type: 'REGISTER',
            name,
            config,
            initialValue
        });
        if (canChangeRef.current) {
            const state = formStateRef.current;
            const newValues = new Map(state.values);
            newValues.set(name, initialValue);
            const newInitialValues = new Map(state.initialValues);
            if (!newInitialValues.has(name)) newInitialValues.set(name, initialValue);
            const model = mapModel(Object.fromEntries(newValues));
            const changed = !isSame(Object.fromEntries(newInitialValues), Object.fromEntries(newValues));
            onChangeRef.current?.(model, changed);
        }
    }, [
        mapModel
    ]);
    const handleUnregisterInput = (0, external_react_namespaceObject.useCallback)((name)=>{
        dispatch({
            type: 'UNREGISTER',
            name
        });
        if (canChangeRef.current) {
            const state = formStateRef.current;
            const newValues = new Map(state.values);
            newValues.delete(name);
            const model = mapModel(Object.fromEntries(newValues));
            onChangeRef.current?.(model, true);
        }
    }, [
        mapModel
    ]);
    const handleResetValue = (0, external_react_namespaceObject.useCallback)((name)=>{
        const currentState = formStateRef.current;
        const modelMap = new Map();
        modelMap.set(name, currentState.initialValues.get(name));
        dispatch({
            type: 'RESET',
            values: modelMap
        });
    }, []);
    const handleUpdateValidations = (0, external_react_namespaceObject.useCallback)((name, config)=>{
        dispatch({
            type: 'UPDATE_VALIDATIONS',
            name,
            config
        });
    }, []);
    const handleIsValidValue = (0, external_react_namespaceObject.useCallback)((name, value)=>{
        const state = formStateRef.current;
        const input = state.inputs.get(name);
        if (!input) return true;
        const allValues = Object.fromEntries(new Map(state.values).set(name, value));
        const results = runRules(value, allValues, input.validations || {}, validationRules_validationRules);
        return !results.failed.length;
    }, []);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if (validationErrors && isObject(validationErrors) && Object.keys(validationErrors).length > 0) {
            prevValidationErrorsRef.current = validationErrors;
            const errorsMap = new Map();
            Object.keys(validationErrors).forEach((key)=>{
                errorsMap.set(key, validationErrors[key]);
            });
            dispatch({
                type: 'SET_EXTERNAL_ERRORS',
                errors: errorsMap,
                preventInvalidation: preventExternalInvalidation
            });
        } else if (prevValidationErrorsRef.current) {
            prevValidationErrorsRef.current = null;
            dispatch({
                type: 'SET_EXTERNAL_ERRORS',
                errors: new Map(),
                preventInvalidation: preventExternalInvalidation
            });
        }
    }, [
        validationErrors,
        preventExternalInvalidation
    ]);
    const actions = (0, external_react_namespaceObject.useMemo)(()=>({
            setValue: handleSetValue,
            registerInput: handleRegisterInput,
            unregisterInput: handleUnregisterInput,
            resetValue: handleResetValue,
            updateValidations: handleUpdateValidations,
            isValidValue: handleIsValidValue
        }), [
        handleIsValidValue,
        handleRegisterInput,
        handleResetValue,
        handleSetValue,
        handleUnregisterInput,
        handleUpdateValidations
    ]);
    const FormElement = formElement || 'form';
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(FormsyActionsContext.Provider, {
        value: actions,
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(FormsyStateStoreContext.Provider, {
            value: stateStore,
            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(FormElement, {
                onReset: (e)=>{
                    e.preventDefault();
                    handleReset();
                    onReset?.();
                },
                onSubmit: handleSubmit,
                ...nonFormsyProps,
                disabled: disabled,
                children: children
            })
        })
    });
}
FormsyInner.displayName = 'Formsy';
const Formsy = /*#__PURE__*/ (0, external_react_namespaceObject.forwardRef)(FormsyInner);
Formsy.displayName = 'Formsy';
const src_Formsy = Formsy;
const src = src_Formsy;
exports.addValidationRule = __webpack_exports__.addValidationRule;
exports["default"] = __webpack_exports__["default"];
exports.useFormsy = __webpack_exports__.useFormsy;
exports.validationRules = __webpack_exports__.validationRules;
exports.withFormsy = __webpack_exports__.withFormsy;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "addValidationRule",
    "default",
    "useFormsy",
    "validationRules",
    "withFormsy"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});
