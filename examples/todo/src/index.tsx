import * as Cactus from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import { view, Events } from './view';

function main(sources) {
    const actions = Cactus.selectable<Events>(sources.events);
    const addTodoIntent$ = actions.select('addTodo')
        .filter(({ type }) => type === "onKeyPress")
        .filter(({ value }) => value.key === "Enter")
        .map(({ value }) => value.target.value)
        .map((name) => ({ todos, newTodoName }) => {
            const newTodos = todos.slice();
            newTodos.push({
                name,
                completed: false,
            });
            return {
                todos: newTodos,
                newTodoName: '',
            };
        });

    const removeTodoIntent$ = actions.select('removeButton')
        .map(({ props: { id } }) => ({ todos, newTodoName }) => {
            const newTodos = todos.slice();
            newTodos.splice(id, 1);
            return {
                todos: newTodos,
                newTodoName,
            };
        });

    const toggleTodoIntent$ = actions.select('itemCheckboxes')
        .map(({ value: { target: { checked } }, props: { id } }) => ({ todos, newTodoName }) => {
            const newTodos = todos.slice();
            newTodos[id].completed = checked;
            return {
                todos: newTodos,
                newTodoName,
            };
        });

    const newTodoNameIntent$ = actions.select('addTodo')
        .filter(({ type }) => type === "onChange")
        .map(({ value: { target: { value } } }) => ({ todos, newTodoName }) => ({
            todos,
            newTodoName: value,
        }));

    const model$ = 
        Observable.merge(addTodoIntent$, toggleTodoIntent$, removeTodoIntent$, newTodoNameIntent$)
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
