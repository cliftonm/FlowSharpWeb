class PathModel extends ShapeModel {
    constructor(shapeName) {
        super(shapeName);
        this._d = null;
    }

    serialize() {
        var model = super.serialize();
        model.d = this._d;

        return model;
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.d = model.d;
    }

    get d() { return this._d; }

    set d(value) {
        this._d = value;
        this.propertyChanged("d", value);
    }
}

