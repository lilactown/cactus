import * as Rx from 'rxjs/Rx';
import { ViewDelta } from '../react';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface RenderSink extends Sinks {
    render: Rx.Observable<ViewDelta<any>>;
}
export interface RenderSourceDefinition extends SourceDefinition {
    source: Rx.Observable<void>;
    dispose: DisposeFn;
}
export interface RenderSource {
    render: Rx.Observable<void>;
}
export interface RenderDriver extends Driver {
    (sinks: RenderSink): RenderSourceDefinition;
}
export interface RenderDriverDefinition extends Drivers {
    render: RenderDriver;
}
export declare function makeReactDOMDriver(DOMNode: Element): RenderDriver;
