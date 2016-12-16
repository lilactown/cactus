import * as Rx from 'rxjs/Rx';
export declare type DisposeFn = () => void;
export declare type Source<T> = Rx.Observable<T>;
export interface SourceDefinition {
    source: Rx.Observable<any>;
    dispose: DisposeFn;
}
export interface Sources {
    [N: string]: Source<any>;
}
export interface Driver {
    (sinks: Sinks): SourceDefinition;
}
export interface Drivers {
    [K: string]: Driver;
}
export interface Sinks {
    [J: string]: Rx.Observable<any>;
}
export interface SinkProxies {
    [L: string]: Rx.Subject<any>;
}
export declare type RunFn = () => DisposeFn;
export declare function App<S extends Sources, D extends Drivers>(main: (sources?: S) => Sinks, drivers: D): {
    sinks: Sinks;
    sources: S;
    run: () => () => void;
};
