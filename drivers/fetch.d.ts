/// <reference types="whatwg-fetch" />
import 'whatwg-fetch';
import { Observable } from 'rxjs/Observable';
import { Sources, SourceDefinition, Sinks, Drivers, Driver, DisposeFn } from '../core';
export interface FetchSink extends Sinks {
    fetch: Observable<FetchParams>;
}
export interface FetchSourceDefinition extends SourceDefinition {
    source: Observable<any>;
    dispose: DisposeFn;
}
export interface FetchSource extends Sources {
    fetch: Observable<any>;
}
export interface FetchDriver extends Driver {
    (sinks: FetchSink, key: string): FetchSourceDefinition;
}
export interface FetchParams {
    url: string;
    options?: RequestInit;
}
export interface FetchDriverDefinition extends Drivers {
    fetch: FetchDriver;
}
export declare function makeFetchDriver(): FetchDriver;
export declare function makeFetchJSONDriver(): FetchDriver;
