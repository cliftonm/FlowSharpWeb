class AnchorController extends MouseController {
    constructor(mouseController) {
        super();
        // For handling dragging an anchor but the surface or shape gets the mousemove events.
        this.mouseController = mouseController;
    }

    onMouseDown(evt) {
        super.onMouseDown(evt);
        // For handling dragging an anchor but the surface or shape gets the mousemove events.
        this.mouseController.mouseDown = true;
        this.mouseController.activeController = this.activeController;
    }

    onMouseUp(evt) {
        super.onMouseUp(evt);
        // For handling dragging an anchor but the surface or shape gets the mousemove events.
        this.mouseController.mouseDown = false;
        this.mouseController.activeController = null;
    }

    // Ignore mouse leave events when dragging an anchor.
    onMouseLeave(evt) { }
}
