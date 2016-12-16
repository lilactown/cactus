"use strict";
const Rx = require("rxjs/Rx");
const lodash_1 = require("lodash");
;
;
;
;
;
function createProxies(drivers) {
    return lodash_1.mapValues(drivers, () => {
        return new Rx.Subject();
    });
}
function executeDrivers(drivers, sinkProxies) {
    return lodash_1.mapValues(drivers, (driver) => driver(sinkProxies));
}
function getSources(definitions) {
    return lodash_1.mapValues(definitions, (definition) => definition.source);
}
function createSinkDisposal(definitions) {
    const disposes = lodash_1.map(definitions, (definition) => definition.dispose);
    return () => disposes.forEach((dispose) => dispose());
}
function link(sinks, sinkProxies) {
    const subscriptions = lodash_1.map(sinks, (sink, name) => {
        const proxy = sinkProxies[name];
        return sink.subscribe(proxy);
    });
    return () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
}
function App(main, drivers) {
    const sinkProxies = createProxies(drivers);
    const sourceDefs = executeDrivers(drivers, sinkProxies);
    const disposeSinks = createSinkDisposal(sourceDefs);
    const sources = getSources(sourceDefs);
    const sinks = main(sources);
    return {
        sinks,
        sources,
        run: () => {
            const disposeProxies = link(sinks, sinkProxies);
            return () => {
                disposeSinks();
                disposeProxies();
            };
        },
    };
}
exports.App = App;
