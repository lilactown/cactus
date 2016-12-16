import * as Rx from 'rxjs/Rx';
import { ViewDelta } from '../delta';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface ReactSink extends Sinks {
    render: Rx.Observable<ViewDelta<any>>;
}
export interface ReactSourceDefinition extends SourceDefinition {
    source: Rx.Observable<void>;
    dispose: DisposeFn;
}
export interface ReactSource {
    render: Rx.Observable<void>;
}
export interface ReactDriver extends Driver {
    (sinks: ReactSink): ReactSourceDefinition;
}
export interface ReactDriverDefinition extends Drivers {
    render: ReactDriver;
}
export declare function makeReactDOMDriver(DOMNode: Element): ReactDriver;
export declare function makeReactStateDriver(cb: (v: any) => void): ReactDriver;
