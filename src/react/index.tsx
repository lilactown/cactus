import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import * as R from 'ramda';
import * as Core from '../core';

export type EventDefinition = {
	category: string,
	event: any,
};

export interface Events {
	[K: string]: Observable<any>
};

export type Component =
    React.ComponentClass<any> |
    React.StatelessComponent<any> |
    string;


export interface ViewDelta<P> {
    View: Component,
    state: P,
}

export interface PropsMap {
};

function mergeEvents(events: Events): Observable<EventDefinition> {
	const mapEventDefs =
		R.mapObjIndexed((event$: Observable<any>, key: string) =>
			event$.map((ev): EventDefinition => ({
				category: key,
				event: ev,
			}))
		);
	const eventDefs: Observable<EventDefinition>[] = R.compose(
		R.values,
		mapEventDefs
	)(events);
	const stream = Observable.merge(...eventDefs);
	return stream;
}

export function connectView<P>(View: Component, events: Events, model$: Observable<P>) {
	return {
		view$: model$.map((state: P): ViewDelta<P> => ({ View, state })),
		events$: mergeEvents(events),
	};
}

function injectContext(context: any, drivers: Core.Drivers) {
	const bind = R.map<Core.Driver, void>((driver) => driver.bind(context));
	return R.mapObjIndexed<any, any>((driver) => {
		return driver.bind(context);
	}, drivers);
}

export function appAsComponent<P, S>(
	main: Core.Main,
	drivers: Core.Drivers,
	// propsMap?: (sinks: any, props: P) => void,
	displayName?: string
): any {
	return class App extends React.Component<P, any> implements App {
		static displayName = `App(${displayName || ''})`
		component: React.ComponentClass<P> | React.StatelessComponent<any> | string;
        dispose: Core.DisposeFn;
		componentWillMount() {
			const boundDrivers = injectContext(this, drivers);
			const { run, sinks } = Core.App<Core.Sources, Core.Drivers>(main, boundDrivers);
			// propsMap && propsMap(sinks, this.props);
			this.dispose = run();
		}

        componentWillUnmount() {
			this.dispose();
        }

		render() {
			const AppView = this.component;
			return (
				<AppView {...this.state} />
			)
		}
	}
}