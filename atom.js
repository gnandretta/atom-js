function Atom(state) {
  this.state = state;
  this.watches = {};
}

Atom.prototype = {

  addWatch: function(k, f) {
    this.watches[k] = f;
    return this;
  },

  removeWatch: function(k) {
    delete this.watches[k];
    return this;
  },

  swap: function(f) {
    return this.mswap.apply(
      this,
      [undefined, f].concat([].slice.call(arguments, 1))
    );
  },

  mswap: function(meta, f) {
    return this.mreset(
      meta,
      f.apply(null, [this.state].concat([].slice.call(arguments, 2)))
    );
  },

  reset: function(state) {
    return this.mreset(undefined, state);
  },

  mreset: function(meta, state) {
    var watches = this.watches;
    var oldState = this.state;
    this.state = state;

    Object.keys(watches).forEach(function(k) {
      watches[k](state, oldState, k, meta);
    });

    return this;
  }

}

module.exports = function(state) {
  return new Atom(state);
};
