"use strict";
require("whatwg-fetch");
const Observable_1 = require("rxjs/Observable");
;
;
;
;
function makeFetchDriver() {
    return (sinkProxies, key) => {
        const source = sinkProxies[key]
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
function makeFetchJSONDriver() {
    return (sinkProxies, key) => {
        const source = sinkProxies[key]
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
exports.makeFetchJSONDriver = makeFetchJSONDriver;
