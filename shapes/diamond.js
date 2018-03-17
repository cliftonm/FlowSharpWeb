class Diamond extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var corners = this.getCorners();

        return corners;
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
}
