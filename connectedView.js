"use strict";
const Rx_1 = require("rxjs/Rx");
const lodash_1 = require("lodash");
;
function makeConnectedEvents(events) {
    const eventDefs = lodash_1.map(events, (event$, key) => {
        return event$.map((ev) => ({
            category: key,
            event: ev,
        }));
    });
    const stream = Rx_1.Observable.merge(...eventDefs);
    return stream;
}
function connectedView(View, events) {
    return function connectViewTo(model) {
        return {
            view$: model.map((state) => ({ View, state })),
            events$: makeConnectedEvents(events),
        };
    };
}
exports.connectedView = connectedView;
