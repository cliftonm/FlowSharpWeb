const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeControllers = null;
        this.currentHoverShapeId = "";
        this.currentHoverControllers = [];

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

    // Detaches all controllers and unwires events associated with the controller.
    destroyAll() {
        Object.entries(this.controllers).map(([key, val]) => val.map(v => v.destroy()));
        this.controllers = {};
    }

    destroyAllButSurface() {
        Object.entries(this.controllers).map(([key, val]) => {
            if (!(val instanceof SurfaceController)) {
                val.map(v => v.destroy());
                // Hopefully deleting the dictionary entry while iterating won't be
                // a disaster since we called Object.entries!
                delete this.controllers[key];
            }
        });
    }

    isClick(evt) {
        var endDownX = evt.clientX;
        var endDownY = evt.clientY;

        var isClick = Math.abs(this.startDownX - endDownX) < TOOLBOX_DRAG_MIN_MOVE &&
            Math.abs(this.startDownY - endDownY) < TOOLBOX_DRAG_MIN_MOVE;

        return isClick;
    }

    // Get the controller associated with the event and remember where the user clicked.
    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.activeControllers = this.controllers[id];
            this.selectedShape = id;
            this.mouseDown = true;
            this.x = evt.clientX;
            this.y = evt.clientY;
            this.activeControllers.map(c => c.onMouseDown());
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
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeControllers != null) {
            evt.preventDefault();
            this.activeControllers.map(c => c.onMouseUp());
            this.clearSelectedObject();
        }
    }

    onMouseEnter(evt) {

        if (this.mouseDown) {
           // Doing a drag operation, so ignore shapes we enter and leave.
        } else {
            var id = evt.currentTarget.getAttribute("id");

            // Hover management.
            // Do we have controllers for the shape we're entering, and is it a new shape?
            if (this.controllers[id] !== undefined && this.currentHoverShapeId != id) {
                // Tell the shape's controllers that we were in that we're leaving.
                this.currentHoverControllers.map(c => c.onMouseLeave());

                // Tell the new shape that we're entering.
                this.currentHoverShapeId = id;
                this.currentHoverControllers = this.controllers[id];
                this.currentHoverControllers.map(c => c.onMouseEnter());
            }
        }
    }

    onMouseLeave(evt) {
        evt.preventDefault();
        if (this.mouseDown) {
            // Doing a drag operation, so see what the controller wants to do.
            // For example, the surface clears the selection.
            this.activeControllers.map(c => c.onMouseLeave());
        }
    }

    // Returns the controllers associated with the SVG element.
    getControllers(evt) {
        var id = evt.currentTarget.getAttribute("id");
        var controllers = this.controllers[id];

        return controllers;
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeControllers = null;

        // TODO: The idea here is to clear the surface selection if the user leaves the surface
        // while dragging the surface.  This doesn't work too well.
        //if (!this.clearing) {
        //    this.clearing = true;
        //    // Clears any anchors but also prevents recursion.
        //    this.currentHoverControllers.map(c => c.onMouseLeave());
        //    this.clearing = false;
        //}
    }
}

