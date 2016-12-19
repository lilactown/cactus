import * as Rx from 'rxjs/Rx';
import * as React from 'react';
import { observeComponent, fromComponent } from '../../../events';
import { connectView } from '../../../react';
import { Model } from './model'

export interface ViewProps {
	value: string,
	results: Object[],
	showResults: boolean,
	highlighted: number,
};

export type ViewEvents = {
	input: Rx.Observable<any>,
	resultsList: Rx.Observable<any>,
}


interface ResultsListProps {
	results: Object[],
	highlighted: number,
};

export function view(model$: Rx.Observable<Model>) {
	const SearchInput = observeComponent<React.HTMLProps<any>>(
		'onChange',
		'onBlur',
		'onKeyPress',
		'onKeyDown',
	)('input');

	function View({ value, results = [], showResults = false, highlighted = null }: ViewProps) {
		return (
			<div style={styles.comboBox}>
				<SearchInput style={styles.search} type="text" value={value} />
				{showResults && results.length ?
					<ResultsList
						results={results}
						highlighted={highlighted}
					/> :
					null
				}
			</div>
		);
	}

	const Result = observeComponent<any>(
			'onClick',
			'onMouseEnter',
			'onMouseLeave',
		)('li');

	function ResultsList({ results, highlighted }: ResultsListProps) {
		return (
			<div style={styles.resultsBox}>
				<ul style={styles.resultsList}>
					{results.map((title: string, i: number) => 
						<Result
							key={i}
							style={Object.assign(
								{},
								styles.result,
								i === highlighted ? styles.highlighted : {},
							)}
							id={i}
						>
							{title}
						</Result>
					)}
				</ul>
			</div>
		);
	}

	const styles = {
		comboBox: {
			position: 'relative',
		},
		search: {
			fontSize: 15,
			width: "100%",
			fontFamily: "sans-serif",
			height: 30,
		},
		resultsBox: {
			position: 'absolute',
			top: 30,
			left: 0,
			right: 0,
			zIndex: 999,
			backgroundColor: '#fff',
			boxShadow: "0px 4px 4px rgb(220,220,220)",
		},
		resultsList: {
			listStyle: "none",
			padding: 0,
			margin: 0,
			border: "1px solid #ccc",
		},
		result: {
			fontFamily: "sans-serif",
			fontSize: 16,
			borderBottom: "1px solid #ccc",
			padding: 5,
		},
		highlighted: {
			backgroundColor: 'rgba(16, 127, 242, .2)',
		},
	};

	const events: ViewEvents = {
		input: fromComponent(SearchInput),
		resultsList: fromComponent(Result),
	};

	return connectView<ViewProps>(View, events, model$);
}
