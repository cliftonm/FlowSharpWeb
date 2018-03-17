const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeController = null;
        this.anchors = [];
    }

    // Used for hover anchor point translation.
    setSurface(surface) {
        this.surface = surface;
    }

    // Create a map between then SVG element (by it's ID, so ID's must be unique) and its controller.
    attach(svgElement, controller) {
        var id = svgElement.getAttribute("id");
        this.controllers[id] = controller;
    }

    detach(svgElement) {
        var id = svgElement.getAttribute("id");
        delete this.controllers[id];
    }

    detachAll() {
        this.controllers = {};
    }

    destroyAllButSurface() {
        Object.entries(this.controllers).map(([key, val]) => {
            if (!(val instanceof Surface)) {
                val.destroy();
            }
        });
    }

    // The surface mouse controller needs to know the toolbox controller to finish
    // a toolbox drag & drop operation.
    setToolboxController(toolboxController) {
        this.toolboxController = toolboxController;
    }

    setSurfaceShape(surfaceShape) {
        this.surfaceShape = surfaceShape;
    }

    // Get the controller associated with the event and remember where the user clicked.
    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.activeController = this.controllers[id];
            this.mouseDown = true;
            this.mouseDownX = evt.clientX;
            this.mouseDownY = evt.clientY;
            this.startDownX = evt.clientX;
            this.startDownY = evt.clientY;
        }
    }

    // If the user is dragging, call the controller's onDrag function.
    onMouseMove(evt) {
        evt.preventDefault();

        if (this.mouseDown && this.activeController != null) {
            this.activeController.onDrag(evt);
        }
    }

    onMouseOver(evt) {
        var id = evt.currentTarget.getAttribute("id");
        var activeController = this.controllers[id];

        if (activeController instanceof SvgElement &&
            !(activeController instanceof ToolboxController) &&
            !(activeController instanceof Surface)) {
            var anchors = activeController.getAnchors();

            this.showAnchors(anchors);
            this.anchors = anchors;
        } else {
            this.removeAnchors();
            this.anchors = [];
        }
    }

    // Any dragging is now done.
    onMouseUp(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeController != null) {
            evt.preventDefault();
            // Allows the toolbox controller to finish the drag & drop operation.
            this.toolboxController.mouseUp();
            this.clearSelectedObject();
        }
    }

    // Any dragging is now done.
    onMouseLeave(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeController != null) {
            this.activeController.onMouseLeave();
        }
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeController = null;
    }

    showAnchors(anchors) {
        // not showing?
        if (this.anchors.length == 0) {
            var anchorGroup = getElement(ANCHORS_ID);

            anchors.map(anchor => {
                var el = this.createElement("rect", { x: anchor.X - 5, y: anchor.Y - 5, width: 10, height: 10, fill: "#FFFFFF", stroke: "black", "stroke-width": 0.5});
                anchorGroup.appendChild(el);
            });
        }
    }

    // TODO: Very similar to SvgToolboxElement.createElement.  Refactor for common helper class?
    createElement(name, attributes) {
        var svgns = "http://www.w3.org/2000/svg";
        var el = document.createElementNS(svgns, name);
        Object.entries(attributes).map(([key, val]) => el.setAttributeNS(null, key, val));

        return el;
    }

    removeAnchors() {
        // already showing?
        if (this.anchors.length > 0) {
            var anchorGroup = getElement(ANCHORS_ID);
            // Reset any translation because the next mouse hover will set the anchors directly over the shape.
            anchorGroup.setAttribute("transform", "translate(0, 0)");


            // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            // Will change later.
            anchorGroup.innerHTML = "";
            // Alternatively:
            //while (anchorGroup.firstChild) {
            //    anchorGroup.removeChild(anchorGroup.firstChild);
            //}
        }
    }
}

