import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

function view(model$) {
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

    return Cactus.connectView(CounterView, {
        incButton: Cactus.fromComponent(IncButton),
        decButton: Cactus.fromComponent(DecButton),
        incOddBtn: Cactus.fromComponent(IncOddBtn),
    }, model$);
}

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
        .startWith(0);
        
    const model$ = count$.map((count) => ({ count }));

    const { view$, events$ } = view(model$);
    
    const sinks = {
        render: view$,
        events: events$,
        count: count$,
    };
    return sinks;
}

const drivers = {
    render: Cactus.makeReactComponentDriver(),
    events: Cactus.makeEventDriver(),
    count: Cactus.makeReactPropsDriver('onChange'),
};

export const Counter = Cactus.appAsComponent(main, drivers);
