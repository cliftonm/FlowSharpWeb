class TextModel extends ShapeModel {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._text = "";
    }

    serialize() {
        var model = super.serialize();
        model.x = this._x;
        model.y = this._y;
        model.text = this._text;

        return { Text: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.x = model.x;
        this.y = model.y;
        this.text = model.text;
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