class Line extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var corners = this.getCorners();        
        var anchors = [
            { anchor: corners[0], onDrag: this.moveULCorner.bind(this) },
            { anchor: corners[1], onDrag: this.moveLRCorner.bind(this) }];

        return anchors;
    }

    getULCorner() {
        var line = this.svgElement.children[0];
        var p = new Point(+line.getAttribute("x1"), +line.getAttribute("y1"));
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var line = this.svgElement.children[0];
        var p = new Point(+line.getAttribute("x2"), +line.getAttribute("y2"));
        p = this.getAbsoluteLocation(p);

        return p;
    }

    // Move the (x1, y1) coordinate.
    moveULCorner(anchors, anchor, evt) {
        // Use movementX and movementY - this is much better than dealing with the base class X or dragX stuff.
        // Do both the transparent line and the visible line.
        this.moveLine("x1", "y1", this.svgElement.children[0], evt.movementX, evt.movementY);
        this.moveLine("x1", "y1", this.svgElement.children[1], evt.movementX, evt.movementY);
        this.moveAnchor(anchor, evt.movementX, evt.movementY);
    }

    // Move the (x2, y2) coordinate.
    moveLRCorner(anchors, anchor, evt) {
        this.moveLine("x2", "y2", this.svgElement.children[0], evt.movementX, evt.movementY);
        this.moveLine("x2", "y2", this.svgElement.children[1], evt.movementX, evt.movementY);
        this.moveAnchor(anchor, evt.movementX, evt.movementY);
    }

    moveLine(ax, ay, line, dx, dy) {
        var x1 = +line.getAttribute(ax) + dx;
        var y1 = +line.getAttribute(ay) + dy;
        line.setAttribute(ax, x1);
        line.setAttribute(ay, y1);
    }
}
