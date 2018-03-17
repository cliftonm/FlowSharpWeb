class Anchor extends SvgObject {
    constructor(anchorController, svgElement, onDrag) {
        super(anchorController, svgElement);
        this.wireUpEvents(svgElement);
        this.onDrag = onDrag;
    }

    wireUpEvents(svgElement) {
        // The mouse controller is actually the derived anchor controller.
        // All the default behavior of the base class MouseController can be used here.
        this.registerEventListener(svgElement, "mousedown", this.mouseController.onMouseDown, this.mouseController);
        this.registerEventListener(svgElement, "mousemove", this.mouseController.onMouseMove, this.mouseController);
        this.registerEventListener(svgElement, "mouseup", this.mouseController.onMouseUp, this.mouseController);
        this.registerEventListener(svgElement, "mouseleave", this.mouseController.onMouseLeave, this.mouseController);
    }
}