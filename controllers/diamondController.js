class DiamondController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    getULCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.left, rect.top);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    getLRCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.right, rect.bottom);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    topMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, -dy);
        this.moveAnchor(anchors[0], 0, dy);          // top
        this.moveAnchor(anchors[1], 0, -dy);         // bottom
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 1);
    }

    bottomMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, dy);
        this.moveAnchor(anchors[0], 0, -dy);
        this.moveAnchor(anchors[1], 0, dy);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 1);
    }

    leftMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, -dx);
        this.moveAnchor(anchors[2], dx, 0);
        this.moveAnchor(anchors[3], -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 3);
    }

    rightMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, dx);
        this.moveAnchor(anchors[2], -dx, 0);
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 3);
    }

    changeWidth(ulCorner, lrCorner, dx) {
        ulCorner.x -= dx;
        lrCorner.x += dx;
        this.updatePath(ulCorner, lrCorner);
    }

    changeHeight(ulCorner, lrCorner, dy) {
        ulCorner.y -= dy;
        lrCorner.y += dy;
        this.updatePath(ulCorner, lrCorner);
    }

    updatePath(ulCorner, lrCorner) {
        // example path: d: "M 240 100 L 210 130 L 240 160 L 270 130 Z"
        var ulCorner = this.getRelativeLocation(ulCorner);
        var lrCorner = this.getRelativeLocation(lrCorner);
        var mx = (ulCorner.x + lrCorner.x) / 2;
        var my = (ulCorner.y + lrCorner.y) / 2;
        var path = "M " + mx + " " + ulCorner.y;
        path = path + " L " + ulCorner.x + " " + my;
        path = path + " L " + mx + " " + lrCorner.y;
        path = path + " L " + lrCorner.x + " " + my;
        path = path + " Z"
        this.model.d = path;
    }
}
