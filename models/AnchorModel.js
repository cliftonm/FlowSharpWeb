class AnchorModel extends RectangleModel {
    constructor() {
        super(null);
    }

    // Anchors are not user-selectable shapes.
    get isShape() { return false; }
}