class SvgToolboxElement extends SvgObject {
    constructor(toolboxController, mouseController, svgElement) {
        super(mouseController, svgElement);
        this.toolboxController = toolboxController;
        this.registerEventListener(svgElement, "mousedown", toolboxController.onMouseDown, toolboxController);
        this.registerEventListener(svgElement, "mouseup", toolboxController.onMouseUp, toolboxController);
        this.registerEventListener(svgElement, "mousemove", toolboxController.onMouseMove, toolboxController);
    }

    // TODO: This is the same code as in the SvgObject -- the toolbox controller
    // implementing its own mouse control sort of indicates a design flaw?
    updateMousePositionChange(evt) {
        var mouseX = evt.clientX;
        var mouseY = evt.clientY;
        var mouseDX = mouseX - this.toolboxController.mouseDownX;
        var mouseDY = mouseY - this.toolboxController.mouseDownY;
        this.X += mouseDX;
        this.Y += mouseDY;
        this.toolboxController.mouseDownX = mouseX;
        this.toolboxController.mouseDownY = mouseY;
    }

    onDrag(evt) {
        this.updateMousePositionChange(evt);
        this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }
}
