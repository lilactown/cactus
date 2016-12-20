import { Observable } from 'rxjs/Observable';
import { ViewDelta } from '../react';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export interface RenderSink extends Sinks {
    render: Observable<ViewDelta<any>>;
}
export interface RenderSourceDefinition extends SourceDefinition {
    source: Observable<void>;
    dispose: DisposeFn;
}
export interface RenderSource {
    render: Observable<void>;
}
export interface RenderDriver extends Driver {
    (sinks: RenderSink, key: string): RenderSourceDefinition;
}
export interface RenderDriverDefinition extends Drivers {
    render: RenderDriver;
}
export declare function makeReactDOMDriver(DOMNode: Element): RenderDriver;
