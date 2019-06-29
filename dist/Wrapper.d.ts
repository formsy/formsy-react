import PropTypes from 'prop-types';
import React from 'react';
declare const propTypes: {
    innerRef: PropTypes.Requireable<(...args: any[]) => any>;
    name: PropTypes.Validator<string>;
    required: PropTypes.Requireable<string | boolean | object>;
    validations: PropTypes.Requireable<string | object>;
    value: PropTypes.Requireable<any>;
};
export { propTypes };
export default function <Props, State, CompState>(WrappedComponent: React.ComponentClass<Props & State>): React.ComponentClass<Props & State>;
