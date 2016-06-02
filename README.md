# localsync

**a lightweight module to sync JS objects in realtime across tabs / windows of a browser. Uses local storage event emitters and falls back to cookie polling if using an unsupported browser (IE 9+ / Edge). Isomorphic. Tested with mocha.**

[![NPM](https://nodei.co/npm/localsync.png?stars=true&downloads=true)](https://nodei.co/npm/localsync/)

## Install

`npm i -S localsync`


## How to use

```js
import localsync from 'localsync'

const sync = username => username
const handler = (value, old, url) => {
  console.info(`Another tab at url ${url} had username updated from ${old.username} to ${value.username}.`)
}

const { startSync, stopSync, triggerSync, isSyncRunning, isFallback } = localsync('username', sync, handler)

startSync()

triggerSync('jim')

setTimeout(() => {
  triggerSync('jane')
}, 5000)

setTimeout(() => {
  if(isSyncRunning)
    stopSync()
}, 10000)
```
