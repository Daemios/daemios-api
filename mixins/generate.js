const cartesian = require('../mixins/cartesian')
const pool = require('../mixins/db');
const seedrandom = require('../lib/seedrandom');

const generate = {
  arena: {
    cell(seed, x, y) {
      const combined_seed = seed + x.toString() + y.toString();
      // All the properties of a cell
      const keys = ['elevation', 'moisture', 'flora', 'passable']
      const response = {};

      keys.forEach(key => {
        const rng = seedrandom(key + combined_seed);
        response[key] = rng()
      })
      response['passable'] = true;
      return response;

    } ,
    terrain(size, seed) {
      const generated = cartesian.build(size);
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
