class LineModel extends ShapeModel {
    constructor() {
        super();
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
    }

    serialize() {
        var model = super.serialize();
        model.x1 = this._x1;
        model.y1 = this._y1;
        model.x2 = this._x2;
        model.y2 = this._y2;

        return { Line: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.x1 = model.x1;
        this.y1 = model.y1;
        this.x2 = model.x2;
        this.y2 = model.y2;
    }

    get x1() { return this._x1; }
    get y1() { return this._y1; }
    get x2() { return this._x2; }
    get y2() { return this._y2; }

    set x1(value) {
        this._x1 = value;
        this.propertyChanged("x1", value);
    }

    set y1(value) {
        this._y1 = value;
        this.propertyChanged("y1", value);
    }

    set x2(value) {
        this._x2 = value;
        this.propertyChanged("x2", value);
    }

    set y2(value) {
        this._y2 = value;
        this.propertyChanged("y2", value);
    }
}

// Overrides so we can specify the key for the model.

class LineModelWithStart extends LineModel {
    serialize() {
        var model = this.baseSerialize();
        model.x1 = this._x1;
        model.y1 = this._y1;
        model.x2 = this._x2;
        model.y2 = this._y2;

        return { LineWithStart: model };
    }
}

class LineModelWithStartEnd extends LineModel {
    serialize() {
        var model = this.baseSerialize();
        model.x1 = this._x1;
        model.y1 = this._y1;
        model.x2 = this._x2;
        model.y2 = this._y2;

        return { LineWithStartEnd: model };
    }
}
