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
// re-export observe-component library
var ComponentEvent_1 = require("observe-component/common/ComponentEvent");
exports.ComponentEvent = ComponentEvent_1.ComponentEvent;
var rxjs_1 = require("observe-component/rxjs");
exports.observeComponent = rxjs_1.observeComponent;
exports.fromComponent = rxjs_1.fromComponent;
var rxjs_2 = require("observe-component/rxjs");
exports.observe = rxjs_2.observeComponent;
exports.from = rxjs_2.fromComponent;
function withProps(definedProps) {
    return (Component) => (props) => React.createElement(Component, __assign({}, definedProps, props));
}
exports.withProps = withProps;
function select(stream, category) {
    return stream.filter((eventDef) => eventDef.category === category)
        .map((eventDef) => eventDef.event);
}
;
function selectable(stream) {
    return {
        stream,
        select: (category) => select(stream, category),
    };
}
exports.selectable = selectable;
