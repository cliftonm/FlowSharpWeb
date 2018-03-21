class ToolboxShapeController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // Check if click.  If so, create element on the surface.
    onMouseUp(isClick) {
        if (isClick) {
            console.log("toolbox shape click");
            var emvc = this.createElementAt(270, 130);
            // Account for surface translation (scrolling) so that shape is always placed in a fixed position.
            emvc.model.setTranslation(-surfaceModel.tx, -surfaceModel.ty);
            this.addToObjectsGroup(emvc);
            this.attachToMouseController(emvc);
        }
    }

    // Simply so that this method can be overridden.
    addToObjectsGroup(emvc) {
        Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(emvc.el);
    }

    attachToMouseController(emvc) {
        this.mouseController.attach(emvc.view, emvc.controller);
        // Most shapes also need an anchor controller.  An exception is the Text shape, at least for now.
        this.mouseController.attach(emvc.view, anchorGroupController);
    }

    // Dragging a toolbox shape has a custom implementation.
    onDrag(dx, dy) {
        console.log("toolbox shape onDrag");
    }
}
