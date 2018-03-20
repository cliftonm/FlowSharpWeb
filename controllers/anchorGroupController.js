class AnchorGroupController extends Controller {
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

    showAnchors(shapeController) {
        this.anchors = shapeController.getAnchors();
        this.anchors.views = [];     // add view to the dictionary.
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
        for (var i = 0; i < this.anchors.length; i++) {
            var anchorDefinition = this.anchors[i];
            // Create anchor shape, associate it with a generic model, view, and the supplied shapeController.
            // Wire up anchor onDrag event and attach the view-controller to the mouse controller's list of shapes.
            // Note that this will now result in the shape receiving onenter/onleave events for the shape itself when the
            // user mouses over the anchor shape!  The mouse controller handles this.
            var el = anchorElements[i];
            var anchorModel = new Model();
            var anchorView = new View(el, anchorModel);
            var anchorController = new Controller(this.mouseController, anchorView, anchorModel);
            anchorController.onDrag = this.partialCall(this.anchors, anchorModel, anchorDefinition.onDrag);
            this.mouseController.attach(anchorView, anchorController);
            this.anchors.views.push(anchorView);     // Save the view for when we need to destroy the individual anchors.
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
        this.anchors.views.map(view => this.mouseController.destroy(view));
        this.anchors = [];
        this.showingAnchors = false;
        // this.anchorController.destroyAll();
        // Alternatively:
        //while (anchorGroup.firstChild) {
        //    anchorGroup.removeChild(anchorGroup.firstChild);
        //}
    }
}

