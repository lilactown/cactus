import * as Rx from 'rxjs/Rx';
import { map } from 'lodash';
import { EventDefinition } from './drivers/events';
import { Component } from './component';
import { ViewDelta } from './delta';

interface Events {
	[K: string]: Rx.Observable<any>
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

export function connectedView<P>(View: Component, events: Events) {
	return function connectViewTo(model: Rx.Observable<P>) {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events$: makeConnectedEvents(events),
		};
	};
}
