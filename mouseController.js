const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeController = null;
    }

    // Create a map between then SVG element (by it's ID, so ID's must be unique) and its controller.
    attach(svgElement, controller) {
        var id = svgElement.getAttribute("id");
        this.controllers[id] = controller;
    }

    detach(svgElement) {
        var id = svgElement.getAttribute("id");
        delete this.controllers[id];
    }

    detachAll() {
        this.controllers = {};
    }

    destroyAllButSurface() {
        Object.entries(this.controllers).map(([key, val]) => {
            if (!(val instanceof Surface)) {
                val.destroy();
            }
        });
    }

    // The surface mouse controller needs to know the toolbox controller to finish
    // a toolbox drag & drop operation.
    setToolboxController(toolboxController) {
        this.toolboxController = toolboxController;
    }

    setSurfaceShape(surfaceShape) {
        this.surfaceShape = surfaceShape;
    }

    // Get the controller associated with the event and remember where the user clicked.
    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.activeController = this.controllers[id];
            this.mouseDown = true;
            this.mouseDownX = evt.clientX;
            this.mouseDownY = evt.clientY;
            this.startDownX = evt.clientX;
            this.startDownY = evt.clientY;
        }
    }

    // If the user is dragging, call the controller's onDrag function.
    onMouseMove(evt) {
        evt.preventDefault();

        if (this.mouseDown && this.activeController != null) {
            this.activeController.onDrag(evt);
        }
    }

    // Any dragging is now done.
    onMouseUp(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeController != null) {
            evt.preventDefault();
            // Allows the toolbox controller to finish the drag & drop operation.
            this.toolboxController.mouseUp();
            this.clearSelectedObject();
        }
    }

    // Any dragging is now done.
    onMouseLeave(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeController != null) {
            this.activeController.onMouseLeave();
        }
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeController = null;
    }
}

