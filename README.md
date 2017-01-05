# Referencia

> **Deprecation warning:** This package has been renamed to
> `@gnandretta/atom` and will no longer be maintained. No changes have
> been made to the source code during the name change, you just need
> to update your dependency and requires.

Manage and observe state changes in JavaScript, based on
Clojure(Script) [atoms](http://clojuredocs.org/clojure.core/atom).

# Usage

```js
var atom = require('referencia');

var gabriel = atom({likes: "ice cream"});

gabriel.addWatch("logger", function(state) {
  console.log(state);
});

gabriel.state // => {likes: "ice cream"}

gabriel.swap(function(state) {
  return {likes: "cookies"};
});

// {likes: "cookies"} will be logged in the console

gabriel.state // => {likes: "cookies"}
```

# Rationale

I want a clear distinction between state and identity.

# Creating an atom

## atom(state)

Creates a new atom with initial `state`.

# Getting the atom state

## a.state

Returns the current state for the atom `a`.

# Updates

## a.reset(state)

Sets the state of atom `a` to `state`.

## a.swap(f, ...args)

Sets the state of atom `a` to the result of applying the function `f`
to the current state, `a.state`, and the provided `args`.

```js
function setLike(state, food) {
  return Object.assign({}, state, {likes: food});
}

a.swap(setLike, "hamburguers");
a.state.likes // => "hamburguers"
```

## a.mreset(meta, state)

Like `reset` but it will pass the metadata `meta` to the watches.

## a.mswap(meta, f, ...args)

Like `swap` but it will pass the metadata `meta` to the watches.

# Observation

## a.addWatch(key, f)

Invoke the function `f` every time the state of the atom `a` is
updated. The `key` parameter is a ~String~ that is used to identify
the watch and remove it later.

Every time the function `f` is invoked, it will recieve the following
params:

- `state`: current state of the atom, after the update.
- `oldState`: the previous state of the atom, before the update. It is
  possible that `state === oldState` if you don't update the atom's
  state or if you update the state in place. The function `f` is
  called every time one of the update methods are called, there is no
  guarantee that the `state` has actually changed and that the changes
  are preserved in `oldState`. That is up to you.
- `key`: the key provided when adding the watch.
- `meta`: the metadata provided when performing the update with
  `mreset` or `mswap`. If the update was done through `reset` or
  `swap` this parameter will be `undefined`.

## a.removeWatch(key)

Stop invoking the function for the watch with the `key` key.
