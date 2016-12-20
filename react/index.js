"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/merge");
const React = require("react");
const R = require("ramda");
const Core = require("../core");
;
;
function mergeEvents(events) {
    const mapEventDefs = R.mapObjIndexed((event$, key) => event$.map((ev) => ({
        category: key,
        event: ev,
    })));
    const eventDefs = R.compose(R.values, mapEventDefs)(events);
    const stream = Observable_1.Observable.merge(...eventDefs);
    return stream;
}
function connectView(View, events, model$) {
    return {
        view$: model$.map((state) => ({ View, state })),
        events$: mergeEvents(events),
    };
}
exports.connectView = connectView;
function injectContext(context, drivers) {
    const bind = R.map((driver) => driver.bind(context));
    return R.mapObjIndexed((driver) => {
        return driver.bind(context);
    }, drivers);
}
function appAsComponent(main, drivers, 
    // propsMap?: (sinks: any, props: P) => void,
    displayName) {
    return _a = class App extends React.Component {
            componentWillMount() {
                const boundDrivers = injectContext(this, drivers);
                const { run, sinks } = Core.App(main, boundDrivers);
                // propsMap && propsMap(sinks, this.props);
                this.dispose = run();
            }
            componentWillUnmount() {
                this.dispose();
            }
            render() {
                const AppView = this.component;
                return (React.createElement(AppView, __assign({}, this.state)));
            }
        },
        _a.displayName = `App(${displayName || ''})`,
        _a;
    var _a;
}
exports.appAsComponent = appAsComponent;
