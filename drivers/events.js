"use strict";
;
;
;
;
;
function makeEventDriver() {
    return (sinkProxies) => {
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
