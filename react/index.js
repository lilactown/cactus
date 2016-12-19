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
const state_1 = require("../drivers/state");
var ComponentEvent_1 = require("observe-component/common/ComponentEvent");
exports.ComponentEvent = ComponentEvent_1.ComponentEvent;
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
function connectedView(View, events) {
    return function connectViewTo(model) {
        return {
            view$: model.map((state) => ({ View, state })),
            events$: mergeEvents(events),
        };
    };
}
exports.connectedView = connectedView;
function appAsComponent(main, drivers, propsMap, displayName) {
    return _a = class App extends React.Component {
            componentWillMount() {
                const extDrivers = __assign({}, drivers, { state: state_1.makeReactStateDriver(({ View, state }) => {
                        const oldState = this.state;
                        if (!this.component) {
                            this.component = View;
                        }
                        if (propsMap) {
                            R.mapObjIndexed((v, k) => {
                                if (this.props[k]) {
                                    this.props[k](v(oldState, state));
                                }
                            }, propsMap);
                        }
                        this.setState(state);
                    }) });
                const { run } = Core.App(main, extDrivers);
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
