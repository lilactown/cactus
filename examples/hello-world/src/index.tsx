import { run, makeReactDOMDriver } from '../../../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as React from 'react';

function HelloApp() {
    return (
        <div>
            <div>Hello, world!</div>
        </div>
    );
}

function main() {
    const view$ = Observable.of({ View: HelloApp, state: {} });
    return {
        render: view$,
    };
}

run(main, {
    render: makeReactDOMDriver(document.getElementById('app')),
});
