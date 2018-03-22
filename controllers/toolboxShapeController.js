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

    // Dragging a toolbox shape has a custom implementation.
    onDrag(dx, dy) {
        // The user must move the mouse a wee bit.
        if (!this.mouseController.isClick()) {
            console.log("toolbox shape onDrag");
            // TODO: Figure out where we place the element so the shape is created centered over the mouse!
            var emvc = this.createElementAt(this.mouseController.x, this.mouseController.y);
            // Add the shape to the toolbox group for now so it is topmost, rather than adding
            // it to the objects group.
            this.addToToolboxGroup(emvc);
            var controllers = this.attachToMouseController(emvc);
            // Hoist these controllers onto the mouse active controllers so it switches over to moving this shape.
            this.mouseController.activeControllers = controllers;
            // Indiicate to the mouse controller that we're dragging a toolbox shape so that when it is dropped
            // on the service, special things can happen - the shape is moved into the objects group and the
            // anchors are shown.
            this.mouseController.draggingToolboxShape = true;
        }
    }

    // Simply so that this method can be overridden.
    addToObjectsGroup(emvc) {
        Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(emvc.el);
    }

    addToToolboxGroup(emvc) {
        Helpers.getElement(Constants.SVG_TOOLBOX_ID).appendChild(emvc.el);
    }

    attachToMouseController(emvc) {
        this.mouseController.attach(emvc.view, emvc.controller);
        // Most shapes also need an anchor controller.  An exception is the Text shape, at least for now.
        this.mouseController.attach(emvc.view, anchorGroupController);

        return [emvc.controller, anchorGroupController];
    }
}
