"use strict";
// re-export observe-component library
var rxjs_1 = require("observe-component/rxjs");
exports.observeComponent = rxjs_1.observeComponent;
exports.fromComponent = rxjs_1.fromComponent;
;
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
