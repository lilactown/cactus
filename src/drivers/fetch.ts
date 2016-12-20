import 'whatwg-fetch';
import { Observable } from 'rxjs/Observable';
import { Sources, SourceDefinition, Sinks, Drivers, Driver, DisposeFn } from '../core';

export interface FetchSink extends Sinks {
    fetch: Observable<FetchParams>,
};

export interface FetchSourceDefinition extends SourceDefinition {
    source: Observable<any>,
    dispose: DisposeFn
}

export interface FetchSource extends Sources {
    fetch: Observable<any>,
}

export interface FetchDriver extends Driver {
    (sinks: FetchSink, key: string): FetchSourceDefinition,
};

export interface FetchParams {
    url: string,
    options?: RequestInit,
};

export interface FetchDriverDefinition extends Drivers {
	fetch: FetchDriver,
};

export function makeFetchDriver(): FetchDriver {
    return (sinkProxies: FetchSink, key: string) => {
        const source = sinkProxies[key]
            .switchMap((params: FetchParams) => {
                return Observable.fromPromise(fetch((params.url)))
            });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();

        return {
            source,
            dispose,
        };
    };
}

export function makeFetchJSONDriver(): FetchDriver {
    return (sinkProxies: FetchSink, key: string) => {
        const source = sinkProxies[key]
            .flatMap((params: FetchParams) => {
                return Observable.fromPromise(fetch(params.url, params.options))
            })
            .flatMap((res: Response) => Observable.fromPromise(res.json()));
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();

        return {
            source,
            dispose,
        };
    };
}
