import { WrapperInstanceMethods } from '../src/withFormsy';
import Formsy from '../src';

export function getWrapperInstance<V>(inputComponent) {
  return inputComponent.instance() as WrapperInstanceMethods<V>;
}

export function getInputInstance(inputComponent) {
  return inputComponent.instance() as HTMLInputElement;
}

export function getFormInstance(formComponent) {
  return formComponent.instance() as Formsy;
}
