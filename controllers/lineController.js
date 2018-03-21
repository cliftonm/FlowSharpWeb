class LineController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();        
        var anchors = [
            { anchor: corners[0], onDrag: this.moveULCorner.bind(this) },
            { anchor: corners[1], onDrag: this.moveLRCorner.bind(this) }];

        return anchors;
    }

    getULCorner() {
        var p = new Point(this.model.x1, this.model.y1);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.x2, this.model.y2);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    // Move the (x1, y1) coordinate.
    moveULCorner(anchors, anchor, dx, dy) {
        this.model.x1 = this.model.x1 + dx;
        this.model.y1 = this.model.y1 + dy;
        this.moveAnchor(anchor, dx, dy);
    }

    // Move the (x2, y2) coordinate.
    moveLRCorner(anchors, anchor, dx, dy) {
        this.model.x2 = this.model.x2 + dx;
        this.model.y2 = this.model.y2 + dy;
        this.moveAnchor(anchor, dx, dy);
    }
}
