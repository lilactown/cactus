/// <reference types="react" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import * as Core from '../core';
import { Events, EventDefinition } from '../events';
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export interface ViewDelta<P> {
    View: Component;
    state: P;
}
export interface PropsMap {
    [K: string]: (state: any) => any;
}
export declare function connectedView<P>(View: Component, events: Events): (model: Observable<P>) => {
    view$: Observable<ViewDelta<P>>;
    events$: Observable<EventDefinition>;
};
export declare function appAsComponent<P>(main: Core.Main, drivers: Core.Drivers, propsMap?: PropsMap, displayName?: string): any;
