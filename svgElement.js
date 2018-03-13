class SvgElement extends SvgObject {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
        this.registerEventListener(svgElement, "mousedown", mouseController.onMouseDown, mouseController);
        this.registerEventListener(svgElement, "mouseup", mouseController.onMouseUp, mouseController);
        this.registerEventListener(svgElement, "mousemove", mouseController.onMouseMove, mouseController);
    }

    onDrag(evt) {
        super.onDrag(evt);
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }
}
