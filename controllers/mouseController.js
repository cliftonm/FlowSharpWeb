const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeControllers = null;
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
            this.activeControllers.map(c => c.onMouseDown());
        }
    }

    // If the user is dragging, call the controller's onDrag function.
    onMouseMove(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeControllers != null) {
            this.activeControllers.map(c => c.onDrag(evt));
        }
    }

    onMouseOver(evt) {
        var id = evt.currentTarget.getAttribute("id");
        var controllers = this.controllers[id];
        controllers.map(c => c.onMouseOver());

        /*
        // On drag & drop, anchors are not shown because of this first test.
        // We do this test so that if the user moves the mouse quickly, we don't
        // re-initialize the anchors when the shape catches up (resulting in
        // a mousemove event again.
        if (this.activeController == null) {
            if (hoverShape instanceof SvgElement &&
                !(hoverShape instanceof ToolboxController) &&
                !(hoverShape instanceof Surface)) {
                this.displayAnchors(hoverShape);
            } else {
                this.removeAnchors();
                this.anchors = [];
            }
        }
        */
    }

    // Any dragging is now done.
    onMouseUp(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeControllers != null) {
            evt.preventDefault();
            this.activeControllers.map(c => c.onMouseUp());
            this.clearSelectedObject();
        }
    }

    // Any dragging is now done.
    onMouseLeave(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeControllers != null) {
            this.activeControllers.map(c => c.onMouseLeave());
        }
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeControllers = null;
    }

    /*
    displayAnchors(hoverShape) {
        var anchors = hoverShape.getAnchors();
        this.showAnchors(anchors);
        this.anchors = anchors;
    }

    // We need to set up a partial call so that we can include the anchor being dragged when we call
    // the drag method for moving the shape's anchor.  At that point we also pass in the event data.
    partialCall(anchors, anchorElement, onDrag) {
        return (function (anchors, anchorElement, onDrag) {
            return function (evt) { onDrag(anchors, anchorElement, evt); }
        })(anchors, anchorElement, onDrag);
    }

    showAnchors(anchors) {
        // not showing?
        if (this.anchors.length == 0) {
            var anchorGroup = getElement(ANCHORS_ID);
            // Reset any translation because the next mouse hover will set the anchors directly over the shape.
            anchorGroup.setAttributeNS(null, "transform", "translate(0, 0)");
            // We pass in the shape (which is also the surface) mouse controller so we can
            // handle when the shape or surface gets the mousemove event, which happens if
            // the user moves the mouse too quickly and the pointer leaves the anchor rectangle.
            this.anchorController = new AnchorController(this);
            var anchorElements = [];

            anchors.map(anchorDefinition => {
                var anchor = anchorDefinition.anchor;
                // Note the additional translation attributes tx and ty which we use for convenience (so we don't have to parse the transform) when translating the anchor.
                var el = this.createElement("rect", { x: anchor.X - 5, y: anchor.Y - 5, tx: 0, ty: 0, width: 10, height: 10, fill: "#FFFFFF", stroke: "#808080", "stroke-width": 0.5 });
                anchorElements.push(el);
                anchorGroup.appendChild(el);
            });

            // Separate iterator so we can pass in all the anchor elements to the onDrag callback once they've been accumulated.
            for (var i = 0; i < anchors.length; i++) {
                var anchorDefinition = anchors[i];
                var el = anchorElements[i];
                // Create anchor shape, wire up anchor events, and attach it to the MouseController::AnchorController object.
                new Anchor(this.anchorController, el, this.partialCall(anchorElements, el, anchorDefinition.onDrag));
            }
        }
    }

    // TODO: Very similar to SvgToolboxElement.createElement.  Refactor for common helper class?
    createElement(name, attributes) {
        var svgns = "http://www.w3.org/2000/svg";
        var el = document.createElementNS(svgns, name);
        el.setAttribute("id", Helpers.uuidv4());
        Object.entries(attributes).map(([key, val]) => el.setAttribute(key, val));

        return el;
    }

    removeAnchors() {
        // already showing?
        if (this.anchors.length > 0) {
            var anchorGroup = getElement(ANCHORS_ID);

            // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            // Will change later.
            anchorGroup.innerHTML = "";
            this.anchorController.destroyAll();
            // Alternatively:
            //while (anchorGroup.firstChild) {
            //    anchorGroup.removeChild(anchorGroup.firstChild);
            //}
        }
    }
    */
}

