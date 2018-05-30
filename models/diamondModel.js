class DiamondModel extends PathModel {
    constructor() {
        super(Constants.SHAPE_DIAMOND);
    }

    get isShape() { return true; }

    serialize() {
        var model = super.serialize();

        return { Diamond: model };
    }
}