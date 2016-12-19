import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';

// define our view function which will observe our state
function view(model$) {
        // define buttons that we can receive 'onClick' events on
    const IncButton = Cactus.observeComponent('onClick')('button');
    const DecButton = Cactus.observeComponent('onClick')('button');

    // define our react component, serving as our view
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

// main takes in "sources" (external input) and returns "sinks" ()
function main(sources) {
    const actions = Cactus.selectable<any>(sources.events);

    // define increment actions
    const inc$ = actions.select('incButton').map(() => 1);
    // define decrement actions
    const dec$ = actions.select('decButton').map(() => -1);
    
    // define our counter state
    const count$ = Observable
        // merge inc$ and dec$ into one stream of values
        .merge(inc$, dec$)
        // start counter at 0
        .startWith(0)
        // reduce each change to the new counter total
        .scan((total, delta) => total + delta)
        // format it to accord with our component's props
        .map((count) => ({ count }));

    const { view$, events$ } = view(count$);
    
    // define our "sinks" - outputs of our program
    const sinks = {
        render: view$,
        events: events$,
    };
    return sinks;
}

// define our "drivers" - interfaces to the outside world.
// these will consume our sinks and create side effects,
// and may also create sources which our program will consume
const drivers = {
    render: Cactus.makeReactDOMDriver(document.getElementById('app')),
    events: Cactus.makeEventDriver(),
};

// run our program!
Cactus.run(main, drivers);
