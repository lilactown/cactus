import * as Cactus from '../../../core';
import { makeReactDOMDriver } from '../../../drivers/react';
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

Cactus.App(main, {
    render: makeReactDOMDriver(document.getElementById('app')),
}).run();
