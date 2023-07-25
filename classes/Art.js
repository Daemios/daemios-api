export class Art {
    constructor(model) {
        this.thumbnail = model.thumbnail;
        this.image = model.image ? model.image : false;

        this.modeled = model.modeled ? model.modeled : false;
        this.model_path = model.model_path ? model.model_path : false;
        this.background = model.background ? model.background : false;
        this.background_animated = model.background_animated ? model.background_animated : false;
    }
}
