class DiamondModel extends PathModel {
    constructor() {
        super();
    }

    serialize() {
        var model = super.serialize();

        return { Diamond: model };
    }
}