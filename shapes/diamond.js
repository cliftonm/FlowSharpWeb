class Diamond extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].X + corners[1].X) / 2, corners[0].Y);
        var middleBottom = new Point((corners[0].X + corners[1].X) / 2, corners[1].Y);
        var middleLeft = new Point(corners[0].X, (corners[0].Y + corners[1].Y) / 2);
        var middleRight = new Point(corners[1].X, (corners[0].Y + corners[1].Y) / 2);

        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getULCorner() {
        var rect = this.svgElement.getBoundingClientRect();
        var p = new Point(rect.left, rect.top);
        this.translateToSvgCoordinate(p);

        return p;
    }

    getLRCorner() {
        var rect = this.svgElement.getBoundingClientRect();
        var p = new Point(rect.right, rect.bottom);
        this.translateToSvgCoordinate(p);

        return p;
    }

    topMove(anchors, anchor, evt) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, -evt.movementY);
        this.moveAnchor(anchors[0], 0, evt.movementY);
        this.moveAnchor(anchors[1], 0, -evt.movementY);
        this.moveAnchor(anchors[2], evt.movementY, 0);
        this.moveAnchor(anchors[3], -evt.movementY, 0);
    }

    bottomMove(anchors, anchor, evt) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, evt.movementY);
        this.moveAnchor(anchors[0], 0, -evt.movementY);
        this.moveAnchor(anchors[1], 0, evt.movementY);
        this.moveAnchor(anchors[2], -evt.movementY, 0);
        this.moveAnchor(anchors[3], evt.movementY, 0);
    }

    leftMove(anchors, anchor, evt) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, -evt.movementX);
        this.moveAnchor(anchors[0], 0, evt.movementX);
        this.moveAnchor(anchors[1], 0, -evt.movementX);
        this.moveAnchor(anchors[2], evt.movementX, 0);
        this.moveAnchor(anchors[3], -evt.movementX, 0);
    }

    rightMove(anchors, anchor, evt) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, evt.movementX);
        this.moveAnchor(anchors[0], 0, -evt.movementX);
        this.moveAnchor(anchors[1], 0, evt.movementX);
        this.moveAnchor(anchors[2], -evt.movementX, 0);
        this.moveAnchor(anchors[3], evt.movementX, 0);
    }

    changeWidth(ulCorner, lrCorner, dx) {
        ulCorner.X -= dx;
        lrCorner.X += dx;
        this.updatePath(ulCorner, lrCorner);
    }

    changeHeight(ulCorner, lrCorner, dy) {
        ulCorner.Y -= dy;
        lrCorner.Y += dy;
        this.updatePath(ulCorner, lrCorner);
    }

    updatePath(ulCorner, lrCorner) {
        // example path: d: "M 240 100 L 210 130 L 240 160 L 270 130 Z"
        let transform = this.svgElement.getAttribute("transform");
        var transforms = parseTransform(transform);
        let translate = transforms["translate"];
        ulCorner.translate(-(+translate[0]), -(+translate[1]));
        lrCorner.translate(-(+translate[1]), -(+translate[1]));
        var mx = (ulCorner.X + lrCorner.X) / 2;
        var my = (ulCorner.Y + lrCorner.Y) / 2;
        var path = "M " + mx + " " + ulCorner.Y;
        path = path + " L " + ulCorner.X + " " + my;
        path = path + " L " + mx + " " + lrCorner.Y;
        path = path + " L " + lrCorner.X + " " + my;
        path = path + " Z"
        this.svgElement.setAttribute("d", path);
    }
}
