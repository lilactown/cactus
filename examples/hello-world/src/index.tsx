import { run, makeReactDOMDriver } from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as React from 'react';

// define our view (a React component)
function HelloView() {
    return (
        <div>
            <div>Hello, world!</div>
        </div>
    );
}

// `main` is our program - it will handle any inputs, outputs,
// state changes, events, etc. that an app might have
function main() {
    // `view$` is a stream of "view states" - a component and it's current state
    const view$ = Observable.of({ View: HelloView, state: {} });

    // return the "sinks" (outputs) of our program
    return {
        render: view$, // `render` corresponds to our React DOM driver
    };
}

// run our program
run(main, {
    // this will take our `view$` stream and render it the DOM
    render: makeReactDOMDriver(document.getElementById('app')),
});
