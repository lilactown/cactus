import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs/Rx';
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


export interface RenderSink extends Sinks {
	render: Rx.Observable<ViewDelta<any>>,
};

export interface RenderSourceDefinition extends SourceDefinition {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface RenderSource {
	render: Rx.Observable<void>,
};

export interface RenderDriver extends Driver {
	(sinks: RenderSink): RenderSourceDefinition;
};

export interface RenderDriverDefinition extends Drivers {
	render: RenderDriver,
};

export function makeReactDOMDriver(DOMNode: Element): RenderDriver {
	console.log('[ReactDOMDriver] initiated');
	return (sinkProxies: RenderSink) => {
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
