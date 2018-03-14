class ToolboxController extends MouseController {
    // We pass in the mouse controller that the surface is using so we can 
    // pass control over to the surface mouse controller when dragging a shape.
    constructor(mouseController) {
        super();
        this.mouseController = mouseController;
        this.draggingShape = false;
    }

    onMouseDown(evt) {
        super.onMouseDown(evt);
    }

    // If this is a "click", create the shape in a fixed location on the surface.
    // If this is the end of a drag operation, place the shape on the surface at
    // the current mouse position.
    onMouseUp(evt) {
        var endDownX = evt.clientX;
        var endDownY = evt.clientY;

        if (Math.abs(this.startDownX - endDownX) < TOOLBOX_DRAG_MIN_MOVE &&
            Math.abs(this.startDownY - endDownY) < TOOLBOX_DRAG_MIN_MOVE) {
            // Treat this as a click.
            var el = this.activeController.createElement();
            // The new shape is attached to the grid surface's mouse controller.
            var shape = this.activeController.createShape(this.mouseController, el);

            // Use the mouse controller associated with the surface.
            this.dropShapeOnSurface("objects", el, shape);
        }

        // We will never get this event when dragging the shape because it's handled by the surface mouse controller.
        // So testing for whether we're dragging a shape here is useless.

        super.onMouseUp(evt);
    }

    dropShapeOnSurface(groupName, svgElement, shapeController) {
        document.getElementById(groupName).appendChild(svgElement);
        this.mouseController.attach(svgElement, shapeController);
    }

    // If the user is dragging, we create a new shape that can be dragged onto
    // the surface.  When the drag operation ends, the shape is transferred to the surface.
    onMouseMove(evt) {
        if (this.mouseDown) {
            evt.preventDefault();
            if (this.draggingShape) {
                // Our toolbox surface picked up the event instead of the shape.  Handle
                // as if the shape got the event.
                super.onMouseMove(evt);
            } else {
                // Make sure a shape has been selected rather than dragging the toolbox surface.
                if (!(this.activeController instanceof ToolboxSurface)) {
                    var endDownX = evt.clientX;
                    var endDownY = evt.clientY;

                    if (Math.abs(this.startDownX - endDownX) >= TOOLBOX_DRAG_MIN_MOVE &&
                        Math.abs(this.startDownY - endDownY) >= TOOLBOX_DRAG_MIN_MOVE) {
                        var el = this.activeController.createElementAt(endDownX, endDownY);
                        // Here, because we're dragging, the shape needs to be attached to both the toolbox controller and the surface's mouse controller
                        // so that if the user moves the shape too quickly, either the toolbox controller or the surface controller will pick it up.
                        var shape = this.activeController.createShape(this.mouseController, el);
                        shape.mouseController.mouseDownX = endDownX;
                        shape.mouseController.mouseDownY = endDownY;
                        this.createShapeForDragging(el, shape);
                        this.draggingShape = true;
                    }
                }
            }
        }
    }

    // Place the shape into the toolbox group so it's topmost, and attach the shape to mouse our toolbox mouse controller
    // and the surface mouse controller so off-shape mouse events are handled correctly.
    createShapeForDragging(el, shape) {
        // The shape is now under the control of the surface mouse controller even though we added it to our toolbox group.
        // This is because the shape wires up the surface mouse controller events.
        // The only thing the toolbox controller will see is the onMouseMove when the user moves the mouse too fast and the
        // mouse events end up being handled by the toolbox controller (or, if over the surface, the surface controller.)
        this.dropShapeOnSurface("toolbox", el, shape);

        // We need to know what shape is being moved, in case we (the tookbox controller) start to receive mouse move events.
        this.attach(el, shape);
        this.activeController = shape;

        // The surface mouse controller also needs to know what shape is active and that we are in the "mouse down" state.
        this.mouseController.activeController = shape;
        this.mouseController.mouseDown = true;
    }
}
