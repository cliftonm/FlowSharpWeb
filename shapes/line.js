class Line extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var anchors = this.getCorners();        

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
}
