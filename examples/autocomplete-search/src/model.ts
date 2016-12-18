import * as Rx from 'rxjs/Rx';
import { reducers } from './reducers';
import { Intents } from './intent';
import { Reducer } from './reducers';

export interface Model {
	value: string,
	results: string[],
	showResults: boolean,
	highlighted: number | null,
};

export function model(intents: Intents) {
	return reducers(intents)
		.startWith(<any>{
			value: '',
			results: [],
			showResults: false,
			highlighted: null,
		})
		.scan((state: Model, reducer: Reducer) => reducer(state));
}
