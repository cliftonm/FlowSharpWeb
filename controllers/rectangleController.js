class RectangleController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);
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

    topMove(anchors, anchor, dx, dy) {
        // Moving the top affects "y" and "height"
        var y = this.model.y + dy;
        var height = this.model.height - dy;
        this.model.y = y;
        this.model.height = height;
        this.moveAnchor(anchors[0], 0, dy);
        this.adjustAnchorY(anchors[2], dy / 2);
        this.adjustAnchorY(anchors[3], dy / 2);
    }

    bottomMove(anchors, anchor, dx, dy) {
        // Moving the bottom affects only "height"
        var height = this.model.height + dy;
        this.model.height = height;
        this.moveAnchor(anchors[1], 0, dy);
        this.adjustAnchorY(anchors[2], dy / 2);
        this.adjustAnchorY(anchors[3], dy / 2);
    }

    leftMove(anchors, anchor, dx, dy) {
        // Moving the left affects "x" and "width"
        var x = this.model.x + dx;
        var width = this.model.width - dx;
        this.model.x = x;
        this.model.width = width;
        this.moveAnchor(anchors[2], dx, 0);
        this.adjustAnchorX(anchors[0], dx / 2);
        this.adjustAnchorX(anchors[1], dx / 2);
    }

    rightMove(anchors, anchor, dx, dy) {
        // Moving the right affects only "width"
        var width = this.model.width + dx;
        this.model.width = width;
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustAnchorX(anchors[0], dx / 2);
        this.adjustAnchorX(anchors[1], dx / 2);
    }
}
