[![NPM](https://raw.githubusercontent.com/noderaider/localsync/master/public/images/localsync.gif)](https://npmjs.com/packages/localsync)

**a lightweight module to sync JS objects in realtime across tabs / windows of a browser.**

_See [this blog post](https://medium.com/@noderaider/my-battle-with-browser-tabs-5c00ae8e3d2c) for detailed information regarding the issues localsync solves._

#### Features

- Uses local storage event emitters to sync objects in realtime across tabs.
- Never calls the tab that the event occurred on.
- Falls back to cookie polling internally if using an unsupported browser (IE 9+ / Edge).
- Isomorphic.
- Tested with Jest.
- Written with TypeScript.

[![Build Status](https://travis-ci.org/noderaider/localsync.svg?branch=master)](https://travis-ci.org/noderaider/localsync)

[![NPM](https://nodei.co/npm/localsync.png?stars=true&downloads=true)](https://nodei.co/npm/localsync/)

## Install

`yarn add localsync`

OR

`npm install localsync`

---

# Version 2

## How to use

```ts
import { localsync } from "localsync";

/** Create a publisher that optionally transforms some data to a payload to be transmitted to other tabs. */
const publisher = (userID, firstName, lastName) => ({
  userID,
  firstName,
  lastName
});

/** Create a subscriber that will receive published payloads on all tabs that did not trigger the sync. */
const subscriber = (current, previous, url) => {
  console.info(
    `Another tab at url ${url} switched user from "${previous.firstName} ${previous.lastName}" to "${current.firstName} ${current.lastName}".`
  );
  // do something with `current.userID`
};

/**
 * Create a synchronizer channel.
 *
 * @remarks
 * `localsync` supports N number of synchronizers for different things across your app.
 * The key 'user' defines a localsync synchronization channel.
 */
const createUserSync = localsync({ channel: "user" });

/**
 * Create a controller for the synchronizer.
 *
 * @remarks
 * To create the controller, you must pass the publisher and the subscriber.
 */
const userController = createUserSync(publisher, subscriber);

/**
 * Start synchronizing.
 * Passing true tells localsync to poll the current storage mechanism once on
 * start for any pre-existing state that may be there (cross session).
 * Defaults to false - may change to true in a future major version.
 */
userController.start(true);

/**
 * IE / Edge do not support local storage across multiple tabs.
 * localsync will automatically fallback to a cookie polling mechanism here. You don't need to do anything else.
 */
if (userController.isFallback) {
  console.warn(
    "browser doesnt support local storage synchronization, falling back to cookie synchronization."
  );
}

/**
 * `isServer` can be used to detect if the current code is running in a server environment (for SSR).
 */
if (userController.isServer) {
  console.debug("Detected a SSR environment.");
}

/** Trigger an action that will get handled on other tabs. */
userController.trigger(1, "jimmy", "john");

/** Trigger an action that will get handled on other tabs. */
userController.trigger(1, "jimmy", "john");

console.info(
  userController.mechanism
); /** => 'storagesync' on chrome, 'cookiesync' on IE */

setTimeout(() => {
  /** Trigger another action in 5 seconds. */
  userController.trigger(2, "jane", "wonka");
}, 5000);

setTimeout(() => {
  /** If its still running, stop syncing in 10 seconds. */
  if (userController.isRunning) {
    userController.stop();
  }
}, 10000);
```

### API

```ts
const createSync = localsync({ channel: string, level?: LogLevel, fallback?: FallbackOptions })

const sync = createSync((publisher: (...args) => TMessage, subscriber: (message: TMessage) => void);

const { start, stop, trigger, isRunning, isFallback } = sync;
```

#### Input

| **name**   | **type** | **default** | **description**                                                          |
| ---------- | -------- | ----------- | ------------------------------------------------------------------------ |
| `channel`  | `string` | `required`  | a string that is used for this synchronization instance.                 |
| `level`    | `string` | `'INFO'`    | the log level to use when tracing (`ERROR`, `WARN`, `INFO`, `DEBUG`)     |
| `fallback` | `object` | `see below` | optional fallback options if you need more control over cookie fallback. |

**`FallbackOptions`**

| **name**        | **type**  | **default** | **description**                                                    |
| --------------- | --------- | ----------- | ------------------------------------------------------------------ |
| `pollFrequency` | `number`  | `3000`      | The number in milliseconds that should be used for cookie polling  |
| `path`          | `string`  | `'/'`       | The path to use for cookies                                        |
| `secure`        | `boolean` | `false`     | Whether to set the secure flag on cookies or not (not recommended) |
| `httpOnly`      | `boolean` | `false`     | Whether to set the http only flag on cookies or not                |

#### Output

_Interface of `localsync` returned controller_

| **name**     | **type**   | **defaults**                  | **description**                                                                                                              |
| ------------ | ---------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `start`      | `function` | `N/A`                         | Call to start syncing. Accepts one boolean parameter (default false). If passed true, will run the synchronization on start. |
| `stop`       | `function` | `N/A`                         | Call to stop syncing                                                                                                         |
| `trigger`    | `function` | `N/A`                         | Call to trigger a sync to occur to all other clients                                                                         |
| `mechanism`  | `string`   | `(storage|cookie|server)sync` | The underlying mechanism that was selected for synchronization                                                               |
| `isRunning`  | `boolean`  | `false`                       | Is synchronization currently enabled                                                                                         |
| `isFallback` | `boolean`  | `false`                       | Is the selected mechanism a fallback strategy                                                                                |
| `isServer`   | `boolean`  | `false`                       | Is the current client running in a server environment                                                                        |

## Structure and Roadmap

localsync has a **singular** purpose: to synchronize events from one client to many using a common interface and the least invasive mechanism for the current browsing medium.

Internally, localsync is comprised of several small `sync` packages that all adhere to the common localsync interface. The main localsync package does no actual synchronization on its own but rather determines the most appropriate synchronization strategy and calls upon the necessary packages to invoke it. All the packages with brief descriptions are listed here:

_Guaranteed synchronization between clients of the same browser (Chrome :left_right_arrow: Chrome, IE :left_right_arrow: IE, etc.)_

- **[localsync](https://npmjs.com/packages/localsync)** - Determines synchronization mechanism and invokes it.

_Mechanism packages_

- **[:bullettrain_front: storagesync](https://npmjs.com/packages/storagesync)** - Synchronizes data in a push fashion using local storage `storage` event for a given browser.
- **[:cookie: cookiesync](https://npmjs.com/packages/cookiesync)** - Synchronizes data via cookie polling mechanism for a given browser.
- **[:computer: serversync](https://npmjs.com/packages/serversync)** - Mocks the localsync interface on server environments but does no actual synchronization (for now).

---

# Version 1 API

```js
const sync = localsync(key: string, action: (...args) => payload, handler: payload => {}, [opts: Object])

const { start, stop, trigger, isRunning, isFallback } = sync
```

#### Input

**key**: a string that is used for this synchronization instance (you may have multiple instances of localsync each with different keys to sync different types of data).

**action**: a function that will be called when this client's trigger function is invoked. The action will be passed any arguments provided to the trigger function and should return the payload to be delivered to other clients for the given localsync key.

**handler**: a function that will be invoked on this client when any other client's trigger function is invoked. _NOTE: This handler will NEVER be called due to this clients trigger function being called, only other clients._

**opts**: An optional object argument that may be specified to control how localsync operates. Supported values are shown below.

| **name**        | **type**  | **default** | **description**                                                                                |
| --------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `tracing`       | `boolean` | `false`     | toggles tracing for debugging purposes                                                         |
| `logger`        | `Object`  | `console`   | the logger object to trace to                                                                  |
| `loglevel`      | `string`  | `'info'`    | the log level to use when tracing (`error`, `warn`, `info`, `trace`)                           |
| `pollFrequency` | `number`  | `3000`      | `fallback: cookiesync` the number in milliseconds that should be used for cookie polling       |
| `idLength`      | `number`  | `8`         | `fallback: cookiesync` the number of characters to use for tracking the current instance (tab) |
| `path`          | `string`  | `'/'`       | `fallback: cookiesync` The path to use for cookies                                             |
| `secure`        | `boolean` | `false`     | `fallback: cookiesync` Whether to set the secure flag on cookies or not (not recommended)      |
| `httpOnly`      | `boolean` | `false`     | `fallback: cookiesync` Whether to set the http only flag on cookies or not                     |

---

## Contributing

To setup localsync for use in development run the following steps at CLI:

```bash
git clone https://github.com/noderaider/localsync
cd localsync
yarn
yarn build
```

Then from your project:

```bash
npm link ../localsync/packages/localsync
# start your project, localsync should hot reload as you update its source code.
```

---

<sup>Feature / bug fixes via pull requests encouraged!</sup>
