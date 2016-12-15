import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs/rx';
import { Component } from '../types/Component';
import { ViewDelta } from '../types/Delta';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../framework';


export interface ReactSink extends Sinks {
	reactDOM: Rx.Observable<ViewDelta<any>>;
};

export interface ReactSourceDefinition extends SourceDefinition {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface ReactSource {
	reactDOM: Rx.Observable<void>,
};

export interface ReactDriver extends Driver {
	(sinks: ReactSink): ReactSourceDefinition;
};

export interface ReactDriverDefinition extends Drivers {
	reactDOM: ReactDriver,
};

export function makeReactDOMDriver(DOMNode: Element): ReactDriver {
	console.log('[ReactDOMDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactDOMDriver] rendering started');
		const proxy = sinkProxies.reactDOM;
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

export function makeReactStateDriver(cb: (v: any) => void): ReactDriver {
	console.log('[ReactStateDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactStateDriver] state change started');
		const proxy = sinkProxies.reactDOM;
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

// connectedView :: View -> Observable<State> -> Observable<{View, State}>
export function connectedView<P, E>(View: Component, events: E) {
	return function connectViewTo(model: Rx.Observable<P>) {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events,
		};
	};
}
