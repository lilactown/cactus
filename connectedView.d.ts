import { Observable } from 'rxjs/Rx';
import { EventDefinition } from './drivers/events';
import { Component } from './component';
import { ViewDelta } from './delta';
export interface Events {
    [K: string]: Observable<any>;
}
export declare function connectedView<P>(View: Component, events: Events): (model: Observable<P>) => {
    view$: Observable<ViewDelta<P>>;
    events$: Observable<EventDefinition>;
};
