# formsy-react

[![GitHub release](https://img.shields.io/github/release/formsy/formsy-react.svg)](https://github.com/formsy/formsy-react/releases)
[![Build status](https://travis-ci.org/formsy/formsy-react.svg?branch=master)](https://travis-ci.org/formsy/formsy-react)
[![Coverage Status](https://coveralls.io/repos/github/formsy/formsy-react/badge.svg?branch=master)](https://coveralls.io/github/formsy/formsy-react?branch=master)
[![Gzipped size](http://img.badgesize.io/https://unpkg.com/formsy-react?compression=gzip)](https://unpkg.com/formsy-react)
[![GitHub contributors](https://img.shields.io/github/contributors/formsy/formsy-react.svg)](https://github.com/formsy/formsy-react/contributors)
![Typescript Types included](https://badgen.net/npm/types/tslib)

A form input builder and validator for React.

| [Quick Start](#quick-start) | [API](/API.md) | [1.x API](https://github.com/formsy/formsy-react/blob/v1.x/API.md) |
| --------------------------- | -------------- | ------------------------------------------------------------------ |


## Background

[christianalfoni](https://github.com/christianalfoni/) wrote an article on forms and validation with React,
[Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html),
the result of that was this library.

The main concept is that forms, inputs, and validation are done very differently across developers and projects. This
React component aims to be that “sweet spot” between flexibility and reusability.

This project was originally located at [christianalfoni/formsy-react](https://github.com/christianalfoni/formsy-react)
if you're looking for old issues.

## What You Can Do

1.  Build any kind of form element components. Not just traditional inputs, but anything you want, and get that
    validation for free
2.  Add validation rules and use them with simple syntax
3.  Use handlers for different states of your form. (`onSubmit`, `onValid`, etc.)
4.  Pass external errors to the form to invalidate elements (E.g. a response from a server)
5.  Dynamically add form elements to your form and they will register/unregister to the form

## Install

`yarn add formsy-react react react-dom` and use with webpack, browserify, etc.

## Formsy component packages

- [twisty/formsy-react-components](https://github.com/twisty/formsy-react-components) - Bootstrap components for a
  formsy-react form.\
- [zabute/formsy-semantic-ui-react](https://github.com/zabute/formsy-semantic-ui-react) - Formsy-React wrappers for
  Semantic-Ui-React's form components
  ([currently being updated to formsy 2.x](https://github.com/zabute/formsy-semantic-ui-react/pull/77))

## 1.x to 2.x Upgrade Guide

The 2.0 release fixed a number of legacy decisions in the Formsy API, mostly a reliance on function props over value
props passed down to wrapped components. However, the API changes are minor and listed below.

- `getErrorMessage()` => `errorMessage`
- `getErrorMessages()` => `errorMessages`
- `getValue()` => `value`
- `hasValue()` => `hasValue`
- `isFormDisabled():` => `isFormDisabled`
- `isFormSubmitted()` => `isFormSubmitted`
- `isPristine()` => `isPristine`
- `isRequired()` => `isRequired`
- `isValid():` => `isValid`
- `showError()` => `showError`
- `showRequired()` => `showRequired`

## Quick Start

### 1. Build a Formsy element

```jsx
// MyInput.js
import { withFormsy } from 'formsy-react';
import React from 'react';

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    // An error message is passed only if the component is invalid
    const errorMessage = this.props.errorMessage;

    return (
      <div>
        <input onChange={this.changeValue} type="text" value={this.props.value || ''} />
        <span>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MyInput);
```

`withFormsy` is a [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that
exposes additional props to `MyInput`. See the [API](/API.md#withFormsy) documentation to view a complete list of the
props.

### 2. Use your Formsy element

```jsx
import Formsy from 'formsy-react';
import React from 'react';
import MyInput from './MyInput';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.state = { canSubmit: false };
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  submit(model) {
    fetch('http://example.com/', {
      method: 'post',
      body: JSON.stringify(model),
    });
  }

  render() {
    return (
      <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <MyInput name="email" validations="isEmail" validationError="This is not a valid email" required />
        <button type="submit" disabled={!this.state.canSubmit}>
          Submit
        </button>
      </Formsy>
    );
  }
}
```

This code results in a form with a submit button that will run the `submit` method when the form is submitted with a
valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) and the value is
not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

## Contribute

- Fork repo
- `yarn`
- `yarn lint` runs lint checks
- `yarn test` runs the tests
- `npm run deploy` build and release formsy

## Changelog

Check out our [Changelog](https://github.com/formsy/formsy-react/blob/master/CHANGELOG.md) and
[releases](https://github.com/formsy/formsy-react/releases)

## License

[The MIT License (MIT)](/LICENSE)
