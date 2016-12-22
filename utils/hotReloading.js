"use strict";
const Rx = require("rxjs/Rx");
const R = require("ramda");
function makeHotDriver(driver) {
    const hotSource = new Rx.ReplaySubject();
    let hotSubscription;
    let originalDispose;
    return function hotProxyDriver(sinks, key) {
        // if we're already running, dispose of our subscribers
        if (hotSubscription) {
            hotSubscription.unsubscribe();
            originalDispose();
        }
        // by remembering the outputs of the drivers, we hopefully
        // avoid repeating side effects (which may not be idempotent)
        const { source, dispose } = driver(sinks, key);
        originalDispose = dispose;
        // subscribe to our source with our ReplaySubject
        // this will remember everything it emits, and then
        // when a new subscriber adds itself (e.g. above!)
        // it will replay all of it's events, in order
        hotSubscription = source.subscribe(hotSource);
        // return our "hot" driver
        return {
            source: hotSource.asObservable(),
            dispose: () => {
                hotSubscription.unsubscribe();
                dispose();
            }
        };
    };
}
function makeHot(drivers) {
    // apply makeHotDriver to each driver definition
    const hotDrivers = R.mapObjIndexed(makeHotDriver);
    return hotDrivers(drivers);
}
exports.makeHot = makeHot;
