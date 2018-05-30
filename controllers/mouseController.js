const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeControllers = null;
        this.currentHoverControllers = [];
        this.leavingId = -1;
        this.draggingToolboxShape = false;
        this.selectedControllers = null;
        this.selectedShapeId = null;
        this.hoverShapeId = null;
        this.actualModel = null;

        this.eventShapeSelected = new Event();

        // We really can't use movementX and movementY of the event because
        // when the user moves the mouse quickly, the move events switch from
        // the shape to the surface (or another shape) and this causes deviances
        // in the movementX and movementY so that the shape is no longer positioned
        // at the same location as when clicked down.
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
    }

    // Attach as many controllers as you want to the view.
    attach(view, controller) {
        var id = view.id;

        if (this.controllers[id] == undefined) {
            this.controllers[id] = [];
        }

        this.controllers[id].push(controller);
    }

    // Compare functions detach with destroyAll.
    // We should probably implement a "destroy" method as well.

    // Detach all controllers associated with this view.
    detach(view) {
        var id = view.id;
        delete this.controllers[id];
    }

    detachAll() {
        this.controllers = {};
    }

    destroy(view) {
        var id = view.id;
        this.controllers[id].map(controller=>controller.destroy());
        delete this.controllers[id];
    }

    destroyShapeById(id) {
        this.controllers[id].map(controller => controller.destroy());
        delete this.controllers[id];
    }

    // Detaches all controllers and unwires events associated with the controller.
    destroyAll() {
        Object.entries(this.controllers).map(([key, val]) => val.map(v => v.destroy()));
        this.controllers = {};
    }

    destroyAllButSurface() {
        Object.entries(this.controllers).map(([key, val]) => {
            val.map(v => {
                // Don't remove surface, toolbox, objects group, or toolbox shapes.
                if (!v.isSurfaceController && !v.isToolboxShapeController) {
                    v.destroy();
                    // Hopefully deleting the dictionary entry while iterating won't be
                    // a disaster since we called Object.entries!
                    delete this.controllers[key];
                }
            });
        });
    }

    get isClick() {
        var endDownX = this.x;
        var endDownY = this.y;

        var isClick = Math.abs(this.startDownX - endDownX) < TOOLBOX_DRAG_MIN_MOVE &&
            Math.abs(this.startDownY - endDownY) < TOOLBOX_DRAG_MIN_MOVE;

        return isClick;
    }

    onKeyDown(evt) {
        var isOverShape = this.hoverShapeId != null;
        var handled = false;

        if (isOverShape) {
            switch (evt.keyCode) {
                case Constants.KEY_RIGHT:
                    this.currentHoverControllers.map(c => c.onDrag(1, 0));
                    handled = true;
                    break;
                case Constants.KEY_UP:
                    this.currentHoverControllers.map(c => c.onDrag(0, -1));
                    handled = true;
                    break;
                case Constants.KEY_LEFT:
                    this.currentHoverControllers.map(c => c.onDrag(-1, 0));
                    handled = true;
                    break;
                case Constants.KEY_DOWN:
                    this.currentHoverControllers.map(c => c.onDrag(0, 1));
                    handled = true;
                    break;
                case Constants.KEY_DELETE:
                    // Mouse is "leaving" this control, this removes any anchors.
                    this.currentHoverControllers.map(c => c.onMouseLeave());
                    // Remove shape from diagram model, and all connections of this shape.
                    diagramModel.removeShape(this.hoverShapeId);
                    // Remove shape from mouse controller and detach events.
                    this.destroyShapeById(this.hoverShapeId);
                    // Remove from "objects" collection.
                    var el = Helpers.getElement(this.hoverShapeId);
                    el.parentNode.removeChild(el);
                    // Cleanup.
                    this.currentHoverControllers = [];
                    this.hoverShapeId = null;
                    handled = true;
                    break;
            }
        }

        return isOverShape && handled;
    }

    // Get the controller associated with the event and remember where the user clicked.
    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.selectedShapeId = id;
            this.activeControllers = this.controllers[id];
            this.selectedControllers = this.controllers[id];
            this.mouseDown = true;
            this.startDownX = evt.clientX;
            this.startDownY = evt.clientY;
            this.x = evt.clientX;
            this.y = evt.clientY;
            this.activeControllers.map(c => c.onMouseDown());

            // A bit annoying -- if this is a toolbox shape user clicked on, we need to use the
            // toolbox model until the user drops the control on the surface and the real shape
            // is created.
            if (this.activeControllers.any(ctrl => ctrl.isToolboxShapeController)) {
                // Here we assume the toolbox controller we want is the first controller.
                this.eventShapeSelected.fire(this, { model: this.activeControllers[0].model, shapeId: this.activeControllers[0].shapeName });
            } else {
                // Here we also handle the user clicking on the surface instead of a shape.
                if (this.activeControllers[0].isSurfaceController) {
                    this.eventShapeSelected.fire(this, { model: this.activeControllers[0].model, shapeId: this.activeControllers[0].shapeName });
                } else {
                    this.eventShapeSelected.fire(this, { model: this.actualModel, shapeId: this.actualModel.shapeId })
                }
            }
        }
    }

    // If the user is dragging, call the controller's onDrag function.
    onMouseMove(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeControllers != null) {
            this.dx = evt.clientX - this.x;
            this.dy = evt.clientY - this.y;
            this.x = evt.clientX;
            this.y = evt.clientY;
            this.activeControllers.map(c => c.onDrag(this.dx, this.dy));
        }
    }

    onMouseUp(evt) {
        evt.preventDefault();
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeControllers != null) {
            this.selectedShapeId = null;
            this.x = evt.clientX;
            this.y = evt.clientY;
            var isClick = this.isClick;

            this.activeControllers.map(c => c.onMouseUp(isClick));
            this.clearSelectedObject();

            // Do this after the mouseDown flag is reset, otherwise anchors won't appear.
            if (this.draggingToolboxShape) {
                // shapeBeingDraggedAndDropped is set by the ToolboxShapeController.
                // We preserve this shape in case the user releases the mouse button
                // while the mouse is over a different shape (like the surface) as
                // as result of a very fast drag & drop where the shape hasn't caught
                // up with the mouse, or the mouse is outside of shape's boundaries.
                this.finishDragAndDrop(this.shapeBeingDraggedAndDropped, evt.currentTarget);
            }
        }
    }

    onMouseEnter(evt) {
        evt.preventDefault();
        var id = evt.currentTarget.getAttribute("id");
        this.hoverShapeId = id;
        this.updateActualModelBeingEntered(id);

        if (this.mouseDown) {
            // Doing a drag operation, so ignore shapes we enter and leave so
            // that even if the mouse moves over another shape, we keep track
            // of the shape we're dragging.
        } else {
            // Hover management.  We're usually always leaving some shape, including the surface.
            if (this.leavingId != -1) {
                console.log("Leaving " + this.leavingId);

                // If we're entering an anchor, don't leave anything as we want to preserve the anchors.
                if (!this.controllers[id][0].isAnchorController) {
                    this.currentHoverControllers.map(c => c.onMouseLeave());
                    console.log("Entering " + id + " => " + this.controllers[id].map(ctrl=>ctrl.constructor.name).join(", "));
                    // Tell the new shape that we're entering.
                    this.currentHoverControllers = this.controllers[id];
                    this.currentHoverControllers.map(c => c.onMouseEnter());
                } else {
                    console.log("Leaving shape to enter anchor.");
                }
            }
        }
    }

    onMouseLeave(evt) {
        evt.preventDefault();
        this.leavingId = evt.currentTarget.getAttribute("id");
        this.hoverShapeId = null;
    }

    // Update the actual model being entered.  It must be an actual shape model.
    updateActualModelBeingEntered(id) {
        var shapeController = this.controllers[id].find(ctrl => ctrl.model.isShape);

        if (shapeController !== undefined) {
            this.actualModel = shapeController.model;
        }
    }

    // Returns the controllers associated with the SVG element.
    getControllers(evt) {
        var id = evt.currentTarget.getAttribute("id");
        var controllers = this.controllers[id];

        return controllers;
    }

    getControllersById(id) {
        var controllers = this.controllers[id];

        return controllers;
    }

    getControllersByElement(el) {
        var id = el.getAttribute("id");

        return this.getControllersById(id);
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeControllers = null;
    }

    // Move the shape out of the toolbox group and into the objects group.
    // This requires dealing with surface translation.
    // Show the anchors, because the mouse is currently over the shape since it
    // is being drageed & dropped.
    finishDragAndDrop(elDropped, elCurrent) {
        // Remove from toolbox group, translate, add to objects group.
        Helpers.getElement(Constants.SVG_TOOLBOX_ID).removeChild(elDropped);
        var id = elDropped.getAttribute("id");
        this.controllers[id].map(c => c.model.translate(-surfaceModel.tx + toolboxGroupController.model.tx, -surfaceModel.ty + toolboxGroupController.model.ty));
        Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(elDropped);

        // Only show anchors if mouse is actually on the dropped shape.
        if (id == elCurrent.getAttribute("id")) {
            this.currentHoverControllers = this.controllers[id];
            this.currentHoverControllers.map(c => c.onMouseEnter());
        }

        this.draggingToolboxShape = false;
    }
}

