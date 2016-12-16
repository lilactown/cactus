/// <reference types="whatwg-fetch" />
import 'whatwg-fetch';
import * as Rx from 'rxjs/Rx';
import { Sources, SourceDefinition, Sinks, Drivers, Driver, DisposeFn } from '../core';
export interface FetchSink extends Sinks {
    fetch: Rx.Observable<FetchParams>;
}
export interface FetchSourceDefinition extends SourceDefinition {
    source: Rx.Observable<any>;
    dispose: DisposeFn;
}
export interface FetchSource extends Sources {
    fetch: Rx.Observable<any>;
}
export interface FetchDriver extends Driver {
    (sinks: FetchSink): FetchSourceDefinition;
}
export interface FetchParams {
    url: string;
    options?: RequestInit;
}
export interface FetchDriverDefinition extends Drivers {
    fetch: FetchDriver;
}
export declare function makeFetchDriver(): FetchDriver;
export declare function makeJSONDriver(): FetchDriver;
