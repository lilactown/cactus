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
const react_dom_1 = require("react-dom");
;
;
;
;
function makeReactDOMDriver(DOMNode) {
    return (sinkProxies, key) => {
        const proxy = sinkProxies[key];
        const source = proxy.map(({ View, state }) => {
            react_dom_1.render(React.createElement(View, __assign({}, state)), DOMNode);
        });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeReactDOMDriver = makeReactDOMDriver;
