import React from 'react';
import type { FormState } from './formsyReducer';
import { FormsyActions } from './interfaces';
export interface FormsyStateStore {
    subscribe: (listener: () => void) => () => void;
    getState: () => FormState;
    getDisabled: () => boolean;
}
export declare const FormsyActionsContext: React.Context<FormsyActions>;
export declare const FormsyStateStoreContext: React.Context<FormsyStateStore>;
