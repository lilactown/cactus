"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const MVI = require("./core");
const RD = require("./drivers/react");
const lodash_1 = require("lodash");
;
;
function createAppComponent(main, drivers, propsMap, displayName) {
    return _a = class App extends React.Component {
            componentWillMount() {
                const extDrivers = __assign({}, drivers, { render: RD.makeReactStateDriver(({ View, state }) => {
                        this.setState(state);
                        if (!this.component) {
                            this.component = View;
                        }
                        lodash_1.forEach(propsMap, (v, k) => {
                            if (this.props[k]) {
                                this.props[k](v(state));
                            }
                        });
                    }) });
                const { run } = MVI.App(main, extDrivers);
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
exports.createAppComponent = createAppComponent;
