class SvgElement extends SvgObject {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
        this.wireUpEvents(svgElement);
    }

    wireUpEvents(svgElement) {
        this.registerEventListener(svgElement, "mousedown", mouseController.onMouseDown, mouseController);
        this.registerEventListener(svgElement, "mouseup", mouseController.onMouseUp, mouseController);
        this.registerEventListener(svgElement, "mousemove", mouseController.onMouseMove, mouseController);
    }

    onDrag(evt) {
        this.updatePosition(evt);
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }

    translate(x, y) {
        this.X += x;
        this.Y += y;
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }
}
