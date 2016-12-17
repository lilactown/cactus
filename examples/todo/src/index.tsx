import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import { view, Events } from './view';

function main(sources) {
    const actions = Cactus.selectable<Events>(sources.events);
    const newTodoIntent$ = actions.select('addTodo')
        .filter(({ value }) => value.key === "Enter")
        .map(({ value }) => value.target.value)
        .map((name) => ({ todos }) => {
            const newTodos = todos.slice();
            newTodos.push({
                name,
                completed: false,
            });
            return {
                todos: newTodos
            };
        });

    const toggleTodoIntent$ = actions.select('itemCheckboxes')
        .map(({ value, props }) => ({ todos }) => {
            const newTodos = todos.slice();
            const { id } = props;
            const { checked } = value.target;

            newTodos[id].completed = checked;

            return {
                todos: newTodos,
            };
        });

    const model$ = 
        Observable.merge(newTodoIntent$, toggleTodoIntent$,)
        .scan((state, reducer) => reducer(state), { todos: [] })
        .startWith({ todos: [] });

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
