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
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
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
    withFormsy: ()=>withFormsy,
    validationRules: ()=>validationRules_validationRules
});
const isPlainObject_namespaceObject = require("lodash/isPlainObject");
var isPlainObject_default = /*#__PURE__*/ __webpack_require__.n(isPlainObject_namespaceObject);
function isArray(value) {
    return Array.isArray(value);
}
function isObject(value) {
    return isPlainObject_default()(value);
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
function protectAgainstParamReassignment(value) {
    if (isObject(value)) return {
        ...value
    };
    if (isArray(value)) return [
        ...value
    ];
    return value;
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
function debounce(callback, timeout) {
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            callback.apply(this, args);
        }, timeout);
    };
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
const external_react_namespaceObject = require("react");
var external_react_default = /*#__PURE__*/ __webpack_require__.n(external_react_namespaceObject);
const noFormsyErrorMessage = 'Could not find Formsy Context Provider. Did you use withFormsy outside <Formsy />?';
const throwNoFormsyProvider = ()=>{
    throw new Error(noFormsyErrorMessage);
};
const defaultValue = {
    attachToForm: throwNoFormsyProvider,
    detachFromForm: throwNoFormsyProvider,
    isFormDisabled: true,
    isValidValue: throwNoFormsyProvider,
    validate: throwNoFormsyProvider,
    runValidation: throwNoFormsyProvider
};
const FormsyContext = external_react_default().createContext(defaultValue);
const convertValidationsToObject = (validations)=>{
    if (isString(validations)) return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation)=>{
        let args = validation.split(':');
        const validateMethod = args.shift() || '';
        args = args.map((arg)=>{
            try {
                return JSON.parse(arg);
            } catch (_e) {
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
function getDisplayName(component) {
    return component.displayName || component.name || (isString(component) ? component : 'Component');
}
function withFormsy(WrappedComponent) {
    class WithFormsyWrapper extends external_react_default().Component {
        validations;
        requiredValidations;
        static displayName = `Formsy(${getDisplayName(WrappedComponent)})`;
        constructor(props){
            super(props);
            const { runValidation, validations, required, value = WrappedComponent.defaultValue } = props;
            this.state = {
                value
            };
            this.setValidations(validations, required);
            this.state = {
                formSubmitted: false,
                isPristine: true,
                pristineValue: value,
                value: value,
                ...runValidation(this, value)
            };
        }
        componentDidMount() {
            const { name, attachToForm } = this.props;
            if (!name) throw new Error('Form Input requires a name property when used');
            attachToForm(this);
        }
        shouldComponentUpdate(nextProps, nextState) {
            const { props, state } = this;
            const isChanged = (a, b)=>Object.keys(a).some((k)=>a[k] !== b[k]);
            const isPropsChanged = isChanged(props, nextProps);
            const isStateChanged = isChanged(state, nextState);
            return isPropsChanged || isStateChanged;
        }
        componentDidUpdate(prevProps) {
            const { value, validations, required, validate } = this.props;
            if (!isSame(value, prevProps.value)) this.setValue(value);
            if (!isSame(validations, prevProps.validations) || !isSame(required, prevProps.required)) {
                this.setValidations(validations, required);
                validate(this);
            }
        }
        componentWillUnmount() {
            const { detachFromForm } = this.props;
            detachFromForm(this);
        }
        getErrorMessage = ()=>{
            const messages = this.getErrorMessages();
            return messages.length ? messages[0] : null;
        };
        getErrorMessages = ()=>{
            const { validationError } = this.state;
            if (!this.isValid() || this.showRequired()) return validationError || [];
            return [];
        };
        getValue = ()=>this.state.value;
        setValidations = (validations, required)=>{
            this.validations = convertValidationsToObject(validations) || {};
            this.requiredValidations = true === required ? {
                isDefaultRequiredValue: required
            } : convertValidationsToObject(required);
        };
        setValue = (value, validate = true)=>{
            const { validate: validateForm } = this.props;
            if (validate) this.setState({
                value,
                isPristine: false
            }, ()=>{
                validateForm(this);
            });
            else this.setState({
                value
            });
        };
        hasValue = ()=>{
            const { value } = this.state;
            return isDefaultRequiredValue(value);
        };
        isFormDisabled = ()=>this.props.isFormDisabled;
        isFormSubmitted = ()=>this.state.formSubmitted;
        isPristine = ()=>this.state.isPristine;
        isRequired = ()=>!!this.props.required;
        isValid = ()=>this.state.isValid;
        isValidValue = (value)=>this.props.isValidValue(this, value);
        resetValue = ()=>{
            const { pristineValue } = this.state;
            const { validate } = this.props;
            this.setState({
                value: pristineValue,
                isPristine: true
            }, ()=>{
                validate(this);
            });
        };
        showError = ()=>!this.showRequired() && !this.isValid();
        showRequired = ()=>this.state.isRequired;
        render() {
            const { innerRef } = this.props;
            const propsForElement = {
                ...this.props,
                errorMessage: this.getErrorMessage(),
                errorMessages: this.getErrorMessages(),
                hasValue: this.hasValue(),
                isFormDisabled: this.isFormDisabled(),
                isFormSubmitted: this.isFormSubmitted(),
                isPristine: this.isPristine(),
                isRequired: this.isRequired(),
                isValid: this.isValid(),
                isValidValue: this.isValidValue,
                resetValue: this.resetValue,
                setValidations: this.setValidations,
                setValue: this.setValue,
                showError: this.showError(),
                showRequired: this.showRequired(),
                value: this.getValue()
            };
            if (innerRef) propsForElement.ref = innerRef;
            return external_react_default().createElement(WrappedComponent, propsForElement);
        }
    }
    return (props)=>external_react_default().createElement(FormsyContext.Consumer, null, (contextValue)=>external_react_default().createElement(WithFormsyWrapper, {
                ...props,
                ...contextValue
            }));
}
const set_namespaceObject = require("lodash/set");
var set_default = /*#__PURE__*/ __webpack_require__.n(set_namespaceObject);
const has_namespaceObject = require("lodash/has");
var has_default = /*#__PURE__*/ __webpack_require__.n(has_namespaceObject);
const get_namespaceObject = require("lodash/get");
var get_default = /*#__PURE__*/ __webpack_require__.n(get_namespaceObject);
const ONE_RENDER_FRAME = 66;
class Formsy extends external_react_default().Component {
    static displayName = 'Formsy';
    inputs;
    emptyArray;
    prevInputNames = null;
    debouncedValidateForm;
    constructor(props){
        super(props);
        this.state = {
            canChange: false,
            isSubmitting: false,
            isValid: true,
            contextValue: {
                attachToForm: this.attachToForm,
                detachFromForm: this.detachFromForm,
                isFormDisabled: props.disabled ?? false,
                isValidValue: this.isValidValue,
                validate: this.validate,
                runValidation: this.runValidation
            }
        };
        this.inputs = [];
        this.emptyArray = [];
        this.debouncedValidateForm = debounce(this.validateForm, ONE_RENDER_FRAME);
    }
    componentDidMount = ()=>{
        this.prevInputNames = this.inputs.map((component)=>component.props.name);
        this.validateForm();
    };
    componentDidUpdate = (prevProps)=>{
        const { validationErrors, disabled = false } = this.props;
        if (validationErrors && isObject(validationErrors) && Object.keys(validationErrors).length > 0) this.setInputValidationErrors(validationErrors);
        const newInputNames = this.inputs.map((component)=>component.props.name);
        if (this.prevInputNames && !isSame(this.prevInputNames, newInputNames)) {
            this.prevInputNames = newInputNames;
            this.validateForm();
        }
        if ((disabled ?? false) !== (prevProps.disabled ?? false)) this.setState((state)=>({
                ...state,
                contextValue: {
                    ...state.contextValue,
                    isFormDisabled: disabled
                }
            }));
    };
    getCurrentValues = ()=>this.inputs.reduce((valueAccumulator, component)=>{
            const { props: { name }, state: { value } } = component;
            valueAccumulator[name] = protectAgainstParamReassignment(value);
            return valueAccumulator;
        }, {});
    getModel = ()=>{
        const currentValues = this.getCurrentValues();
        return this.mapModel(currentValues);
    };
    getPristineValues = ()=>this.inputs.reduce((valueAccumulator, component)=>{
            const { props: { name, value } } = component;
            valueAccumulator[name] = protectAgainstParamReassignment(value);
            return valueAccumulator;
        }, {});
    setFormPristine = (isPristine)=>{
        this.setState({
            formSubmitted: !isPristine
        });
        this.inputs.forEach((component)=>{
            component.setState({
                formSubmitted: !isPristine,
                isPristine
            });
        });
    };
    setInputValidationErrors = (errors)=>{
        const { preventExternalInvalidation = false } = this.props;
        const { isValid } = this.state;
        this.inputs.forEach((component)=>{
            const { name } = component.props;
            component.setState({
                isValid: !(name in errors),
                validationError: isString(errors[name]) ? [
                    errors[name]
                ] : errors[name]
            });
        });
        if (!preventExternalInvalidation && isValid) this.setFormValidState(false);
    };
    setFormValidState = (allIsValid)=>{
        this.setState({
            isValid: allIsValid
        });
        if (allIsValid) this.props.onValid?.();
        else this.props.onInvalid?.();
    };
    isValidValue = (component, value)=>this.runValidation(component, value).isValid;
    isFormDisabled = ()=>this.props.disabled ?? false;
    mapModel = (model)=>{
        const { mapping } = this.props;
        if ('function' == typeof mapping) return mapping(model);
        const returnModel = {};
        Object.keys(model).forEach((key)=>{
            set_default()(returnModel, key, model[key]);
        });
        return returnModel;
    };
    reset = (model)=>{
        this.setFormPristine(true);
        this.resetModel(model);
    };
    runValidation = (component, value = component.state.value)=>{
        const { validationErrors = {} } = this.props;
        const { validationError, validationErrors: componentValidationErrors, name } = component.props;
        const currentValues = this.getCurrentValues();
        const validationResults = runRules(value, currentValues, component.validations || {}, validationRules_validationRules);
        const requiredResults = runRules(value, currentValues, component.requiredValidations || {}, validationRules_validationRules);
        const isRequired = Object.keys(component.requiredValidations || {}).length ? !!requiredResults.success.length : false;
        const isValid = !validationResults.failed.length && !(validationErrors && validationErrors[component.props.name]);
        return {
            isRequired,
            isValid: isRequired ? false : isValid,
            validationError: (()=>{
                if (isValid && !isRequired) return this.emptyArray;
                if (validationResults.errors.length) return validationResults.errors;
                if (validationErrors && validationErrors[name]) return isString(validationErrors[name]) ? [
                    validationErrors[name]
                ] : validationErrors[name];
                if (isRequired) {
                    const error = (componentValidationErrors || {})[requiredResults.success[0]] || validationError;
                    return error ? [
                        error
                    ] : null;
                }
                if (validationResults.failed.length) return validationResults.failed.map((failed)=>(componentValidationErrors || {})[failed] ? componentValidationErrors[failed] : validationError).filter((x, pos, arr)=>arr.indexOf(x) === pos);
            })()
        };
    };
    attachToForm = (component)=>{
        if (-1 === this.inputs.indexOf(component)) this.inputs.push(component);
        const { canChange } = this.state;
        if (canChange) this.props.onChange?.(this.getModel(), this.isChanged());
        this.debouncedValidateForm();
    };
    detachFromForm = (component)=>{
        this.inputs = this.inputs.filter((input)=>input !== component);
        this.debouncedValidateForm();
    };
    isChanged = ()=>!isSame(this.getPristineValues(), this.getCurrentValues());
    submit = (event)=>{
        const { onSubmit, onValidSubmit, onInvalidSubmit, preventDefaultSubmit = true } = this.props;
        const { isValid } = this.state;
        if (preventDefaultSubmit && event?.preventDefault) event.preventDefault();
        this.setFormPristine(false);
        const model = this.getModel();
        onSubmit?.(model, this.resetModel, this.updateInputsWithError, event);
        if (isValid) onValidSubmit?.(model, this.resetModel, this.updateInputsWithError, event);
        else onInvalidSubmit?.(model, this.resetModel, this.updateInputsWithError, event);
    };
    updateInputsWithError = (errors, invalidate)=>{
        const { preventExternalInvalidation = false } = this.props;
        const { isValid } = this.state;
        Object.entries(errors).forEach(([name, error])=>{
            const component = this.inputs.find((input)=>input.props.name === name);
            if (!component) throw new Error(`You are trying to update an input that does not exist. Verify errors object with input names. ${JSON.stringify(errors)}`);
            component.setState({
                isValid: preventExternalInvalidation,
                validationError: isString(error) ? [
                    error
                ] : error
            });
        });
        if (invalidate && isValid) this.setFormValidState(false);
    };
    updateInputsWithValue = (data, validate)=>{
        this.inputs.forEach((component)=>{
            const { name } = component.props;
            if (data && has_default()(data, name)) component.setValue(get_default()(data, name), validate);
        });
    };
    validate = (component)=>{
        const { onChange } = this.props;
        const { canChange } = this.state;
        if (canChange) onChange?.(this.getModel(), this.isChanged());
        const validationState = this.runValidation(component);
        component.setState(validationState, this.validateForm);
    };
    validateForm = ()=>{
        const onValidationComplete = ()=>{
            const allIsValid = this.inputs.every((component)=>component.state.isValid);
            this.setFormValidState(allIsValid);
            this.setState({
                canChange: true
            });
        };
        if (0 === this.inputs.length) onValidationComplete();
        else this.inputs.forEach((component, index)=>{
            const validationState = this.runValidation(component);
            const isLastInput = index === this.inputs.length - 1;
            const callback = isLastInput ? onValidationComplete : null;
            component.setState(validationState, callback);
        });
    };
    render() {
        const { children, mapping, onChange, onInvalid, onInvalidSubmit, onReset, onSubmit, onValid, onValidSubmit, preventDefaultSubmit, preventExternalInvalidation, validationErrors, disabled = false, formElement = 'form', ...nonFormsyProps } = this.props;
        const { contextValue } = this.state;
        return external_react_default().createElement(FormsyContext.Provider, {
            value: contextValue
        }, external_react_default().createElement(formElement || 'form', {
            onReset: this.resetInternal,
            onSubmit: this.submit,
            ...nonFormsyProps,
            disabled
        }, children));
    }
    resetInternal = (event)=>{
        const { onReset } = this.props;
        event.preventDefault();
        this.reset();
        onReset?.();
    };
    resetModel = (data)=>{
        this.inputs.forEach((component)=>{
            const { name } = component.props;
            if (data && has_default()(data, name)) component.setValue(get_default()(data, name));
            else component.resetValue();
        });
        this.validateForm();
    };
}
const src = Formsy;
exports.addValidationRule = __webpack_exports__.addValidationRule;
exports["default"] = __webpack_exports__["default"];
exports.validationRules = __webpack_exports__.validationRules;
exports.withFormsy = __webpack_exports__.withFormsy;
for(var __rspack_i in __webpack_exports__)if (-1 === [
    "addValidationRule",
    "default",
    "validationRules",
    "withFormsy"
].indexOf(__rspack_i)) exports[__rspack_i] = __webpack_exports__[__rspack_i];
Object.defineProperty(exports, '__esModule', {
    value: true
});
