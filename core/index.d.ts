import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
export declare type DisposeFn = () => void;
export declare type Source<T> = Observable<T>;
export interface SourceDefinition {
    source: Observable<any>;
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
    [J: string]: Observable<any>;
}
export interface SinkProxies {
    [L: string]: Subject<any>;
}
export declare type Main = (sources: Sources) => Sinks;
export declare type RunFn = () => DisposeFn;
export declare function App<S extends Sources, D extends Drivers>(main: Main, drivers: D): {
    sinks: Sinks;
    sources: S;
    run: () => () => void;
};
