import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as React from 'react';
import { mapValues, map, forEach } from 'lodash';

export type DisposeFn = () => void;
export type Source<T> = Observable<T>;
export interface SourceDefinition {
	source: Observable<any>,
	dispose: DisposeFn
};
export interface Sources {
	[N: string]: Source<any>,
};

export interface Driver {
	(sinks: Sinks): SourceDefinition,
};
export interface Drivers {
	[K: string]: Driver,
};

export interface Sinks {
	[J: string]: Observable<any>,
};
export interface SinkProxies {
	[L: string]: Subject<any>,
}

export type Main = (sources: Sources) => Sinks;
export type RunFn = () => DisposeFn;

function createProxies(drivers: Drivers): SinkProxies {
	return mapValues(drivers, () => {
		return new Subject();
	});
}

function executeDrivers(drivers: Drivers, sinkProxies: SinkProxies) {
	return mapValues(drivers, (driver) =>
		driver(sinkProxies)
	);
}

function getSources<S extends Sources>(definitions: _.Dictionary<SourceDefinition>): S {
	return <S>mapValues(definitions, (definition) => definition.source);
}

function createSinkDisposal(definitions: _.Dictionary<SourceDefinition>) {
	const disposes = map(definitions, (definition) => definition.dispose);
	return () => disposes.forEach((dispose) => dispose());
}

function link(sinks: Sinks, sinkProxies: SinkProxies): DisposeFn {
	const subscriptions = map(sinks, (sink, name: string) => {
		const proxy = sinkProxies[name];
		return sink.subscribe(proxy);
	});

	return () => {
		subscriptions.forEach((subscription) => subscription.unsubscribe());
	};
}

export function App<S extends Sources, D extends Drivers>(
	main: Main,
	drivers: D
) {
	const sinkProxies = createProxies(drivers);
	const sourceDefs = executeDrivers(drivers, sinkProxies);

	const disposeSinks = createSinkDisposal(sourceDefs); 
	const sources = getSources<S>(sourceDefs);
	const sinks = main(sources);
	return {
		sinks,
		sources,
		run: () => {
			const disposeProxies = link(sinks, sinkProxies);
			return () => {
				disposeSinks();
				disposeProxies();
			};
		},
	};
}
