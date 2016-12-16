"use strict";
;
;
;
;
;
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
