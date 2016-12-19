import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import * as React from 'react';
import * as R from 'ramda';
import { mapObjIndexed, map, forEach } from 'ramda';

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
	return mapObjIndexed(() => {
		return new Subject();
	}, drivers);
}

function executeDrivers(drivers: Drivers, sinkProxies: SinkProxies) {
	return mapObjIndexed((driver: Driver) => driver(sinkProxies), drivers);
}

function getSources<S extends Sources>(definitions: { [I: string]: SourceDefinition }): S {
	return <S>mapObjIndexed((definition: SourceDefinition) => definition.source, definitions);
}

function createSinkDisposal(definitions: any): DisposeFn {
	const disposes = R.compose(
		R.values,
		map((definition: SourceDefinition) => definition.dispose)
	)(definitions);
	return () => disposes.forEach((dispose: DisposeFn) => dispose());
}

function link(sinks: Sinks, sinkProxies: SinkProxies): DisposeFn {
	const toSubscription =
		mapObjIndexed((sink: Observable<any>, name: string) => {
			const proxy = sinkProxies[name];
			return sink.subscribe(proxy);
		});
	// const disposal = forEach((subscription: Subscription) => subscription.unsubscribe())
	const subscriptions = R.compose<Sinks, { [I: string]: Subscription}, Subscription[]>(
		R.values,
		toSubscription
	)(sinks);

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

export function run<S extends Sources, D extends Drivers>(
	main: Main,
	drivers: D
) {
	const { run } = App(main, drivers);
	return run();
}
