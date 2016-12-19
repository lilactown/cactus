import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

const IncButton = Cactus.observeComponent('onClick')('button');
const DecButton = Cactus.observeComponent('onClick')('button');
const IncOddBtn = Cactus.observeComponent('onClick')('button');

function CounterView({ count }) {
    return (
        <div>
            <div>Counter: { count }</div>
            <IncButton>+</IncButton>
            <DecButton>-</DecButton>
            <IncOddBtn>Increment if odd</IncOddBtn>
        </div>
    );
}

const view = Cactus.connectedView(CounterView, {
    incButton: Cactus.fromComponent(IncButton),
    decButton: Cactus.fromComponent(DecButton),
    incOddBtn: Cactus.fromComponent(IncOddBtn),
});

function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);

    const inc$ = actions.select('incButton')
        .map(() => (count) => count + 1);
    const dec$ = actions.select('decButton')
        .map(() => (count) => count - 1);
    const incOdd$ = actions.select('incOddBtn')
        .map(() => (count) => count % 2 ? count + 1 : count);
    
    const count$ = Observable
        .merge(inc$, dec$, incOdd$)
        .scan((count, reducer) => reducer(count), 0)
        .startWith(0)
        .map((count) => ({ count }));

    const { view$, events$ } = view(count$);
    
    const sinks = {
        state: view$,
        events: events$,
    };
    return sinks;
}

const drivers = {
    // render: Cactus.makeReactDOMDriver(document.getElementById('app')),
    events: Cactus.makeEventDriver(),
};

export const Counter = Cactus.appAsComponent(
    main,
    drivers,
    {
        onChange: (oldState, { count }) => count,
    },
);
