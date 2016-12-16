"use strict";
;
;
;
;
function makeReactStateDriver(cb) {
    console.log('[ReactStateDriver] initiated');
    return (sinkProxies) => {
        console.log('[ReactStateDriver] state change started');
        const proxy = sinkProxies.state;
        const source = proxy.map(({ View, state }) => {
            console.log('[ReactStateDriver] changing state');
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
