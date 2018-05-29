class AnchorModel extends RectangleModel {
    constructor() {
        super();
        // Reset the shape name to undefined, as anchors don't have properties
        // that show up on the property grid.
        this.shapeName = undefined;
    }
}