import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

// our child as component
import { Counter } from './counter';

function view(model$) {
    const CounterA = Cactus.observeComponent('onChange')(Counter);
    const CounterB = Cactus.observeComponent('onChange')(Counter);

    function View({ total }) {
        return (
            <div>
                <CounterA />
                <CounterB />
                Total: { total }
            </div>
        )
    }

    return Cactus.connectView(View, {
        counterA: Cactus.fromComponent(CounterA),
        counterB: Cactus.fromComponent(CounterB),
    }, model$);
}

function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);
    const counterA$ = actions.select('counterA')
        .map(({ value }) => (counts) =>
            ({ ...counts, counterA: value }));
    const counterB$ = actions.select('counterB')
        .map(({ value }) => (counts) =>
            ({ ...counts, counterB: value}));

    const model$ = Observable.merge(counterA$, counterB$)
        .scan((counts, reducer) => reducer(counts), { counterA: 0, counterB: 0 })
        .startWith({ counterA: 0, counterB: 0 })
        .map(({ counterA, counterB }) => ({ total: counterA + counterB }))

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
