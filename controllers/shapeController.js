// The shape controller handles showing the anchors and other decorations.
class ShapeController extends Controller {
    constructor(mouseController, shapeView, shapeModel) {
        super(mouseController, shapeView, shapeModel);
    }

    // Not all shapes have anchors.
    getAnchors() {
        return [];
    }

    getCorners() {
        return [this.getULCorner(), this.getLRCorner()];
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);
        // anchorsController.onDrag(dx, dy);
    }

    onMouseEnter() {
        if (!this.mouseController.mouseDown) {
            var anchors = this.getAnchors();
            anchorsController.showAnchors(anchors);
        }
    }

    // If we're showing the anchors, moving the mouse on top of an anchor will cause the current shape to leave, which
    // will erase the anchors!
    onMouseLeave() {
        if (!this.mouseController.mouseDown) {
            anchorsController.removeAnchors();
        }
    }
}