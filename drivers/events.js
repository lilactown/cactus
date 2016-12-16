"use strict";
;
;
;
;
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
function makeEventDriver() {
    console.log('[EventDriver] initiated');
    return (sinkProxies) => {
        console.log('[EventDriver] state change started');
        const proxy = sinkProxies.events;
        const source = proxy;
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeEventDriver = makeEventDriver;
