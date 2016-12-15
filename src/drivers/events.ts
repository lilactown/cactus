import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs/Rx';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../core';

export type EventDefinition = {
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
