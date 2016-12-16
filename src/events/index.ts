import { Observable } from 'rxjs/Rx';

// re-export observe-component library
export { observeComponent, fromComponent } from 'observe-component/rxjs';

export type EventDefinition = {
	category: string,
	event: any,
};

export interface Events {
	[K: string]: Observable<any>
};

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
