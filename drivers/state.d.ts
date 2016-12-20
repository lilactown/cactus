import { Observable } from 'rxjs/Observable';
import { ViewDelta } from '../react';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface StateSink extends Sinks {
    state: Observable<ViewDelta<any>>;
}
export interface StateSourceDefinition extends SourceDefinition {
    source: Observable<void>;
    dispose: DisposeFn;
}
export interface StateSource {
    state: Observable<void>;
}
export interface StateDriver extends Driver {
    (sinks: StateSink, key: string): StateSourceDefinition;
}
export interface StateDriverDefinition extends Drivers {
    state: StateDriver;
}
export declare function makeReactStateDriver(cb: (v: any) => void): StateDriver;
