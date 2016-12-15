import * as React from 'react';
import * as MVI from './core';
import * as RD from './drivers/react';
import { forEach } from 'lodash';

export type Main = (sources: MVI.Sources) => MVI.Sinks;
export interface PropsMap {
	[K: string]: (state: any) => any
};

export interface App {};

export function createAppComponent<P>(
	main: Main, drivers: MVI.Drivers, propsMap: PropsMap, displayName?: string
): App {
	return class App extends React.Component<P, any> implements App {
		static displayName = `App(${displayName || ''})`
		component: React.ComponentClass<P> | React.StatelessComponent<any> | string;
        dispose: MVI.DisposeFn;
		componentWillMount() {
            const extDrivers = {
                ...drivers,
                reactDOM: RD.makeReactStateDriver(({ View, state }) => {
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
			const { run } = MVI.App<MVI.Sources, MVI.Drivers>(main, extDrivers);
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