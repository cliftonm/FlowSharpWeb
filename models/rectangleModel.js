class RectangleModel extends ShapeModel {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }

    set x(value) {
        this._x = value;
        this.propertyChanged("x", value);
    }

    set y(value) {
        this._y = value;
        this.propertyChanged("y", value);
    }

    set width(value) {
        this._width = value;
        this.propertyChanged("width", value);
    }

    set height(value) {
        this._height = value;
        this.propertyChanged("height", value);
    }
}