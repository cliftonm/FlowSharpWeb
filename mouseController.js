const LEFT_MOUSE_BUTTON = 0;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeController = null;
    }

    // Create a map between then SVG element (by it's ID, so ID's must be unique) and its controller.
    register(svgElement, controller) {
        var id = svgElement.getAttribute("id");
        this.controllers[id] = controller;
    }

    unregister(svgElement) {
        var id = svgElement.getAttribute("id");
        delete this.activeController[id];
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
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
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

