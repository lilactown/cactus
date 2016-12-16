import { Observable } from 'rxjs/Observable';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../core';
import { EventDefinition } from '../events';

export interface EventSink extends Sinks {
    events: Observable<EventDefinition>
};

export interface EventSourceDefinition extends SourceDefinition {
    source: Observable<EventDefinition>,
	dispose: DisposeFn,
};

export interface EventSource {
    events: Observable<EventDefinition>,
};

export interface EventDriver extends Driver {
    (sinks: EventSink): EventSourceDefinition;
};

export interface EventDriverDefinition extends Drivers {
    events: EventDriver,
};

export function makeEventDriver() {
	return (sinkProxies: EventSink) => {
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
