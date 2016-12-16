import { Observable } from 'rxjs/Observable';
import { map } from 'lodash';
import { Component } from '../react';
import { ViewDelta } from '../react';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../core';


export interface StateSink extends Sinks {
	state: Observable<ViewDelta<any>>,
};

export interface StateSourceDefinition extends SourceDefinition {
	source: Observable<void>,
	dispose: DisposeFn,
}

export interface StateSource {
	state: Observable<void>,
};

export interface StateDriver extends Driver {
	(sinks: StateSink): StateSourceDefinition;
};

export interface StateDriverDefinition extends Drivers {
	state: StateDriver,
};

export function makeReactStateDriver(cb: (v: any) => void): StateDriver {
	return (sinkProxies: StateSink) => {
		const proxy = sinkProxies.state;
		const source = proxy.map(({ View, state }) => {
			cb({ View, state });
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,
		};
	};
}
