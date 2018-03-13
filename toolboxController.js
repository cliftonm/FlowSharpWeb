class ToolboxController {
    constructor(mouseController) {
        this.mouseController = mouseController;
    }

    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.mouseController.activeController = this.mouseController.controllers[id];
            this.mouseDown = true;
            this.mouseDownX = evt.clientX;
            this.mouseDownY = evt.clientY;
        }
    }

    // If the user is dragging, we create a new shape that can be dragged onto
    // the surface.  When the drag operation ends, the shape is transferred to the surface.
    onMouseMove(evt) {
        evt.preventDefault();

        if (this.mouseDown && this.mouseController.activeController != null) {
            this.mouseController.activeController.onDrag(evt);
        }
    }

    // If this is a "click", create the shape in a fixed location on the surface.
    // If this is the end of a drag operation, place the shape on the surface at
    // the current mouse position.
    onMouseUp(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            this.mouseController.clearSelectedObject();
        }
    }
}
