# formsy-react 

[![GitHub release](https://img.shields.io/github/release/formsy/formsy-react.svg)](https://github.com/formsy/formsy-react/releases)
[![Build status](https://travis-ci.org/formsy/formsy-react.svg?branch=master)](https://travis-ci.org/formsy/formsy-react)
[![Gzipped size](http://img.badgesize.io/https://unpkg.com/formsy-react?compression=gzip)](https://unpkg.com/formsy-react)
[![Gitter chat](https://badges.gitter.im/formsy.png)](https://gitter.im/formsy/Lobby)


A form input builder and validator for React.

| [Quick Start](#quick-start) | [API](/API.md) |
| --------------------------- | -------------- |

## Background

[christianalfoni](https://github.com/christianalfoni/) wrote an article on forms and validation with React, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this component.

The main concept is that forms, inputs, and validation are done very differently across developers and projects. This React component aims to be that “sweet spot” between flexibility and reusability.

This project was originally located at https://github.com/christianalfoni/formsy-react if you're looking for v0.x or old issues.

## What You Can Do

1.  Build any kind of form element components. Not just traditional inputs, but anything you want, and get that validation for free
2.  Add validation rules and use them with simple syntax
3.  Use handlers for different states of your form. (`onError`, `onSubmit`, `onValid`, etc.)
4.  Pass external errors to the form to invalidate elements (E.g. a response from a server)
5.  Dynamically add form elements to your form and they will register/unregister to the form

## Install

`yarn add formsy-react react react-dom` and use with webpack, browserify, etc.

## Join the 2.x beta

The 2.0 release is currently in active development on master, but not yet released publicly. The API docs are still
written for the 1.x branch and will remain that way until release. However, the API changes are minor and listed below.
If you'd like to upgrade to formsy 2.x you can run:

```
yarn upgrade formsy-react@2.0.0-beta.2
```

**Element prop breaking changes:**
- getErrorMessage() => errorMessage
- getErrorMessages() => errorMessages
- getValue() => value
- hasValue() => hasValue,
- isFormDisabled(): => isFormDisabled,
- isValid(): => isValid,
- isPristine(): => isPristine,
- isFormSubmitted(): => isFormSubmitted,
- isRequired(): => isRequired,
- showRequired(): => showRequired,
- showError(): => showError,

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
    // An error message is returned only if the component is invalid
    const errorMessage = this.props.getErrorMessage();

    return (
      <div>
        <input
          onChange={this.changeValue}
          type="text"
          value={this.props.getValue() || ''}
        />
        <span>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MyInput);
```

`withFormsy` is a [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that exposes additional props to `MyInput`. See the [API](/API.md#withFormsy) documentation to view a complete list of the props.

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
      body: JSON.stringify(model)
    });
  }

  render() {
    return (
      <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <MyInput
          name="email"
          validations="isEmail"
          validationError="This is not a valid email"
          required
        />
        <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
      </Formsy>
    );
  }
}
```

This code results in a form with a submit button that will run the `submit` method when the form is submitted with a valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) and the value is not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

## Formsy component packages

-   https://github.com/twisty/formsy-react-components, Bootstrap 3 compatible form fields
-   https://github.com/zabute/formsy-semantic-ui-react, Semantic UI form fields
-   https://github.com/gogoair/react-formsy-combo-select, wrapper for https://github.com/gogoair/react-combo-select
-   https://github.com/rojobuffalo/formsy-material-ui, Material-UI form fields (out of date, for formsy-react 0.x)

## Contribute

-   Fork repo
-   `yarn`
-   `yarn test` runs the tests
-   `npm run deploy` build and release formsy

## PR titles / commits

We use `standard-changelog` to build out changelogs on release, which works off the 
[Angular Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message).
Please format your commit titles as:

`<type>: <subject>`

**With allowed `<type>`:**
- feat (feature)
- fix (bug fix)
- docs (documentation)
- style (formatting, missing semi colons, …)
- refactor
- test (when adding missing tests)
- chore (maintain)

## Changelog

[Check out releases](https://github.com/formsy/formsy-react/releases)

## License

[The MIT License (MIT)](/LICENSE)

Copyright (c) 2014-2016 PatientSky A/S
