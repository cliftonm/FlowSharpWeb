class Circle extends SvgElement {
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
        var p = new Point(+this.svgElement.getAttribute("cx") - +this.svgElement.getAttribute("r"), +this.svgElement.getAttribute("cy") - +this.svgElement.getAttribute("r"));
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(+this.svgElement.getAttribute("cx") + +this.svgElement.getAttribute("r"), +this.svgElement.getAttribute("cy") + +this.svgElement.getAttribute("r"));
        p = this.getAbsoluteLocation(p);

        return p;
    }

    topMove(anchors, anchor, evt) {
        this.changeRadius(-evt.movementY);
        this.moveAnchor(anchors[0], 0, evt.movementY);
        this.moveAnchor(anchors[1], 0, -evt.movementY);
        this.moveAnchor(anchors[2], evt.movementY, 0);
        this.moveAnchor(anchors[3], -evt.movementY, 0);
    }

    bottomMove(anchors, anchor, evt) {
        this.changeRadius(evt.movementY);
        this.moveAnchor(anchors[0], 0, -evt.movementY);
        this.moveAnchor(anchors[1], 0, evt.movementY);
        this.moveAnchor(anchors[2], -evt.movementY, 0);
        this.moveAnchor(anchors[3], evt.movementY, 0);
    }

    leftMove(anchors, anchor, evt) {
        this.changeRadius(-evt.movementX);
        this.moveAnchor(anchors[0], 0, evt.movementX);
        this.moveAnchor(anchors[1], 0, -evt.movementX);
        this.moveAnchor(anchors[2], evt.movementX, 0);
        this.moveAnchor(anchors[3], -evt.movementX, 0);
    }

    rightMove(anchors, anchor, evt) {
        this.changeRadius(evt.movementX);
        this.moveAnchor(anchors[0], 0, -evt.movementX);
        this.moveAnchor(anchors[1], 0, evt.movementX);
        this.moveAnchor(anchors[2], -evt.movementX, 0);
        this.moveAnchor(anchors[3], evt.movementX, 0);
    }

    changeRadius(amt) {
        var r = +this.svgElement.getAttribute("r") + amt;
        this.svgElement.setAttribute("r", r)
    }
}
