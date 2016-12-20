import * as Rx from 'rxjs/Rx';
import { ComponentEvent } from 'observe-component/common/ComponentEvent';
import { Selectable } from '../../../react/helpers';
import { ViewEvents } from './view';
export interface Intents {
	searchRequest$: Rx.Observable<any>,
	value$: Rx.Observable<string>,
	hideResults$: Rx.Observable<ComponentEvent>, 
	results$: Rx.Observable<any>,
	highlight$: Rx.Observable<number>, 
	highlightMoveUp$: Rx.Observable<ComponentEvent>,
	highlightMoveDown$: Rx.Observable<ComponentEvent>,
	completeSelectedHighlight$: Rx.Observable<ComponentEvent>,
	autoComplete$: Rx.Observable<ComponentEvent>
};

function byType(desiredType: string): (event: ComponentEvent) => boolean {
	return ({ type }: ComponentEvent) => type === desiredType;
}

function byKey(key: string): (event: ComponentEvent) => boolean {
	return ({ value }: ComponentEvent) => value.key === key; 
}

export function intents(responses$: Rx.Observable<any>, events: Selectable<ViewEvents>): Intents {
	const isHighlighted$ = Rx.Observable.merge(
		events.select('resultsList').filter(byType('onMouseEnter'))
			.map(() => true),
		events.select('resultsList').filter(byType('onMouseLeave'))
			.map(() => false),
	);

	const value$ = events.select('input')
		.filter(byType('onChange'))
		.map(({ value: event }): string => event.target.value);

	const hideResults$ = Rx.Observable.merge(
		events.select('input')
			.filter(byType('onBlur'))
			.withLatestFrom(
				isHighlighted$,
				(blur, isHighlighted) =>
					[blur, isHighlighted]
			)
			.filter(([blur, isHighlighted]) => !isHighlighted)
			.map(([blur, isHighlighted]) => blur),
		events.select('input')
			.filter(byType('onChange'))
			.filter(({ value: event }) => event.target.value === ""),
	);

	const highlight$ = Rx.Observable.merge(
		events.select('resultsList').filter(byType('onMouseEnter'))
			.map(({ props }): number => props.id),
		events.select('resultsList').filter(byType('onMouseLeave'))
			.map((): void => null),
	);

	const searchRequest$ = value$
		.debounceTime(300);

	const completeSelectedHighlight$ = events.select('input')
		.filter(byType('onKeyPress'))
		.filter(byKey('Enter'));
	
	const highlightMoveDown$ = events.select('input')
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowDown'));

	const highlightMoveUp$ = events.select('input')
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowUp'));
	
	const autoComplete$ = events.select('resultsList')
		.filter(byType('onClick'))
	
	const results$ = responses$;

	return {
		value$,
		hideResults$,
		highlight$,
		completeSelectedHighlight$,
		highlightMoveUp$,
		highlightMoveDown$,
		autoComplete$,
		searchRequest$,
		results$,
	};
}
