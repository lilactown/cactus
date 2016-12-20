import * as React from 'react';
import { render } from 'react-dom';
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


export interface RenderSink extends Sinks {
	render: Observable<ViewDelta<any>>,
};

export interface RenderSourceDefinition extends SourceDefinition {
	source: Observable<void>,
	dispose: DisposeFn,
}

export interface RenderSource {
	render: Observable<void>,
};

export interface RenderDriver extends Driver {
	(sinks: RenderSink, key: string): RenderSourceDefinition;
};

export interface RenderDriverDefinition extends Drivers {
	render: RenderDriver,
};

export function makeReactDOMDriver(DOMNode: Element): RenderDriver {
	return (sinkProxies: RenderSink, key: string) => {
		const proxy = sinkProxies[key];
		const source = proxy.map(({ View, state }) => {
			render(<View {...state} />, DOMNode);
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,	
		};
	};
}
