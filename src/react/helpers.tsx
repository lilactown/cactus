import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Component, EventDefinition } from './';

// re-export observe-component library
export { ComponentEvent } from 'observe-component/common/ComponentEvent';
export { observeComponent, fromComponent } from 'observe-component/rxjs';
export {
    observeComponent as observe,
    fromComponent as from,
} from 'observe-component/rxjs';

export function withProps(definedProps: any) {
    return (Component: Component): React.StatelessComponent<any> => 
        (props: any) => <Component {...definedProps} {...props} />;
}

function select(stream: Observable<EventDefinition>, category: string) {
    return stream.filter((eventDef) => eventDef.category === category)
        .map((eventDef) => eventDef.event);
};

export type Selectable<E> = {
    stream: Observable<EventDefinition>,
    select: (category: keyof E) => Observable<any>,
};

export function selectable<E>(stream: Observable<EventDefinition>): Selectable<E> {
    return {
        stream,
        select: (category) => select(stream, category),
    };
}
