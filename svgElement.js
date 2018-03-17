class SvgElement extends SvgObject {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
        this.wireUpEvents(svgElement);
    }

    wireUpEvents(svgElement) {
        this.registerEventListener(svgElement, "mousedown", mouseController.onMouseDown, mouseController);
        this.registerEventListener(svgElement, "mouseup", mouseController.onMouseUp, mouseController);
        this.registerEventListener(svgElement, "mousemove", mouseController.onMouseMove, mouseController);
        this.registerEventListener(svgElement, "mouseover", mouseController.onMouseOver, mouseController);
    }

    onDrag(evt) {
        this.updatePosition(evt);
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
        getElement(ANCHORS_ID).setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }

    translate(x, y) {
        this.X += x;
        this.Y += y;
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }

    // Default behavior is that the shape has no anchors.
    // All shapes have anchors, this is just a placeholder while we implement the sub-class behaviors.
    getAnchors() {
        return [];
    }

    getCorners() {
        return [this.getULCorner(), this.getLRCorner()];
    }

    getAbsoluteLocation(p) {
        p.translate(this.X, this.Y);
        p.translate(this.mouseController.surface.X, this.mouseController.surface.Y);

        return p;
    }

    // https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
    translateToSvgCoordinate(p) {
        var svg = document.getElementById(SVG_ELEMENT_ID);
        var pt = svg.createSVGPoint();
        var offset = pt.matrixTransform(svg.getScreenCTM().inverse());
        p.translate(offset.x, offset.y);
    }
}
