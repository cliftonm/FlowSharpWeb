// The shape controller handles showing the anchors and other decorations.
class ShapeController extends Controller {
    constructor(mouseController, shapeView, shapeModel) {
        super(mouseController, shapeView, shapeModel);
    }

    // Not all shapes have anchors.
    getAnchors() {
        return [];
    }

    // Not all shapes have connection points.
    getConnectionPoints() {
        return [];
    }

    getCorners() {
        return [this.getULCorner(), this.getLRCorner()];
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);
    }

    // Overrridden by the line controller.
    get canConnectToShapes() {
        return false;
    }

    connect(idx, p) {
        throw "Shape appears to be capable of connecting to other shapes but doesn't implement connect(idx, p).";
    }

    onMouseEnter() {
        if (!this.mouseController.mouseDown && this.shouldShowAnchors) {
            anchorGroupController.showAnchors(this);
        }
    }

    // If we're showing the anchors, moving the mouse on top of an anchor will cause the current shape to leave, which
    // will erase the anchors!  We handle this situation in the mouse controller.
    onMouseLeave() {
        if (this.shouldShowAnchors) {
            anchorGroupController.removeAnchors();
        }
    }

    moveAnchor(anchor, dx, dy) {
        anchor.translate(dx, dy);
    }

    adjustAnchorX(anchor, dx) {
        anchor.translate(dx, 0);
    }

    adjustAnchorY(anchor, dy) {
        anchor.translate(0, dy);
    }
}