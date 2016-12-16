"use strict";
require("whatwg-fetch");
const Observable_1 = require("rxjs/Observable");
;
;
;
;
function makeFetchDriver() {
    return (sinkProxies) => {
        const source = sinkProxies.fetch
            .switchMap((params) => {
            return Observable_1.Observable.fromPromise(fetch((params.url)));
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
            return Observable_1.Observable.fromPromise(fetch(params.url, params.options));
        })
            .flatMap((res) => Observable_1.Observable.fromPromise(res.json()));
        const subscription = source.subscribe();
        const dispose = () => subscription.unsubscribe();
        return {
            source,
            dispose,
        };
    };
}
exports.makeJSONDriver = makeJSONDriver;
