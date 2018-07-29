class LineModel extends ShapeModel {
    constructor() {
        super(Constants.SHAPE_LINE);
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
    }

    get isShape() { return true; }

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

    getProperties() {
        return [
            { propertyName: 'x1', label: 'X1', column: 0, row: 0, getter: () => this.x1 + this.tx },
            { propertyName: 'y1', label: 'Y1', column: 1, row: 0, getter: () => this.y1 + this.ty },
            { propertyName: 'x2', label: 'X2', column: 0, row: 1, getter: () => this.x2 + this.tx },
            { propertyName: 'y2', label: 'Y2', column: 1, row: 1, getter: () => this.y2 + this.ty },
            { propertyName: 'tx', alias: 'x1', getter: () => this.x1 + this.tx },
            { propertyName: 'ty', alias: 'y1', getter: () => this.y1 + this.ty },
            { propertyName: 'tx', alias: 'x2', getter: () => this.x2 + this.tx },
            { propertyName: 'ty', alias: 'y2', getter: () => this.y2 + this.ty },
        ];
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
