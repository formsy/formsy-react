import { WrapperInstanceMethods } from '../src/Wrapper';
import Formsy from '../src';

export function getWrapperInstance<V>(inputComponent) {
  return inputComponent.instance() as WrapperInstanceMethods<V>;
}

export function getInputInstance<V>(inputComponent) {
  return inputComponent.instance() as HTMLInputElement;
}

export function getFormInstance(formComponent) {
  return formComponent.instance() as Formsy;
}
