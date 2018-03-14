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

        if (this.draggingShape) {
            // TODO:
            // Once dragging has stopped, we need to move the element from the "toolboxGroup"
            // to the "objects" group.
            this.draggingShape = false;
        }

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
                // Let the default handler handle moving the shape.

            } else {
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

    // Place the shape into the toolbox group so it's topmost, and attach the shape to mouse our toolbox mouse controller
    // and the surface mouse controller so off-shape mouse events are handled correctly.
    createShapeForDragging(el, shape) {
        this.dropShapeOnSurface("toolbox", el, shape);
        this.attach(el, shape);
        this.activeController = shape;
        this.mouseController.activeController = shape;
        this.mouseController.mouseDown = true;
    }
}
