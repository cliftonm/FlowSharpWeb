class TextModel extends ShapeModel {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._text = "";
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get text() { return this._text; }

    set x(value) {
        this._x = value;
        this.propertyChanged("x", value);
    }

    set y(value) {
        this._y = value;
        this.propertyChanged("y", value);
    }

    set text(value) {
        this._text = value;
        this.propertyChanged("text", value);
    }
}