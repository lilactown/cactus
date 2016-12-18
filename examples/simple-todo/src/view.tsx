import * as Rx from 'rxjs/Rx';
import * as Cactus from '../../../';
import * as React from 'react';

const ItemCheckbox =
    Cactus.observeComponent<any>('onChange')('input');

const RemoveButton =
    Cactus.observeComponent<any>('onClick')('button');

interface ItemProps {
    name: string,
    completed: boolean,
    id: number,
};

function Item({ name, completed, id }: ItemProps) {
    const labelStyle = Object.assign({}, styles.labelText, completed ? styles.labelDone : {});
    return (
        <div style={styles.item}>
            <label style={{ display: "block" }}>
                <ItemCheckbox
                    style={styles.itemCheckbox}
                    type="checkbox"
                    id={id}
                    checked={completed}
                />
                <span style={labelStyle}>
                    { name }
                </span>
                <RemoveButton id={id} style={styles.removeButton}>x</RemoveButton>
            </label>
        </div>
    );
}

const AddTodo =
    Cactus.observeComponent<any>('onKeyPress', 'onChange')('input');

type TodoProps = {
    todos: [{
        name: string,
        completed: boolean,
    }],
    newTodoName: string,
};

function TodoView({ todos, newTodoName }: TodoProps) {
    return (
        <div style={styles.todosList}>
            <h1>To do list</h1>
            {todos.map((todo, i) => 
                <Item {...todo} id={i} key={i} />
            )}
            <AddTodo value={newTodoName} style={styles.addTodo} type="text" />
        </div>
    );
}

const styles = {
    itemCheckbox: {
        float: 'left',
    },
    removeButton: {
        float: 'right',
    },
    labelText: {
        paddingLeft: 5,
    },
    labelDone: {
        textDecoration: 'line-through',
        color: "#ccc",
    },
    item: {
        padding: 5,
        backgroundColor: '#fff7dd',
    },
    addTodo: {
        fontSize: 14,
        margin: 5,
        marginLeft: 26,
    },
    todosList: {
        width: "500px",
    },
};

export type Events = {
    itemCheckboxes: Rx.Observable<Cactus.ComponentEvent>,
    addTodo: Rx.Observable<Cactus.ComponentEvent>,
    removeButton: Rx.Observable<Cactus.ComponentEvent>,
};

export const view = Cactus.connectedView<TodoProps>(
    TodoView,
    {
        itemCheckboxes: Cactus.fromComponent(ItemCheckbox),
        addTodo: Cactus.fromComponent(AddTodo),
        removeButton: Cactus.fromComponent(RemoveButton),
    }
);
