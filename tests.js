var test = require('tape');
var atom = require('./atom');

test("exports a function", function(t) {
  t.plan(1);
  t.equal(typeof atom, "function");
});

test("accepts an initial state", function(t) {
  t.plan(1);
  var state = {};
  t.equal(atom(state).state, state);
});

test("reset sets a new state", function(t) {
  t.plan(2);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};

  a.reset(newState);
  t.equal(a.state, newState);
  t.notEqual(a.state, initialState);
});

test("reset fires watches", function(t) {
  t.plan(8);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 1");
    t.equal(meta, undefined);
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 2");
    t.equal(meta, undefined);
  });

  a.reset(newState);
});

test("reset doesn't fire removed watches", function(t) {
  t.plan(4);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.error(true, "should not execute");
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 2");
    t.equal(meta, undefined);
  });

  a.removeWatch("watch 1");
  a.reset(newState);
});

test("mreset sets a new state", function(t) {
  t.plan(2);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};

  a.mreset("meta", newState);
  t.equal(a.state, newState);
  t.notEqual(a.state, initialState);
});

test("mreset fires tagged watches", function(t) {
  t.plan(8);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};
  var resetTag = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 1");
    t.equal(meta, resetTag);
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 2");
    t.equal(meta, resetTag);
  });

  a.mreset(resetTag, newState);
});

test("mreset doesn't fire removed watches", function(t) {
  t.plan(4);
  var initialState = {};
  var a = atom(initialState);
  var newState = {};
  var resetTag = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.error(true, "should not execute");
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState, initialState);
    t.equal(key, "watch 2");
    t.equal(meta, resetTag);
  });

  a.removeWatch("watch 1");
  a.mreset(resetTag, newState);
});

test("swap updates the state", function(t) {
  t.plan(2);
  var state = {count: 0};
  var a = atom(state);
  a.swap(function(state) {
    state.count++;
    return state;
  });

  t.equal(a.state, state);
  t.equal(a.state.count, 1);
});

test("swap accepts additional arguments", function(t) {
  t.plan(5);
  var state = {count: 0};
  var a = atom(state);
  a.swap(function(state, a, b, c) {
    t.equal(a, 1);
    t.equal(b, 2);
    t.equal(c, 3);
    state.count += arguments.length;
    return state;
  }, 1, 2, 3);

  t.equal(a.state, state);
  t.equal(a.state.count, 4);
});

test("swap fires watches", function(t) {
  t.plan(8);
  var initialState = {count: 0};
  var a = atom(initialState);

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 1");
    t.equal(meta, undefined);
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 2");
    t.equal(meta, undefined);
  });

  a.swap(function(state) {
    return {count: state.count + 1};
  });
});

test("swap doesn't fire removed watches", function(t) {
  t.plan(4);
  var initialState = {count: 0};
  var a = atom(initialState);

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.error(true, "should not execute");
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 2");
    t.equal(meta, undefined);
  });

  a.removeWatch("watch 1");
  a.swap(function(state) {
    return {count: state.count + 1};
  });
});

test("mswap updates the state", function(t) {
  t.plan(2);
  var state = {count: 0};
  var a = atom(state);
  a.mswap("meta", function(state) {
    state.count++;
    return state;
  });

  t.equal(a.state, state);
  t.equal(a.state.count, 1);
});

test("mswap accepts additional arguments", function(t) {
  t.plan(5);
  var state = {count: 0};
  var a = atom(state);
  a.mswap("meta", function(state, a, b, c) {
    t.equal(a, 1);
    t.equal(b, 2);
    t.equal(c, 3);
    state.count += arguments.length;
    return state;
  }, 1, 2, 3);

  t.equal(a.state, state);
  t.equal(a.state.count, 4);
});

test("mswap fires tagged watches", function(t) {
  t.plan(8);
  var initialState = {count: 0};
  var a = atom(initialState);
  var swapTag = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 1");
    t.equal(meta, swapTag);
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 2");
    t.equal(meta, swapTag);
  });

  a.mswap(swapTag, function(state) {
    return {count: state.count + 1};
  });
});

test("mswap doesn't fire removed watches", function(t) {
  t.plan(4);
  var initialState = {count: 0};
  var a = atom(initialState);
  var swapTag = {};

  a.addWatch("watch 1", function(state, oldState, key, meta) {
    t.error(true, "should not execute");
  });

  a.addWatch("watch 2", function(state, oldState, key, meta) {
    t.equal(state.count, 1);
    t.equal(oldState.count, 0);
    t.equal(key, "watch 2");
    t.equal(meta, swapTag);
  });

  a.removeWatch("watch 1");
  a.mswap(swapTag, function(state) {
    return {count: state.count + 1};
  });
});
test("methods support chaining", function(t) {
  t.plan(2);
  var state = {count: 0};
  var a = atom(state);
  var callCount = 0;
  
  var result = a
    .addWatch("test", function() { callCount++; })
    .reset({count: 1})
    .removeWatch("test")
    .swap(function(s) { return {count: s.count + 1}; });
  
  t.equal(result, a, "chained calls return atom instance");
  t.equal(a.state.count, 2, "state updated through chain");
});

test("addWatch with duplicate key replaces previous watch", function(t) {
  t.plan(1);
  var a = atom({});
  var firstCalled = false;
  var secondCalled = false;
  
  a.addWatch("duplicate", function() { firstCalled = true; });
  a.addWatch("duplicate", function() { secondCalled = true; });
  
  a.reset({});
  
  t.equal(secondCalled && !firstCalled, true, "only second watch executes");
});

test("removeWatch with non-existent key is safe", function(t) {
  t.plan(1);
  var a = atom({});
  
  a.removeWatch("does-not-exist");
  a.reset({});
  
  t.pass("no error thrown");
});

test("watches execute in order of insertion", function(t) {
  t.plan(3);
  var a = atom({});
  var executionOrder = [];
  
  a.addWatch("first", function() { executionOrder.push(1); });
  a.addWatch("second", function() { executionOrder.push(2); });
  a.addWatch("third", function() { executionOrder.push(3); });
  
  a.reset({});
  
  t.equal(executionOrder[0], 1, "first watch executed first");
  t.equal(executionOrder[1], 2, "second watch executed second");
  t.equal(executionOrder[2], 3, "third watch executed third");
});
