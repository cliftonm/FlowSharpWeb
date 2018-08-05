// See static initializer at bottom of class definition! 
// Model.idCount = 0;

class Model {
    constructor(shapeName) {
        this.eventPropertyChanged = new Event();

        // Certain shapes (like anchors, surface, etc.) are temporary so we don't want to increment the model ID.
        if (shapeName != null) {
            this._shapeName = shapeName;
            this._shapeId = shapeName + '.' + Model.idCount;
            Model.idCount += 1;
        }

        this._tx = 0;
        this._ty = 0;
    }

    // By default, we assume the model is not actually a shape.  Only circle, diamond, line, rectangle, text, and other "shapes" are shapes.
    get isShape() { return false;}

    get tx() { return this._tx; }
    get ty() { return this._ty; }
    get shapeName() { return this._shapeName; }
    get shapeId() { return this._shapeId; }

    propertyChanged(propertyName, value) {
        // console.log(propertyName + " = " + value);
        this.eventPropertyChanged.fire(this, {propertyName : propertyName, value : value})
    }

    getProperties() {
        return [];
    }

    serialize() {
        return { tx: this._tx, ty: this._ty, shapeName: this._shapeName, shapeId: this._shapeId };
    }

    // Used to skip the ShapeModel's serializer in derived Line classes with start/end arrows.
    // Sort of annoying to have to do this.
    baseSerialize() {
        return { tx: this._tx, ty: this._ty, shapeName: this._shapeName, shapeId: this._shapeId };
    }

    deserialize(model, el) {
        this._tx = model.tx;
        this._ty = model.ty;
        this._shapeName = model.shapeName;
        this.setTranslate(this._tx, this._ty);
    }

    translate(x, y) {
        this._tx += x;
        this._ty += y;
        this.propertyChanged("tx", this._tx);
        this.propertyChanged("ty", this._ty);
        this.setTranslate(this._tx, this._ty);
    }

    // Update our internal translation and set the translation immediately.
    setTranslation(x, y) {
        this._tx = x;
        this._ty = y;
        this.propertyChanged("tx", this._tx);
        this.propertyChanged("ty", this._ty);
        this.setTranslate(x, y);
    }

    // Deferred translation -- this only updates _tx and _ty
    // Used when we want to internally maintain the true _tx and _ty
    // but set the translation to a modulus, as in when translating
    // the grid.
    updateTranslation(dx, dy) {
        this._tx += dx;
        this._ty += dy;
        this.propertyChanged("tx", this._tx);
        this.propertyChanged("ty", this._ty);
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
        this.propertyChanged("tx", value);
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }

    set ty(value) {
        this._ty = value;
        this.propertyChanged("ty", value);
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }
}

Model.idCount = 0;
