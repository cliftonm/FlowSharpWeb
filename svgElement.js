class SvgElement extends SvgObject {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
        this.element = svgElement;
        this.registerEventListener(this.element, "mousedown", mouseController.onMouseDown, mouseController);
        this.registerEventListener(this.element, "mouseup", mouseController.onMouseUp, mouseController);
        this.registerEventListener(this.element, "mousemove", mouseController.onMouseMove, mouseController);
    }

    onDrag(evt) {
        super.onDrag(evt);
        this.element.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }
}
