import 'whatwg-fetch';
import * as Rx from 'rxjs/Rx';
import { Sources, SourceDefinition, Sinks, Drivers, Driver, DisposeFn } from '../framework';

export interface FetchSink extends Sinks {
    fetch: Rx.Observable<FetchParams>,
};

export interface FetchSourceDefinition extends SourceDefinition {
    source: Rx.Observable<any>,
    dispose: DisposeFn
}

export interface FetchSource extends Sources {
    fetch: Rx.Observable<any>,
}

export interface FetchDriver extends Driver {
    (sinks: FetchSink): FetchSourceDefinition,
};

export interface FetchParams {
    url: string,
    options?: RequestInit,
};

export interface FetchDriverDefinition extends Drivers {
	fetch: FetchDriver,
};


export function makeFetchDriver(): FetchDriver {
    return (sinkProxies: FetchSink) => {
        const source = sinkProxies.fetch
            .switchMap((params: FetchParams) => {
                return Rx.Observable.fromPromise(fetch((params.url)))
            });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();

        return {
            source,
            dispose,
        };
    };
}

export function makeJSONDriver(): FetchDriver {
    return (sinkProxies: FetchSink) => {
        const source = sinkProxies.fetch
            .flatMap((params: FetchParams) => {
                return Rx.Observable.fromPromise(fetch((params.url)))
            })
            .flatMap((res: Response) => Rx.Observable.fromPromise(res.json()));
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();

        return {
            source,
            dispose,
        };
    };
}
