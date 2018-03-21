class Model {
    constructor() {
        this.eventPropertyChanged = null;

        // Depending on associated the SVG element, not all of these parameters will be used.
        this._tx = 0;
        this._ty = 0;
        this._x = 0;   
        this._y = 0;
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
        this._width = 0;
        this._height = 0;
        this._cx = 0;
        this._cy = 0;
        this._r = 0;
        this._d = null;
    }

    get tx() { return this._tx; }
    get ty() { return this._ty; }
    get x() { return this._x; }
    get y() { return this._y; }
    get x1() { return this._x1; }
    get y1() { return this._y1; }
    get x2() { return this._x2; }
    get y2() { return this._y2; }
    get width() { return this._width; }
    get height() { return this._height; }
    get cx() { return this._cx; }
    get cy() { return this._cy; }
    get r() { return this._r; }
    get d() { return this._d; }

    propertyChanged(propertyName, value) {
        if (this.eventPropertyChanged != null) {
            this.eventPropertyChanged(propertyName, value);
        }
    }

    // Update our internal translation and set the translation immediately.
    setTranslation(x, y) {
        this._tx += x;
        this._ty += y;
        this.setTranslate(x, y);
    }

    updateTranslation(dx, dy) {
        this._tx += dx;
        this._ty += dy;
    }

    // Sets the "translate" portion of the "transform" property.
    // All models have a translation.  Notice we do not use _tx, _ty here
    // nor do we set _tx, _ty to (x, y) because (x, y) might be mod'ed by
    // the grid (w, h).  We want to use exactly the parameters passed in
    // without modifying our model.
    // See SurfaceController.onDrag and note how the translation is updated
    // but setTranslate is called with the mod'ed (x, y) coordinates.
    setTranslate(x, y) {
        this.translation = "translate(" + x + "," + y + ")";
        this.transform = this.translation;
    }

    // TODO: Later to be extended to build the transform so that it includes rotation and other things we can do.
    set transform(value) {
        this._transform = value;
        this.propertyChanged("transform", value);
    }

    set tx(value) {
        this._tx = value;
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }

    set tx(value) {
        this._ty = value;
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }

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
