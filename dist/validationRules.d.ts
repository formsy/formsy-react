import { ValidationFunction } from './interfaces';
interface Validations<V> {
    [key: string]: ValidationFunction<V>;
}
declare const validations: Validations<any>;
export default validations;
