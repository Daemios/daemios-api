import { Art } from "./Art";

export class InventoryItem extends Art {
  constructor(model) {
    super(model);
    this.name = model.name;
    this.description = model.description;
    this.quantity = model.quantity;
  }
}
