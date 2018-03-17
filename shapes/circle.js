class Circle extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
    }

    getAnchors() {
        var corners = this.getCorners();

        return corners;
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
}
