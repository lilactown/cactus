import { Observable } from 'rxjs/Observable';
import { ViewDelta } from '../react';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface PropsSink extends Sinks {
    [K: string]: Observable<ViewDelta<any>>;
}
export interface PropsSourceDefinition extends SourceDefinition {
    source: Observable<void>;
    dispose: DisposeFn;
}
export interface PropsSource {
    [K: string]: Observable<void>;
}
export interface PropsDriver extends Driver {
    (sinks: PropsSink, key: string): PropsSourceDefinition;
}
export interface PropsDriverDefinition extends Drivers {
    [K: string]: PropsDriver;
}
export declare function makeReactPropsDriver(propKey: string): PropsDriver;
