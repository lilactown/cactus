/// <reference types="react" />
import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Component, EventDefinition } from './';
export { ComponentEvent } from 'observe-component/common/ComponentEvent';
export { observeComponent, fromComponent } from 'observe-component/rxjs';
export { observeComponent as observe, fromComponent as from } from 'observe-component/rxjs';
export declare function withProps(definedProps: any): (Component: Component) => React.StatelessComponent<any>;
export declare type Selectable<E> = {
    stream: Observable<EventDefinition>;
    select: (category: keyof E) => Observable<any>;
};
export declare function selectable<E>(stream: Observable<EventDefinition>): Selectable<E>;
