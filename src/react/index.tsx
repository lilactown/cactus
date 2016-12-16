import { Observable } from 'rxjs/Rx';
import * as React from 'react';
import { forEach, map } from 'lodash';
import * as Core from '../core';
import { makeReactStateDriver } from '../drivers/state';
import { Events, EventDefinition } from '../events';

export type Component =
    React.ComponentClass<any> |
    React.StatelessComponent<any> |
    string;


export interface ViewDelta<P> {
    View: Component,
    state: P,
}

export interface PropsMap {
	[K: string]: (state: any) => any
};

export interface App {};

function mergeEvents(events: Events): Observable<EventDefinition> {
	const eventDefs = map(events, (event$, key) => {
		return event$.map((ev): EventDefinition => ({
			category: key,
			event: ev,
		}));
	});
	const stream = Observable.merge(...eventDefs);
	return stream;
}

export function connectedView<P>(View: Component, events: Events) {
	return function connectViewTo(model: Observable<P>) {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events$: mergeEvents(events),
		};
	};
}

export function createAppComponent<P>(
	main: Core.Main, drivers: Core.Drivers, propsMap: PropsMap, displayName?: string
): App {
	return class App extends React.Component<P, any> implements App {
		static displayName = `App(${displayName || ''})`
		component: React.ComponentClass<P> | React.StatelessComponent<any> | string;
        dispose: Core.DisposeFn;
		componentWillMount() {
            const extDrivers = {
                ...drivers,
                state: makeReactStateDriver(({ View, state }) => {
                    this.setState(state);
                    if (!this.component) {
                        this.component = View;
                    }
					forEach(propsMap, (v, k) => {
						if (this.props[k]) {
							this.props[k](v(state));
						}
					});
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