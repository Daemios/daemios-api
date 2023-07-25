class Arena {
  constructor(model) {
    this.name = model.name ?? null; // used for the slide-in title before combat

    this.width = model.width;
    this.height = model.height;

    // create 2d array from width and height
    this.grid = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      this.grid[x] = new Array(this.height);
    }
  }

  isValidDestination(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height; // TODO add && passable
  }

  moveEntity(entity, x, y) {
    if (this.isValidDestination(x, y)) {
      entity.moveTo(x, y);

      // update the grid
    }
  }
}

module.exports = Arena;
