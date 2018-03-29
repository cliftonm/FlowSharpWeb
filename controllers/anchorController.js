class AnchorController extends Controller {
    constructor(mouseController, view, model, shapeController, fncDragAnchor, anchorIdx) {
        super(mouseController, view, model);
        this.fncDragAnchor = fncDragAnchor;
        this.anchorIdx = anchorIdx;

        // Structure:
        // { id: shapeId, controller: shapeController, connectionPoints: connectionPoints[] }
        this.shapeConnectionPoints = [];

        // Save the controller that is associated with the shape for which we're
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

    onMouseUp(isClick) {
        super.onMouseUp(isClick);
        this.connectIfCloseToShapeConnectionPoint();
        this.removeConnectionPoints();
        this.shapeConnectionPoints = [];
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

    getNewNearbyShapes(x, y) {
        var newShapes = [];
        var existingShapes = [];
        var p = new Point(x, y);
        p = Helpers.translateToScreenCoordinate(p);
        var nearbyShapeEls = Helpers.getNearbyShapes(p); // .filter(s => s.outerHTML.split(" ")[0].substring(1) != "line");
        // logging:
        // nearbyShapesEls.map(s => console.log(s.outerHTML.split(" ")[0].substring(1)));

        nearbyShapeEls.map(el => {
            // We use the parentElement because that's the ID of the shape controller in the mouseController.
            var controllers = this.mouseController.getControllersByElement(el.parentElement);

            if (controllers) {
                controllers.map(ctrl => {
                    if (ctrl.hasConnectionPoints) {
                        var shapeId = ctrl.view.actualId;

                        // If it already exists in the list, don't add it again.
                        if (!this.shapeConnectionPoints.any(cp => cp.id == shapeId)) {
                            var connectionPoints = ctrl.getConnectionPoints();
                            newShapes.push({ id: shapeId, controller: ctrl, connectionPoints: connectionPoints });
                        } else {
                            existingShapes.push({ id: shapeId });
                        }
                    }
                });
            }
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

    connectIfCloseToShapeConnectionPoint() {
        var p = new Point(this.mouseController.x, this.mouseController.y);
        p = Helpers.translateToScreenCoordinate(p);

        var nearbyConnectionPoints = [];
        
        this.shapeConnectionPoints.filter(scp => {
            for (var i = 0; i < scp.connectionPoints.length; i++) {
                var cpStruct = scp.connectionPoints[i];
                if (Helpers.isNear(cpStruct.connectionPoint, p, Constants.MAX_CP_NEAR)) {
                    nearbyConnectionPoints.push({ shapeController: scp.controller, shapeCPIdx : i, connectionPoint : cpStruct.connectionPoint});
                }
            }
        });

        if (nearbyConnectionPoints.length == 1) {
            var ncp = nearbyConnectionPoints[0];

            // The location of the connection point of the shape to which we're connecting.
            var p = ncp.connectionPoint;
            // Physical location of endpoint is without line and surface translations.
            p = p.translate(-this.shapeController.model.tx, -this.shapeController.model.ty);
            p = p.translate(-surfaceModel.tx, - surfaceModel.ty);
            // Move the endpoint of the shape from which we're connecting (the line) to this point.
            this.shapeController.connect(this.anchorIdx, p);
            diagramModel.connect(ncp.shapeController.view.id, this.shapeController.view.id, ncp.shapeCPIdx, this.anchorIdx);
        }
    }
}