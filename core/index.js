"use strict";
const Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/map");
const R = require("ramda");
const ramda_1 = require("ramda");
;
;
;
;
;
function createProxies(drivers) {
    return ramda_1.mapObjIndexed(() => {
        return new Subject_1.Subject();
    }, drivers);
}
function executeDrivers(drivers, sinkProxies) {
    return ramda_1.mapObjIndexed((driver) => driver(sinkProxies), drivers);
}
function getSources(definitions) {
    return ramda_1.mapObjIndexed((definition) => definition.source, definitions);
}
function createSinkDisposal(definitions) {
    const disposes = R.compose(R.values, ramda_1.map((definition) => definition.dispose))(definitions);
    return () => disposes.forEach((dispose) => dispose());
}
function link(sinks, sinkProxies) {
    const toSubscription = ramda_1.mapObjIndexed((sink, name) => {
        const proxy = sinkProxies[name];
        return sink.subscribe(proxy);
    });
    // const disposal = forEach((subscription: Subscription) => subscription.unsubscribe())
    const subscriptions = R.compose(R.values, toSubscription)(sinks);
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
function run(main, drivers) {
    const { run } = App(main, drivers);
    return run();
}
exports.run = run;
