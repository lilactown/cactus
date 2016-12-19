import * as Rx from 'rxjs/Rx';
import * as Cactus from '../../../core';
import * as React from '../../../drivers/react';
import * as Fetch from '../../../drivers/fetch';
import * as Events from '../../../drivers/events';
import { selectable } from '../../../events';

// app
import { createSearchView, ViewEvents } from './view';
import { model } from './model';
import { intents } from './intent';

type Sources = React.RenderSource & Fetch.FetchSource & Events.EventSource;
type Drivers = React.RenderDriverDefinition & Fetch.FetchDriverDefinition & Events.EventDriverDefinition;
type Sinks = React.RenderSink & Fetch.FetchSink & Events.EventSink;

function generateRequest(term$: Rx.Observable<string>) {
	return term$
		.filter((term) => term !== "")
		.map((term) => ({
			url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
		}));
}

function main(sources: Sources): Sinks {
	const events = selectable(sources.events);
	const responses$ = sources.fetch;
	const view = createSearchView();
	const actions = intents(responses$, events);
	const { view$, events$ } = view(model(actions));
	return {
		render: view$,
		fetch: generateRequest(actions.searchRequest$),
		events: events$,
	};
}

Cactus.run<Sources, Drivers>(main, {
	render: React.makeReactDOMDriver(document.getElementById('app')),
	fetch: Fetch.makeJSONDriver(),
	events: Events.makeEventDriver(),
});
