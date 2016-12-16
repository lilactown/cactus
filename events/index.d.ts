import { Observable } from 'rxjs/Rx';
export { observeComponent, fromComponent } from 'observe-component/rxjs';
export declare type EventDefinition = {
    category: string;
    event: any;
};
export interface Events {
    [K: string]: Observable<any>;
}
export declare type Selectable<E> = {
    stream: Observable<EventDefinition>;
    select: (category: keyof E) => Observable<any>;
};
export declare function selectable<E>(stream: Observable<EventDefinition>): Selectable<E>;
