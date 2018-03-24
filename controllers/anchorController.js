class AnchorController extends Controller {
    constructor(mouseController, view, model, shapeController) {
        super(mouseController, view, model);
        this.fncDragAnchor = null;
        this.shapeConnectionPoints = [];

        // Save the controllers that are associated with the shape for which we're
        // displaying the anchors, so we can later on see if any of the controllers allows
        // the anchors to be attached to connection points.  Currently only the line
        // controller allows this.
        this.shapeController = shapeController;
    }

    get isAnchorController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // We don't show anchors for anchors.
    // This wouldn't happen anyways because no anchors are returned,
    // but having this flag is a minor performance improvement, maybe.
    get shouldShowAnchors() {
        return false;
    }

    onDrag(dx, dy) {
        // Call into the shape controller to handle
        // the specific anchor drag.
        this.fncDragAnchor(dx, dy);
        this.showAnyConnectionPoints();
    }

    showAnyConnectionPoints() {
        if (this.shapeController.canConnectToShapes) {
            var changes = this.getNewNearbyShapes(this.mouseController.x, this.mouseController.y);
            this.createConnectionPoints(changes.newShapes);

            // Other interesting approaches:
            // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
            // [...new Set(a)].filter(x => new Set(b).has(x));
            var currentShapesId = changes.newShapes.concat(changes.existingShapes).map(ns => ns.id);

            var noLongerNearShapes = this.shapeConnectionPoints.filter(s => currentShapesId.indexOf(s.id) < 0);
            this.removeExpiredShapeConnectionPoints(noLongerNearShapes);

            // Remove any shapes from the shapeConnectionPoints that do not exist anymore.
            var existingShapesId = changes.existingShapes.map(ns => ns.id);
            this.shapeConnectionPoints = this.shapeConnectionPoints.filter(s => existingShapesId.indexOf(s.id) >= 0);

            // Add in the new shapes.
            this.shapeConnectionPoints = this.shapeConnectionPoints.concat(changes.newShapes);

            console.log("scp: " + this.shapeConnectionPoints.length + ", new: " + changes.newShapes.length + ", existing: " + existingShapesId.length);
        }
    }

    onMouseUp(isClick) {
        super.onMouseUp(isClick);
        this.removeConnectionPoints();
    }

    getNewNearbyShapes(x, y) {
        var newShapes = [];
        var existingShapes = [];
        var p = new Point(x, y);
        p = Helpers.translateToScreenCoordinate(p);
        var nearbyShapeEls = Helpers.getNearbyShapes(p).filter(s => s.outerHTML.split(" ")[0].substring(1) != "line");
        // logging:
        // nearbyShapesEls.map(s => console.log(s.outerHTML.split(" ")[0].substring(1)));

        nearbyShapeEls.map(el => {
            var controllers = this.mouseController.getControllersByElement(el);

            controllers.map(ctrl => {
                if (ctrl.hasConnectionPoints) {
                    var shapeId = ctrl.view.id;

                    // If it already exists in the list, don't add it again.
                    if (!this.shapeConnectionPoints.any(cp => cp.id == shapeId)) {
                        var connectionPoints = ctrl.getConnectionPoints();
                        newShapes.push({ id: shapeId, controller: ctrl, connectionPoints: connectionPoints });
                    } else {
                        existingShapes.push({ id: shapeId });
                    }
                }
            });
        });

        return { newShapes : newShapes, existingShapes: existingShapes };
    }

    // "shapes" is a {id, controller, connectionPoints} structure
    createConnectionPoints(shapes) {
        var cpGroup = Helpers.getElement(Constants.SVG_CONNECTION_POINTS_ID);

        shapes.map(shape => {
            shape.connectionPoints.map(cpStruct => {
                var cp = cpStruct.connectionPoint;
                var el = Helpers.createElement("g", { connectingToShapeId: shape.id });
                el.appendChild(Helpers.createElement("line", { x1: cp.x - 5, y1: cp.y - 5, x2: cp.x + 5, y2: cp.y + 5, fill: "#FFFFFF", stroke: "#000080", "stroke-width": 1 }));
                el.appendChild(Helpers.createElement("line", { x1: cp.x + 5, y1: cp.y - 5, x2: cp.x - 5, y2: cp.y + 5, fill: "#FFFFFF", stroke: "#000080", "stroke-width": 1 }));
                cpGroup.appendChild(el);
            });
        });
    }

    removeConnectionPoints() {
        var cpGroup = Helpers.getElement(Constants.SVG_CONNECTION_POINTS_ID);
        Helpers.removeChildren(cpGroup);
    }

    // "shapes" is a {id, controller, connectionPoints} structure
    removeExpiredShapeConnectionPoints(shapes) {
        shapes.map(shape => {
            // https://stackoverflow.com/a/16775485/2276361
            var nodes = document.querySelectorAll('[connectingtoshapeid="' + shape.id + '"]');
            // or: Array.from(nodes); https://stackoverflow.com/a/36249012/2276361
            // https://stackoverflow.com/a/33822526/2276361
            [...nodes].map(node => { node.parentNode.removeChild(node) });
        });
    }
}