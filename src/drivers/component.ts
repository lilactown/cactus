import { Observable } from 'rxjs/Observable';
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
	(sinks: StateSink, key: string): StateSourceDefinition;
};

export interface StateDriverDefinition extends Drivers {
	state: StateDriver,
};

export function makeReactComponentDriver(): StateDriver {
	return function stateDriver(sinkProxies: StateSink, key: string) {
		const proxy = sinkProxies[key];
		const source = proxy.map(({ View, state }) => {
			const oldState = this.state;
			if (View !== this.component) {
				this.component = View;
			}
			this.setState(state);
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,
		};
	};
}
