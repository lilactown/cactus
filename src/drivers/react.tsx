import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs/Rx';
import { map } from 'lodash';
import { Component } from '../component';
import { ViewDelta } from '../delta';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../core';


export interface ReactSink extends Sinks {
	render: Rx.Observable<ViewDelta<any>>,
};

export interface ReactSourceDefinition extends SourceDefinition {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface ReactSource {
	render: Rx.Observable<void>,
};

export interface ReactDriver extends Driver {
	(sinks: ReactSink): ReactSourceDefinition;
};

export interface ReactDriverDefinition extends Drivers {
	render: ReactDriver,
};

export function makeReactDOMDriver(DOMNode: Element): ReactDriver {
	console.log('[ReactDOMDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactDOMDriver] rendering started');
		const proxy = sinkProxies.render;
		const source = proxy.map(({ View, state }) => {
			console.log('[ReactDOMDriver] rendering');
			ReactDOM.render(<View {...state} />, DOMNode);
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,	
		};
	};
}

export function makeReactEventDriver() {
	return (sinkProxies: ReactSink) => {
		
	}
}

export function makeReactStateDriver(cb: (v: any) => void): ReactDriver {
	console.log('[ReactStateDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactStateDriver] state change started');
		const proxy = sinkProxies.render;
		const source = proxy.map(({ View, state }) => {
			console.log('[ReactStateDriver] changing state');
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
