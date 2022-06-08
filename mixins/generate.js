const seedrandom = require('../lib/seedrandom');
const cartesian = require('../mixins/cartesian')
const pool = require('../mixins/db');

const generate = {
  arena: {
    cell(seed, x, y) {
      const combined_seed = seed + x + y;
      return {
        elevation: seedrandom('elevation'+combined_seed),
        moisture: seedrandom('moisture'+combined_seed),
        flora: seedrandom('flora'+combined_seed),
        passable: seedrandom('passable'+combined_seed) < .9
      };
    } ,
    terrain(size, seed) {
      const generated = cartesian.build(16);
      cartesian.iterate(generated, (x, y) => {
        // Assign the cell data
        generated[x][y] = {
          terrain: this.cell(seed, x, y),
          effects: [],
        };
      });
      return generated;
    },
  },
}

module.exports = generate;
