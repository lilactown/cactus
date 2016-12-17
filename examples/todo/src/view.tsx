import * as Rx from 'rxjs/Rx';
import * as Cactus from '../../../';
import * as React from 'react';

const ItemCheckbox =
    Cactus.observeComponent<any>('onChange')('input');

interface ItemProps {
    name: string,
    completed: boolean,
    id: number,
};

function Item({ name, completed, id }: ItemProps) {
    return (
        <div>
            <label>
                <ItemCheckbox type="checkbox" id={id} checked={completed} />
                { name }
            </label>
        </div>
    );
}

const AddTodo =
    Cactus.observeComponent<any>('onKeyPress')('input');

type TodoProps = {
    todos: Partial<ItemProps>[],
};

function TodoView({ todos }: TodoProps) {
    return (
        <div>
            <h1>To do list</h1>
            {todos.map((todo, i) => 
                <Item {...todo} id={i} key={i} />
            )}
            <AddTodo type="text" />
        </div>
    );
}

export type Events = {
    itemCheckboxes: Rx.Observable<Cactus.ComponentEvent>,
    addTodo: Rx.Observable<Cactus.ComponentEvent>,
};

export const view = Cactus.connectedView<TodoProps>(
    TodoView,
    {
        itemCheckboxes: Cactus.fromComponent(ItemCheckbox),
        addTodo: Cactus.fromComponent(AddTodo),
    }
);
