import * as Rx from 'rxjs/Rx';
import * as Cactus from '../../../';
import * as React from 'react';
import { flowRight as compose } from 'lodash';

export type Events = {
    itemCheckboxes: Rx.Observable<Cactus.ComponentEvent>,
    addTodo: Rx.Observable<Cactus.ComponentEvent>,
    removeButton: Rx.Observable<Cactus.ComponentEvent>,
};

export function createTodoView() {
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
        },
        header: {
        },
        todosList: {
            width: "500px",
            margin: "auto",
            textAlign: 'center',
        },
    };

    const ItemCheckbox = compose(
        Cactus.observeComponent<any>('onChange'),
        Cactus.withProps({
            style: styles.itemCheckbox,
            type: "checkbox",
        }),
    )('input');

    const RemoveButton = compose(
        Cactus.observeComponent<any>('onClick'),
        Cactus.withProps({
            style: styles.removeButton,
        }),
    )('button');


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
                        id={id}
                        checked={completed}
                    />
                    <span style={labelStyle}>
                        { name }
                    </span>
                    <RemoveButton id={id}>x</RemoveButton>
                </label>
            </div>
        );
    }

    const AddTodo = compose(
        Cactus.observeComponent<any>('onKeyPress', 'onChange'),
        Cactus.withProps({
            style: styles.addTodo,
            type: "text",
        }),
    )('input');


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
                <h1 style={styles.header}>To Do List</h1>
                {todos.map((todo, i) => <Item {...todo} id={i} key={i} /> )}
                To do: <AddTodo value={newTodoName} />
                <div>
                    Type a to do and press enter to add a new item
                </div>
            </div>
        );
    }

    return Cactus.connectedView<TodoProps>(
        TodoView,
        {
            itemCheckboxes: Cactus.fromComponent(ItemCheckbox),
            addTodo: Cactus.fromComponent(AddTodo),
            removeButton: Cactus.fromComponent(RemoveButton),
        }
    );
}
