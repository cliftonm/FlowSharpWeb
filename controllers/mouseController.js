const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeControllers = null;
        this.currentHoverControllers = [];
        this.leavingId = -1;

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

    isClick() {
        var endDownX = this.x;
        var endDownY = this.y;

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
            this.startDownX = evt.clientX;
            this.startDownY = evt.clientY;
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
            this.x = evt.clientX;
            this.y = evt.clientY;
            var isClick = this.isClick();
            this.activeControllers.map(c => c.onMouseUp(isClick));
            this.clearSelectedObject();
        }
    }

    onMouseEnter(evt) {
        evt.preventDefault();
        var id = evt.currentTarget.getAttribute("id");

        if (this.mouseDown) {
            // Doing a drag operation, so ignore shapes we enter and leave so
            // that even if the mouse moves over another shape, we keep track
            // of the shape we're dragging.
        } else {
            // Hover management.
            if (this.leavingId != -1) {
                console.log("Leaving " + this.leavingId);

                // If we're entering an anchor, don't leave anything as we want to preserve the anchors.
                if (!(this.controllers[id][0] instanceof AnchorController)) {
                    this.currentHoverControllers.map(c => c.onMouseLeave());
                    console.log("Entering " + id + " => " + this.controllers[id]);
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

