class TextModel extends ShapeModel {
    constructor() {
        super(Constants.SHAPE_TEXT);
        this._x = 0;
        this._y = 0;
        this._text = "";
    }

    get isShape() { return true; }

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

    getProperties() {
        return [
            { propertyName: 'x', label: 'X', column: 0, row: 0, getter: () => this.x + this.tx },
            { propertyName: 'y', label: 'Y', column: 1, row: 0, getter: () => this.y + this.ty },
            { propertyName: 'text', label: 'Text', column: 0, row: 1, getter: () => this.text },
            { propertyName: 'tx', alias: 'x', getter: () => this.x + this.tx },
            { propertyName: 'ty', alias: 'y', getter: () => this.y + this.ty },
        ];
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