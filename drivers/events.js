"use strict";
;
;
;
;
;
function makeEventDriver(persist) {
    return (sinkProxies, key) => {
        const proxy = sinkProxies[key];
        const source = persist ? proxy.do(({ event }) => {
            if (event.value.persist)
                event.value.persist;
        }) : proxy;
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeEventDriver = makeEventDriver;
