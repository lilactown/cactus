"use strict";
;
;
;
;
function makeReactComponentDriver() {
    return function stateDriver(sinkProxies, key) {
        const proxy = sinkProxies[key];
        const source = proxy.map(({ View, state }) => {
            const oldState = this.state;
            if (View !== this.component) {
                this.component = View;
            }
            this.setState(state);
        });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeReactComponentDriver = makeReactComponentDriver;
