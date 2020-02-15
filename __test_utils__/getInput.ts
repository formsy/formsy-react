import { WrapperInstanceMethods } from '../src/Wrapper';
import Formsy from '../src';

export function getInputInstance(inputComponent) {
  return inputComponent.instance() as WrapperInstanceMethods;
}

export function getFormInstance(formComponent) {
  return formComponent.instance() as Formsy;
}
