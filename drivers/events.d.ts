import { Observable } from 'rxjs/Rx';
import { Sinks, SourceDefinition, Drivers, Driver, DisposeFn } from '../core';
export declare type EventDefinition = {
    category: string;
    event: any;
};
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
export declare type Selectable<E> = {
    stream: Observable<EventDefinition>;
    select: (category: keyof E) => Observable<any>;
};
export declare function selectable<E>(stream: Observable<EventDefinition>): Selectable<E>;
export declare function makeEventDriver(): (sinkProxies: EventSink) => {
    source: Observable<EventDefinition>;
    dispose: () => void;
};
