import * as MVI from './core';
export declare type Main = (sources: MVI.Sources) => MVI.Sinks;
export interface PropsMap {
    [K: string]: (state: any) => any;
}
export interface App {
}
export declare function createAppComponent<P>(main: Main, drivers: MVI.Drivers, propsMap: PropsMap, displayName?: string): App;
