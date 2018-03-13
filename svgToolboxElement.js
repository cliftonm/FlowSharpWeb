class SvgToolboxElement extends SvgObject {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
        this.registerEventListener(svgElement, "mousedown", toolboxController.onMouseDown, toolboxController);
        this.registerEventListener(svgElement, "mouseup", toolboxController.onMouseUp, toolboxController);
        this.registerEventListener(svgElement, "mousemove", toolboxController.onMouseMove, toolboxController);
    }

    onDrag(evt) {
        super.onDrag(evt);
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }
}
