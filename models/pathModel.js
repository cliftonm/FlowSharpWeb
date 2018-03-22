class PathModel extends ShapeModel {
    constructor() {
        super();
        this._d = null;
   }

    get d() { return this._d; }

    set d(value) {
        this._d = value;
        this.propertyChanged("d", value);
    }
}

