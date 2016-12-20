/// <reference types="react" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import * as Core from '../core';
export declare type EventDefinition = {
    category: string;
    event: any;
};
export interface Events {
    [K: string]: Observable<any>;
}
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export interface ViewDelta<P> {
    View: Component;
    state: P;
}
export interface PropsMap {
}
export declare function connectView<P>(View: Component, events: Events, model$: Observable<P>): {
    view$: Observable<ViewDelta<P>>;
    events$: Observable<EventDefinition>;
};
export declare function appAsComponent<P, S>(main: Core.Main, drivers: Core.Drivers, displayName?: string): any;
