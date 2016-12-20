"use strict";
;
;
;
;
function makeReactPropsDriver(propKey) {
    return function propsDriver(sinkProxies, key) {
        const proxy = sinkProxies[key];
        const source = proxy.map((v) => {
            this.props[propKey] && this.props[propKey](v);
        });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeReactPropsDriver = makeReactPropsDriver;
