class ToolboxController extends MouseController {
    // We pass in the mouse controller that the surface is using so we can 
    // pass control over to the surface mouse controller when dragging a shape.
    constructor(mouseController) {
        super();
        this.mouseController = mouseController;
    }

    onMouseDown(evt) {
        super.onMouseDown(evt);
    }

    // If the user is dragging, we create a new shape that can be dragged onto
    // the surface.  When the drag operation ends, the shape is transferred to the surface.
    onMouseDown(evt) {
        super.onMouseDown(evt);
    }

    // If this is a "click", create the shape in a fixed location on the surface.
    // If this is the end of a drag operation, place the shape on the surface at
    // the current mouse position.
    onMouseUp(evt) {
        var endDownX = evt.clientX;
        var endDownY = evt.clientY;

        if (Math.abs(this.startDownX - endDownX) < 5 && Math.abs(this.startDownY - endDownY) < 5) {
            // Treat this as a click.
            this.activeController.createElement();
        }

        super.onMouseUp(evt);
    }

    dropShapeOnSurface(svgElement, shapeController) {
        document.getElementById("objects").appendChild(svgElement);
        this.mouseController.attach(svgElement, shapeController);
    }
}
