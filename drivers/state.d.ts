import * as Rx from 'rxjs/Rx';
import { ViewDelta } from '../react';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface StateSink extends Sinks {
    state: Rx.Observable<ViewDelta<any>>;
}
export interface StateSourceDefinition extends SourceDefinition {
    source: Rx.Observable<void>;
    dispose: DisposeFn;
}
export interface StateSource {
    state: Rx.Observable<void>;
}
export interface StateDriver extends Driver {
    (sinks: StateSink): StateSourceDefinition;
}
export interface StateDriverDefinition extends Drivers {
    state: StateDriver;
}
export declare function makeReactStateDriver(cb: (v: any) => void): StateDriver;
