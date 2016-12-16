import { Observable } from 'rxjs/Rx';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
import { EventDefinition } from '../events';
export interface EventSink extends Sinks {
    events: Observable<EventDefinition>;
}
export interface EventSourceDefinition extends SourceDefinition {
    source: Observable<EventDefinition>;
    dispose: DisposeFn;
}
export interface EventSource {
    events: Observable<EventDefinition>;
}
export interface EventDriver extends Driver {
    (sinks: EventSink): EventSourceDefinition;
}
export interface EventDriverDefinition extends Drivers {
    events: EventDriver;
}
export declare function makeEventDriver(): (sinkProxies: EventSink) => {
    source: Observable<EventDefinition>;
    dispose: () => void;
};
