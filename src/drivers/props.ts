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


export interface PropsSink extends Sinks {
	[K: string]: Observable<ViewDelta<any>>,
};

export interface PropsSourceDefinition extends SourceDefinition {
	source: Observable<void>,
	dispose: DisposeFn,
}

export interface PropsSource {
	[K: string]: Observable<void>,
};

export interface PropsDriver extends Driver {
	(sinks: PropsSink, key: string): PropsSourceDefinition;
};

export interface PropsDriverDefinition extends Drivers {
	[K: string]: PropsDriver,
};

export function makeReactPropsDriver(propKey: string): PropsDriver {
	return function propsDriver(sinkProxies: PropsSink, key: string) {
		const proxy = sinkProxies[key];
		const source = proxy.map((v) => {
            this.props[propKey] && this.props[propKey](v);
        });
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,
		};
	};
}
