class AnchorController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
        this.anchors = [];
        this.showingAnchors = false;
    }

    // Override, as we don't have events on the anchor group.
    wireUpEvents() { }

    // We need to set up a partial call so that we can include the anchor being dragged when we call
    // the drag method for moving the shape's anchor.  At that point we also pass in the event data.
    partialCall(anchors, anchorElement, onDrag) {
        return (function (anchors, anchorElement, onDrag) {
            return function (dx, dy) { onDrag(anchors, anchorElement, dx, dy); }
        })(anchors, anchorElement, onDrag);
    }

    showAnchors(anchors) {
        this.anchors = anchors;
        this.showingAnchors = true;
        var anchorGroup = Helpers.getElement(Constants.SVG_ANCHORS_ID);
        // Reset any translation because the next mouse hover will set the anchors directly over the shape.
        this.model._tx = 0;
        this.model._ty = 0;
        this.model.setTranslate(0, 0);
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
        var anchorGroup = Helpers.getElement(Constants.SVG_ANCHORS_ID);

        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        // Will change later.
        anchorGroup.innerHTML = "";
        this.anchors = [];
        this.showingAnchors = false;
        // this.anchorController.destroyAll();
        // Alternatively:
        //while (anchorGroup.firstChild) {
        //    anchorGroup.removeChild(anchorGroup.firstChild);
        //}
    }
}

