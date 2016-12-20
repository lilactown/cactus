import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import * as React from 'react';
import * as R from 'ramda';
import * as Core from '../core';
import { makeReactStateDriver } from '../drivers/state';
import { Events, EventDefinition } from '../events';

export { ComponentEvent } from 'observe-component/common/ComponentEvent';

export type Component =
    React.ComponentClass<any> |
    React.StatelessComponent<any> |
    string;


export interface ViewDelta<P> {
    View: Component,
    state: P,
}

export interface PropsMap {
	[K: string]: (oldState: any, state: any) => any
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

export function appAsComponent<P>(
	main: Core.Main, drivers: Core.Drivers, propsMap?: PropsMap, displayName?: string
): any {
	return class App extends React.Component<P, any> implements App {
		static displayName = `App(${displayName || ''})`
		component: React.ComponentClass<P> | React.StatelessComponent<any> | string;
        dispose: Core.DisposeFn;
		componentWillMount() {
            const extDrivers = {
                ...drivers,
                state: makeReactStateDriver(({ View, state }) => {
					const oldState = this.state;
                    if (View !== this.component) {
                        this.component = View;
                    }
					if (propsMap) {
						R.mapObjIndexed((v: (n: any, v: any) => void, k: string) => {
							if (this.props[k]) {
								this.props[k](v(oldState, state));
							}
						}, propsMap);
					}
                    this.setState(state);
                }),
            }
			const { run } = Core.App<Core.Sources, Core.Drivers>(main, extDrivers);
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