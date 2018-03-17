class Rectangle extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].X + corners[1].X) / 2, corners[0].Y);
        var middleBottom = new Point((corners[0].X + corners[1].X) / 2, corners[1].Y);
        var middleLeft = new Point(corners[0].X, (corners[0].Y + corners[1].Y) / 2);
        var middleRight = new Point(corners[1].X, (corners[0].Y + corners[1].Y) / 2);
        var upperRight = new Point(corners[1].X, corners[0].Y);
        var lowerLeft = new Point(corners[0].X, corners[1].Y);

        var anchors = [corners[0], corners[1], middleTop, middleBottom, middleLeft, middleRight, upperRight, lowerLeft];

        return anchors;
    }

    getULCorner() {
        var p = new Point(+this.svgElement.getAttribute("x"), +this.svgElement.getAttribute("y"));
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(+this.svgElement.getAttribute("x") + +this.svgElement.getAttribute("width"), +this.svgElement.getAttribute("y") + +this.svgElement.getAttribute("width"));
        p = this.getAbsoluteLocation(p);

        return p;
    }
}
