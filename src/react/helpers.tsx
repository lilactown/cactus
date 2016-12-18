import * as React from 'react';
import { Component } from './';

export function withProps(props: any) {
    return (Component: Component) => <Component {...props} />;
}
