import * as React from 'react';
import { Component } from './';

export function withProps(definedProps: any) {
    return (Component: Component) => 
        (props: any) => <Component {...definedProps} {...props} />;
}
