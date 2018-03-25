class CircleController extends ShapeController {
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
        var p = new Point(this.model.cx - this.model.r, this.model.cy - this.model.r);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.cx + this.model.r, this.model.cy + this.model.r);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    topMove(anchors, anchor, dx, dy) {
        this.changeRadius(-dy);
        this.moveAnchor(anchors[0], 0, dy);
        this.moveAnchor(anchors[1], 0, -dy);
        this.moveAnchor(anchors[2], dy, 0);
        this.moveAnchor(anchors[3], -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 1);
        this.adjustConnectorsAttachedToConnectionPoint(dy, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dy, 0, 3);
    }

    bottomMove(anchors, anchor, dx, dy) {
        this.changeRadius(dy);
        this.moveAnchor(anchors[0], 0, -dy);
        this.moveAnchor(anchors[1], 0, dy);
        this.moveAnchor(anchors[2], -dy, 0);
        this.moveAnchor(anchors[3], dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 1);
        this.adjustConnectorsAttachedToConnectionPoint(-dy, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dy, 0, 3);
    }

    leftMove(anchors, anchor, dx, dy) {
        this.changeRadius(-dx);
        this.moveAnchor(anchors[0], 0, dx);
        this.moveAnchor(anchors[1], 0, -dx);
        this.moveAnchor(anchors[2], dx, 0);
        this.moveAnchor(anchors[3], -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dx, 1);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 3);
    }

    rightMove(anchors, anchor, dx, dy) {
        this.changeRadius(dx);
        this.moveAnchor(anchors[0], 0, -dx);
        this.moveAnchor(anchors[1], 0, dx);
        this.moveAnchor(anchors[2], -dx, 0);
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dx, 1);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 3);
    }

    changeRadius(amt) {
        this.model.r = this.model.r + amt;
    }
}
