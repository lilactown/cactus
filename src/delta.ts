import { Component } from './Component';

export interface ViewDelta<P> {
    View: Component,
    state: P,
}
