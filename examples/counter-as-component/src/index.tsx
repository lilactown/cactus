import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import { render } from 'react-dom';

function view(model$) {
    const IncButton = Cactus.observeComponent('onClick')('button');
    const DecButton = Cactus.observeComponent('onClick')('button');

    function CounterView({ count }) {
        return (
            <div>
                <div>Counter: { count }</div>
                <IncButton>+</IncButton>
                <DecButton>-</DecButton>
            </div>
        );
    }

    return Cactus.connectView(CounterView, {
        incButton: Cactus.fromComponent(IncButton),
        decButton: Cactus.fromComponent(DecButton),
    }, model$);
}

function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);

    const inc$ = actions.select('incButton').map(() => 1);
    const dec$ = actions.select('decButton').map(() => -1);
    
    const count$ = Observable
        .merge(inc$, dec$)
        .startWith(0)
        .scan((total, delta) => total + delta)
        .map((count) => ({ count }));

    const { view$, events$ } = view(count$);
    
    const sinks = {
        render: view$,
        events: events$,
        value: count$,
    };
    return sinks;
}

const drivers = {
    events: Cactus.makeEventDriver(),
};

// create our Cactus app as a good ol'-fashioned  React component
const Counter = Cactus.appAsComponent(main, drivers,
    // we can also define a "props map" that will map our state
    // to properties that we can use as a public API
    // (sinks, props: any) => {
    //     sinks.value.subscribe(({ count }) => {
    //         props.onChange && props.onChange(count)
    //     });
    // }
);

// render it as you do
render(
    <Counter onChange={(count) => console.log(count)} />,
    document.getElementById('app')
);
