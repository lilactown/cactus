import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

// our child as component
import { Counter } from './counter';
const CounterA = Cactus.observeComponent('onChange')(Counter());
const CounterB = Cactus.observeComponent('onChange')(Counter());

function View({ total }) {
    return (
        <div>
            <CounterA />
            <CounterB />
            Total: { total }
        </div>
    )
}

const view = Cactus.connectedView(View, {
    counterA: Cactus.fromComponent(CounterA),
    counterB: Cactus.fromComponent(CounterB),
});

function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);
    const counterA$ = actions.select('counterA')
        .do((k) => console.log(k))
        .map(({ value }) => (total) => total + value);
    const counterB$ = actions.select('counterB')
        .map(({ value }) => (total) => total + value);

    const model$ = Observable.merge(counterA$, counterB$)
        .scan((total, reducer) => reducer(total), 0)
        .startWith(0)
        .map((total) => ({ total }));

    const { view$, events$ } = view(model$);

    return {
        render: view$,
        events: events$,
    };
}

Cactus.run(main, {
    render: Cactus.makeReactDOMDriver(document.getElementById('app')),
    events: Cactus.makeEventDriver(),
});
