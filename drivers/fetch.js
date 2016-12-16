"use strict";
require("whatwg-fetch");
const Rx = require("rxjs/Rx");
;
;
;
;
function makeFetchDriver() {
    return (sinkProxies) => {
        const source = sinkProxies.fetch
            .switchMap((params) => {
            return Rx.Observable.fromPromise(fetch((params.url)));
        });
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeFetchDriver = makeFetchDriver;
function makeJSONDriver() {
    return (sinkProxies) => {
        const source = sinkProxies.fetch
            .flatMap((params) => {
            return Rx.Observable.fromPromise(fetch(params.url, params.options));
        })
            .flatMap((res) => Rx.Observable.fromPromise(res.json()));
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeJSONDriver = makeJSONDriver;
