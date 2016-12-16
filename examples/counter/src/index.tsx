import { App } from '../../../core';
import { observeComponent, fromComponent, selectable } from '../../../events';
import { connectedView } from '../../../react';
import { makeEventDriver } from '../../../drivers/events';
import { makeReactDOMDriver } from '../../../drivers/react';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

const IncButton = observeComponent('onClick')('button');
const DecButton = observeComponent('onClick')('button');

function Counter({ count }) {
    return (
        <div>
            <div>Counter: { count }</div>
            <IncButton>+</IncButton>
            <DecButton>-</DecButton>
        </div>
    );
}

const view = connectedView(Counter, {
    incButton: fromComponent(IncButton),
    decButton: fromComponent(DecButton),
});

function main(sources) {
    const actions = selectable<any>(sources.events);
    const add$ = actions.select('incButton').map(() => 1);
    const dec$ = actions.select('decButton').map(() => -1);
    const count$ = Observable
        .merge(add$, dec$)
        .startWith(0)
        .scan((count, delta) => count + delta)
        .map((count) => ({ count }));

    const { view$, events$ } = view(count$);
    return {
        render: view$,
        events: events$,
    };
}

App(main, {
    render: makeReactDOMDriver(document.getElementById('app')),
    events: makeEventDriver(),
}).run();
