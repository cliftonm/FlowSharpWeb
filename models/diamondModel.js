class DiamondModel extends PathModel {
    constructor() {
        super(Constants.SHAPE_DIAMOND);
    }

    serialize() {
        var model = super.serialize();

        return { Diamond: model };
    }
}