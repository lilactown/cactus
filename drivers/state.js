"use strict";
;
;
;
;
function makeReactStateDriver(cb) {
    return (sinkProxies) => {
        const proxy = sinkProxies.state;
        const source = proxy.map(({ View, state }) => {
            cb({ View, state });
        });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeReactStateDriver = makeReactStateDriver;
