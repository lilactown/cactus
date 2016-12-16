import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

const IncButton = Cactus.observeComponent('onClick')('button');
const DecButton = Cactus.observeComponent('onClick')('button');

function Counter({ count }) {
    return (
        <div>
            <div>Counter: { count }</div>
            <IncButton>+</IncButton>
            <DecButton>-</DecButton>
        </div>
    );
}

const view = Cactus.connectedView(Counter, {
    incButton: Cactus.fromComponent(IncButton),
    decButton: Cactus.fromComponent(DecButton),
});

function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);
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

Cactus.run(main, {
    render: Cactus.makeReactDOMDriver(document.getElementById('app')),
    events: Cactus.makeEventDriver(),
});
