## What is it

A framework for developing front-end applications with Facebook's
[React](https://facebook.github.io/react/) library using the Model-View-Intent architecture.

Cactus leverages [RxJS](https://github.com/ReactiveX/rxjs) and functional, reactive design
to help you to create components and applications that are easy to reason about.

## Goals

### 1. Small

The API surface of the framework should be fairly small.
It should be excellent at a few things, and let other libraries fill the gaps.

### 2. Easy

There's a lot friction to people learning RxJS and reactive programming. The framework
should not add too much complexity to this. In fact, it should try to make this process
easier by bridging the gap between components (with React) and reactive programming.

### 3. Compatible

The framework should bridge the gap between the cozy functional, reactive world and the
rest of the OOP, imperative world. This will allow users to leverage existing solutions
to problems that this framework shouldn't concern it with, e.g.: universal apps, native
mobile rendering, http, websockets, caching, etc. It's a front end framework, not a
platform.

## Installation

```bash
yarn add https://github.com/Lokeh/cactus.git
```

## Previous art

- Cycle.js: [https://cycle.js.org/](https://cycle.js.org/)
- cycle-react: [https://github.com/pH200/cycle-react](https://github.com/pH200/cycle-react)
- react-reactive-toolkit: [https://github.com/milankinen/react-reactive-toolkit](https://github.com/milankinen/react-reactive-toolkit)
