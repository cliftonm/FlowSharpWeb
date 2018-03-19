// The shape controller handles showing the anchors and other decorations.
class ShapeController extends Controller {
    constructor(mouseController, shapeView, shapeModel) {
        super(mouseController, shapeView, shapeModel);
        this.showingAnchors = false;

        // Creating a model, view, and controller for nachors seems ridiculous.
        this.anchors = [];
        this.anchortx = 0;
        this.anchorty = 0;
    }

    // Not all shapes have anchors.
    getAnchors() {
        return [];
    }

    getCorners() {
        return [this.getULCorner(), this.getLRCorner()];
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);

        if (this.showingAnchors) {
            this.anchortx += dx;
            this.anchorty += dy;
            var anchorGroup = Helpers.getElement(Constants.ANCHORS_ID);
            anchorGroup.setAttributeNS(null, "transform", "translate(" + this.anchortx + ", " + this.anchorty + ")");
        }
    }

    onMouseEnter() {
        if (!this.mouseController.mouseDown && !this.showingAnchors) {
            this.anchors = this.getAnchors();
            this.showAnchors();
            this.showingAnchors = true;
        }
    }

    // If we're showing the anchors, moving the mouse on top of an anchor will cause the current shape to leave, which
    // will erase the anchors!
    onMouseLeave() {
        if (!this.mouseController.mouseDown && this.showingAnchors) {
            this.removeAnchors();
            this.anchors = [];
            this.showingAnchors = false;
        }
    }

    // We need to set up a partial call so that we can include the anchor being dragged when we call
    // the drag method for moving the shape's anchor.  At that point we also pass in the event data.
    partialCall(anchors, anchorElement, onDrag) {
        return (function (anchors, anchorElement, onDrag) {
            return function (dx, dy) { onDrag(anchors, anchorElement, dx, dy); }
        })(anchors, anchorElement, onDrag);
    }

    showAnchors() {
        var anchorGroup = Helpers.getElement(Constants.ANCHORS_ID);
        // Reset any translation because the next mouse hover will set the anchors directly over the shape.
        // Direct assignment, we don't have or need an MVC for the anchors group.
        anchorGroup.setAttributeNS(null, "transform", "translate(0, 0)");
        this.anchortx = 0;
        this.anchorty = 0;
        // We pass in the shape (which is also the surface) mouse controller so we can
        // handle when the shape or surface gets the mousemove event, which happens if
        // the user moves the mouse too quickly and the pointer leaves the anchor rectangle.

        // this.anchorController = new AnchorController(this);
        var anchorElements = [];

        this.anchors.map(anchorDefinition => {
            var anchor = anchorDefinition.anchor;
            var el = this.createElement("rect", { x: anchor.x - 5, y: anchor.y - 5, width: 10, height: 10, fill: "#FFFFFF", stroke: "#808080", "stroke-width": 0.5 });
            anchorElements.push(el);
            anchorGroup.appendChild(el);
        });

        // Separate iterator so we can pass in all the anchor elements to the onDrag callback once they've been accumulated.
        for (var i = 0; i < anchors.length; i++) {
            var anchorDefinition = anchors[i];
            var el = anchorElements[i];
            // Create anchor shape, wire up anchor events, and attach it to the MouseController::AnchorController object.
            // new Anchor(this.anchorController, el, this.partialCall(anchorElements, el, anchorDefinition.onDrag));
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
        var anchorGroup = Helpers.getElement(Constants.ANCHORS_ID);

        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        // Will change later.
        anchorGroup.innerHTML = "";
        // this.anchorController.destroyAll();
        // Alternatively:
        //while (anchorGroup.firstChild) {
        //    anchorGroup.removeChild(anchorGroup.firstChild);
        //}
    }
}