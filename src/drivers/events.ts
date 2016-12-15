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

interface Events {
	[K: string]: Rx.Observable<any>
};

type EventDefinition = {
	category: string,
	event: any,
};

export interface EventSink extends Sinks {
    events: Rx.Observable<EventDefinition>
};

export interface EventSourceDefinition extends SourceDefinition {
    source: Rx.Observable<EventDefinition>,
	dispose: DisposeFn,
};

export interface EventSource {
    events: Rx.Observable<EventDefinition>,
};

export interface EventDriver extends Driver {
    (sinks: EventSink): EventSourceDefinition;
};

export interface EventDriverDefinition extends Drivers {
    events: EventDriver,
};

function makeConnectedEvents(events: Events): Rx.Observable<EventDefinition> {
	const eventDefs = map(events, (event$, key) => {
		return event$.map((ev): EventDefinition => ({
			category: key,
			event: ev,
		}));
	});

	const stream = Rx.Observable.merge(...eventDefs);

	return stream;
}

function select(stream: Rx.Observable<EventDefinition>, category: string) {
    return stream.filter((eventDef) => eventDef.category === category)
        .map((eventDef) => eventDef.event);
};

export type Selectable<E> = {
    stream: Rx.Observable<EventDefinition>,
    select: (category: keyof E) => Rx.Observable<any>,
};

export function selectable<E>(stream: Rx.Observable<EventDefinition>): Selectable<E> {
    return {
        stream,
        select: (category) => select(stream, category),
    };
}

export function makeEventDriver() {
    console.log('[EventDriver] initiated');
	return (sinkProxies: EventSink) => {
		console.log('[EventDriver] state change started');
		const proxy = sinkProxies.events;
        const source = proxy;
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,
		};
	};
}

export function connectedView<P>(View: Component, events: Events) {
	return function connectViewTo(model: Rx.Observable<P>) {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events$: makeConnectedEvents(events),
		};
	};
}
