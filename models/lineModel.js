class LineModel extends ShapeModel {
    constructor() {
        super();
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
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