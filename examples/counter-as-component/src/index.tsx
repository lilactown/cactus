import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import { render } from 'react-dom';

const IncButton = Cactus.observeComponent('onClick')('button');
const DecButton = Cactus.observeComponent('onClick')('button');

function View({ count }) {
    return (
        <div>
            <div>Counter: { count }</div>
            <IncButton>+</IncButton>
            <DecButton>-</DecButton>
        </div>
    );
}

const view = Cactus.connectedView(View, {
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
        state: view$,
        events: events$,
    };
}

const drivers = {
    events: Cactus.makeEventDriver(),
};

// create our Cactus app as a good ol'-fashioned  React component
const Counter = Cactus.appAsComponent(main, drivers, {
    // we can also define a "props map" that will map our state
    // to properties that we can use as a public API
    onChange: ({ count }) => count,
});

// render it as you do
render(<Counter onChange={(count) => console.log(count)} />, document.getElementById('app'));
