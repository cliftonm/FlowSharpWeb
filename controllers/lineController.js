class LineController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get canConnectToShapes() {
        return true;
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);
        // When the entire line is being dragged, we disconnect any connections.
        diagramModel.disconnect(this.view.id, 0);
        diagramModel.disconnect(this.view.id, 1);
    }

    // Move the specified endpoint (by idx) to the point p.
    connect(idx, p) {
        switch (idx) {
            case 0:
                this.model.x1 = p.x;
                this.model.y1 = p.y;
                break;
            case 1:
                this.model.x2 = p.x;
                this.model.y2 = p.y;
                break;
        }
    }

    translateEndpoint(idx, dx, dy) {
        switch (idx) {
            case 0:
                var p = new Point(this.model.x1, this.model.y1);
                p = p.translate(dx, dy);
                this.model.x1 = p.x;
                this.model.y1 = p.y;
                break;
            case 1:
                var p = new Point(this.model.x2, this.model.y2);
                p = p.translate(dx, dy);
                this.model.x2 = p.x;
                this.model.y2 = p.y;
                break;
        }
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
        diagramModel.disconnect(this.view.id, 0);
    }

    // Move the (x2, y2) coordinate.
    moveLRCorner(anchors, anchor, dx, dy) {
        this.model.x2 = this.model.x2 + dx;
        this.model.y2 = this.model.y2 + dy;
        this.moveAnchor(anchor, dx, dy);
        diagramModel.disconnect(this.view.id, 1);
    }
}
