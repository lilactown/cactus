import * as React from 'react';
import { Component } from './';

// re-export observe-component library
export { ComponentEvent } from 'observe-component/common/ComponentEvent';
export { observeComponent, fromComponent } from 'observe-component/rxjs';

export function withProps(definedProps: any) {
    return (Component: Component): React.StatelessComponent<any> => 
        (props: any) => <Component {...definedProps} {...props} />;
}
