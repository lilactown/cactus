import * as Cactus from '../../../';
import * as React from 'react';
import { view, Events } from './view';
import { intents } from './intents';

function main(sources) {
    const actions = Cactus.selectable<Events>(sources.events);
    const intents$ = intents(actions);
    const model$ = intents$
        .scan((state, reducer) => reducer(state), { todos: [], newTodoName: '' })
        .startWith({ todos: [], newTodoName: '' });

    const { view$, events$ } = view(model$);

    const sinks = {
        render: view$,
        events: events$,
    };
    return sinks;
}

const drivers = {
    render: Cactus.makeReactDOMDriver(document.getElementById('app')),
    events: Cactus.makeEventDriver(),
};

Cactus.run(main, drivers);
