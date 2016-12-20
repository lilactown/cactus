"use strict";
;
;
;
;
;
function makeEventDriver() {
    return (sinkProxies, key) => {
        const proxy = sinkProxies[key];
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
