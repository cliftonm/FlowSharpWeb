class Model {
    constructor() {
        this.eventPropertyChanged = null;

        // Translation coordinates.
        this.x = 0;   
        this.y = 0;
    }

    propertyChanged(propertyName, value) {
        if (this.eventPropertyChanged != null) {
            this.eventPropertyChanged(propertyName, value);
        }
    }

    updatePosition(evt) {
        this.x += evt.movementX;
        this.y += evt.movementY;
    }

    // All models have a translation 
    setTranslate(x, y) {
        this.translation = "translate(" + x + "," + y + ")";
        // later to be extended to build the transform so that it includes rotation and other things we can do.
        this.setTransform(this.translation);
    }

    setTransform(value) {
        this.transform = value;
        this.propertyChanged("transform", value);
    }
}
