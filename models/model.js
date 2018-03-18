class Model {
    constructor() {
        this.eventPropertyChanged = null;

        // Translation:
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
}