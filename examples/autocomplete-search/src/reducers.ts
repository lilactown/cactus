import * as Rx from 'rxjs/Rx';
import { Intents } from './intent';
import { Model } from './model';

/*
	# Reducer pattern
	
	Intents are mapped to new states:
		Intent<Delta>.map(ReducerFactory)
	
	ReducerFactory have the following signature:
		ReducerFactory :: delta -> (state -> newState)

	Thus reducing the intents from a stream of UI changes, to a stream of
	functions with the signature:
		reducer :: state -> newState

	This means that the model can then transform the intent like so:
		model = reducers(intents)
			// reducer :: state -> newState
			.scan((state, reducer) => reducer(state));
*/

export type Reducer = (state: Model) => Model

function createReducer(arg: Partial<Model>): Reducer {
	const newState = arg;
	return (oldState: Model) =>
		Object.assign({}, oldState, newState);
}

export function reducers(intents: Intents): Rx.Observable<Reducer> {
	const valueReducer$ = intents.value$
		.map((value) => createReducer({ value }));

	const hideResultsReducer$ = intents.hideResults$
		.map(() => createReducer({
			showResults: false,
			results: [],
			highlighted: null,
		}));

	const resultsReducer$ = intents.results$
		.map((body: any[]) => {
			const results = body[1];
			return createReducer({
				results,
				showResults: true,
			});
		});
	
	const highlightReducer$ = intents.highlight$
		.map((highlighted) => createReducer({ highlighted }));

	const highlightMoveUpReducer$ = intents.highlightMoveUp$
		.map(({ value: event }) => (oldState: Model): Model => {
			event.preventDefault();
			const isShown = oldState.showResults && oldState.results.length;
			const highlighted = !isShown ? null :
				(oldState.highlighted === null) ? 0 : 
				oldState.highlighted > 0 ? oldState.highlighted-1 : 9;
			return Object.assign({}, oldState, {
				highlighted,
			});
		});

	const highlightMoveDownReducer$ = intents.highlightMoveDown$
		.map(({ value: event }) => (oldState: Model): Model => {
			event.preventDefault();
			const isShown = oldState.showResults && oldState.results.length;
			const highlighted = !isShown ? null :
				(oldState.highlighted === null) ? 0 :
				oldState.highlighted < 9 ? oldState.highlighted+1 : 0;
			return Object.assign({}, oldState, {
				highlighted,
			});
		});

	const completeSelectedHighlightReducer$ = intents.completeSelectedHighlight$
		.map(({ value: event }) => (oldState: Model): Model => {
			const value = oldState.results[oldState.highlighted];
			if (oldState.highlighted === null) {
				return oldState;
			}
			event.preventDefault();
			return Object.assign({}, oldState, {
				value,
				showResults: false,
				results: [],
				highlighted: null,
			});
		});

	const autoCompleteReducer$ = intents.autoComplete$
		.map(({ props }) => createReducer({
			value: props.children,
			showResults: false,
			highlighted: null,
			results: [],
		}));

	return Rx.Observable.merge(
		valueReducer$,
		resultsReducer$,
		autoCompleteReducer$,
		hideResultsReducer$,
		highlightReducer$,
		completeSelectedHighlightReducer$,
		highlightMoveUpReducer$,
		highlightMoveDownReducer$,
	);
}
