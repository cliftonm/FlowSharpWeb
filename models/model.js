class Model {
    constructor() {
        this.eventPropertyChanged = null;

        this._tx = 0;
        this._ty = 0;
    }

    get tx() { return this._tx; }
    get ty() { return this._ty; }

    propertyChanged(propertyName, value) {
        if (this.eventPropertyChanged != null) {
            this.eventPropertyChanged(propertyName, value);
        }
    }

    serialize() {
        return { tx: this._tx, ty: this._ty };
    }

    // Used to skip the ShapeModel's serializer in derived Line classes with start/end arrows.
    // Sort of annoying to have to do this.
    baseSerialize() {
        return { tx: this._tx, ty: this._ty };
    }

    deserialize(model, el) {
        this._tx = model.tx;
        this._ty = model.ty;
        this.setTranslate(this._tx, this._ty);
    }

    translate(x, y) {
        this._tx += x;
        this._ty += y;
        this.setTranslate(this._tx, this._ty);
    }

    // Update our internal translation and set the translation immediately.
    setTranslation(x, y) {
        this._tx = x;
        this._ty = y;
        this.setTranslate(x, y);
    }

    // Deferred translation -- this only updates _tx and _ty
    // Used when we want to internally maintain the true _tx and _ty
    // but set the translation to a modulus, as in when translating
    // the grid.
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

    set ty(value) {
        this._ty = value;
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }
}
