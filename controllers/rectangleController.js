class RectangleController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].X + corners[1].X) / 2, corners[0].Y);
        var middleBottom = new Point((corners[0].X + corners[1].X) / 2, corners[1].Y);
        var middleLeft = new Point(corners[0].X, (corners[0].Y + corners[1].Y) / 2);
        var middleRight = new Point(corners[1].X, (corners[0].Y + corners[1].Y) / 2);
        //var upperRight = new Point(corners[1].X, corners[0].Y);
        //var lowerLeft = new Point(corners[0].X, corners[1].Y);

        // maybe later:
        // var anchors = [corners[0], corners[1], middleTop, middleBottom, middleLeft, middleRight, upperRight, lowerLeft];
        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getULCorner() {
        var p = new Point(this.model.x, this.model.y);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.x + this.model.width, this.model.y + this.model.height);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    topMove(anchors, anchor, evt) {
        // Moving the top affects "y" and "height"
        var y = +this.svgElement.getAttribute("y") + evt.movementY;
        var height = +this.svgElement.getAttribute("height") - evt.movementY;
        this.svgElement.setAttribute("y", y);
        this.svgElement.setAttribute("height", height);
        this.moveAnchor(anchors[0], 0, evt.movementY);
        this.adjustAnchorY(anchors[2], evt.movementY / 2);
        this.adjustAnchorY(anchors[3], evt.movementY / 2);
    }

    bottomMove(anchors, anchor, evt) {
        // Moving the bottom affects only "height"
        var height = +this.svgElement.getAttribute("height") + evt.movementY;
        this.svgElement.setAttribute("height", height);
        this.moveAnchor(anchors[1], 0, evt.movementY);
        this.adjustAnchorY(anchors[2], evt.movementY / 2);
        this.adjustAnchorY(anchors[3], evt.movementY / 2);
    }

    leftMove(anchors, anchor, evt) {
        // Moving the left affects "x" and "width"
        var x = +this.svgElement.getAttribute("x") + evt.movementX;
        var width = +this.svgElement.getAttribute("width") - evt.movementX;
        this.svgElement.setAttribute("x", x);
        this.svgElement.setAttribute("width", width);
        this.moveAnchor(anchors[2], evt.movementX, 0);
        this.adjustAnchorX(anchors[0], evt.movementX / 2);
        this.adjustAnchorX(anchors[1], evt.movementX / 2);
    }

    rightMove(anchors, anchor, evt) {
        // Moving the right affects only "width"
        var width = +this.svgElement.getAttribute("width") + evt.movementX;
        this.svgElement.setAttribute("width", width);
        this.moveAnchor(anchors[3], evt.movementX, 0);
        this.adjustAnchorX(anchors[0], evt.movementX / 2);
        this.adjustAnchorX(anchors[1], evt.movementX / 2);
    }
}
