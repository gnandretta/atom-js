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

test("addWatch returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({});
  var result = a.addWatch("key", function() {});
  t.equal(result, a);
});

test("removeWatch returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({});
  a.addWatch("key", function() {});
  var result = a.removeWatch("key");
  t.equal(result, a);
});

test("reset returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({});
  var result = a.reset({count: 1});
  t.equal(result, a);
});

test("mreset returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({});
  var result = a.mreset("meta", {count: 1});
  t.equal(result, a);
});

test("swap returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var result = a.swap(function(s) { return {count: s.count + 1}; });
  t.equal(result, a);
});

test("mswap returns this for chaining", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var result = a.mswap("meta", function(s) { return {count: s.count + 1}; });
  t.equal(result, a);
});

test("methods can be chained together", function(t) {
  t.plan(2);
  var a = atom({count: 0});
  var callCount = 0;
  
  var result = a
    .addWatch("w1", function() { callCount++; })
    .addWatch("w2", function() { callCount++; })
    .reset({count: 1})
    .swap(function(s) { return {count: s.count + 1}; })
    .removeWatch("w1");
  
  t.equal(result, a);
  t.equal(a.state.count, 2);
});

test("accepts null as initial state", function(t) {
  t.plan(1);
  var a = atom(null);
  t.equal(a.state, null);
});

test("accepts undefined as initial state", function(t) {
  t.plan(1);
  var a = atom(undefined);
  t.equal(a.state, undefined);
});

test("reset accepts null state", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.reset(null);
  t.equal(a.state, null);
});

test("reset accepts undefined state", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.reset(undefined);
  t.equal(a.state, undefined);
});

test("mreset accepts null meta", function(t) {
  t.plan(4);
  var a = atom({count: 0});
  var newState = {count: 1};
  
  a.addWatch("w1", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState.count, 0);
    t.equal(key, "w1");
    t.equal(meta, null);
  });
  
  a.mreset(null, newState);
});

test("addWatch with empty string key", function(t) {
  t.plan(4);
  var a = atom({count: 0});
  var newState = {count: 1};
  
  a.addWatch("", function(state, oldState, key, meta) {
    t.equal(state, newState);
    t.equal(oldState.count, 0);
    t.equal(key, "");
    t.equal(meta, undefined);
  });
  
  a.reset(newState);
});

test("overwriting watch replaces previous watch", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var firstCallCount = 0;
  var secondCallCount = 0;
  
  a.addWatch("key", function() {
    firstCallCount++;
  });
  
  a.addWatch("key", function() {
    secondCallCount++;
  });
  
  a.reset({count: 1});
  
  t.equal(secondCallCount, 1);
});

test("reset works with no watches", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.reset({count: 1});
  t.equal(a.state.count, 1);
});

test("mreset works with no watches", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.mreset("meta", {count: 1});
  t.equal(a.state.count, 1);
});

test("swap works with no watches", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.swap(function(s) { return {count: s.count + 1}; });
  t.equal(a.state.count, 1);
});

test("mswap works with no watches", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.mswap("meta", function(s) { return {count: s.count + 1}; });
  t.equal(a.state.count, 1);
});

test("watch that throws error propagates the error", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var errorThrown = false;
  
  a.addWatch("throwing", function() {
    throw new Error("watch error");
  });
  
  try {
    a.reset({count: 1});
  } catch (e) {
    errorThrown = true;
  }
  
  t.ok(errorThrown);
});

test("swap with function returning undefined", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.swap(function() {
    return undefined;
  });
  t.equal(a.state, undefined);
});

test("swap with function throwing error", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var errorThrown = false;
  
  try {
    a.swap(function() {
      throw new Error("swap error");
    });
  } catch (e) {
    errorThrown = true;
  }
  
  t.ok(errorThrown);
});

test("mswap with function returning undefined", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  a.mswap("meta", function() {
    return undefined;
  });
  t.equal(a.state, undefined);
});

test("mswap with function throwing error", function(t) {
  t.plan(1);
  var a = atom({count: 0});
  var errorThrown = false;
  
  try {
    a.mswap("meta", function() {
      throw new Error("mswap error");
    });
  } catch (e) {
    errorThrown = true;
  }
  
  t.ok(errorThrown);
});

test("multiple sequential resets", function(t) {
  t.plan(3);
  var a = atom({count: 0});
  
  a.reset({count: 1});
  t.equal(a.state.count, 1);
  
  a.reset({count: 2});
  t.equal(a.state.count, 2);
  
  a.reset({count: 3});
  t.equal(a.state.count, 3);
});

test("multiple sequential swaps", function(t) {
  t.plan(3);
  var a = atom({count: 0});
  
  a.swap(function(s) { return {count: s.count + 1}; });
  t.equal(a.state.count, 1);
  
  a.swap(function(s) { return {count: s.count + 1}; });
  t.equal(a.state.count, 2);
  
  a.swap(function(s) { return {count: s.count + 1}; });
  t.equal(a.state.count, 3);
});

test("watches fire for each sequential update", function(t) {
  t.plan(6);
  var a = atom({count: 0});
  var expectedValues = [1, 2, 3];
  var callIndex = 0;
  
  a.addWatch("counter", function(state, oldState) {
    t.equal(state.count, expectedValues[callIndex]);
    t.equal(oldState.count, expectedValues[callIndex] - 1);
    callIndex++;
  });
  
  a.reset({count: 1});
  a.reset({count: 2});
  a.reset({count: 3});
});

test("state is consistent after multiple updates", function(t) {
  t.plan(1);
  var a = atom({count: 0, name: "test"});
  
  a.reset({count: 1, name: "test"});
  a.swap(function(s) { return {count: s.count + 1, name: s.name}; });
  a.mreset("meta", {count: 10, name: "changed"});
  a.mswap("meta2", function(s) { return {count: s.count * 2, name: s.name}; });
  
  t.deepEqual(a.state, {count: 20, name: "changed"});
});
