class DiagramModel {
    constructor(mouseController) {
        this.mouseController = mouseController;
        this.models = [];
        this.mvc = {
            Rectangle: { model: RectangleModel, view: ShapeView, controller: RectangleController, creator : () => this.createElement("rect") },
            Circle: { model: CircleModel, view: ShapeView, controller: CircleController, creator: () => this.createElement("circle") },
            Diamond: { model: DiamondModel, view: ShapeView, controller: DiamondController, creator: () => this.createElement("path") },
            Line: { model: LineModel, view: LineView, controller: LineController, creator: () => this.createLineElement() },
            LineWithStart: { model: LineModelWithStart, view: LineView, controller: LineController, creator: () => this.createLineWithStartElement() },
            LineWithStartEnd: { model: LineModelWithStartEnd, view: LineView, controller: LineController, creator: () => this.createLineWithStartEndElement() },
            Text: { model: TextModel, view: TextView, controller: TextController, creator: () => this.createTextElement() },
            Image: { model: ImageModel, view: ShapeView, controller: ImageController, creator: () => this.createImageElement() },
        };

        // For the moment we'll use array indices into the shape's connection points.
        // This is problematic when the feature is added so that the user can add/remove connection points.
        // In that case, each shape should create its default connection points with associated id's.
        // As for the line, it should be OK to always use the endpoint index.
        // Connection structure:
        // shapeId, lineId, shapeConnectionPointIndex, lineEndpointIndex
        this.connections = [];
    }

    clear() {
        this.models = [];
        this.connections = [];
    }

    addModel(model, id) {
        this.models.push({ model: model, id: id });
    }

    connect(shapeId, lineId, shapeCPIdx, lineAnchorIdx) {
        this.connections.push({ shapeId: shapeId, lineId: lineId, shapeCPIdx: shapeCPIdx, lineAnchorIdx: lineAnchorIdx });
    }

    // Disconnect any connections associated with the line and anchor index.
    disconnect(lineId, lineAnchorIdx) {
        this.connections = this.connections.filter(c => !(c.lineId == lineId && c.lineAnchorIdx == lineAnchorIdx));
    }

    // remove connections of this shape as both the "connected to" shape (shapeId) and the "connecting" shape (lineId).
    removeShape(shapeId) {
        this.connections = this.connections.filter(c => !(c.shapeId == shapeId || c.lineId == shapeId));
        this.models = this.models.filter(m => m.id != shapeId);
    }

    createElement(elName) {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement(elName, { fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        group.appendChild(el);

        return group;
    }

    createTextElement() {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('text', { "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = Constants.DEFAULT_TEXT;
        group.appendChild(el);

        return group;
    }

    createImageElement() {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('image', {});
        group.appendChild(el);

        return group;
    }

    createLineElement(elName) {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', {"stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', {fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));
        group.appendChild(el);

        return group;
    }

    createLineWithStartElement(elName) {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', { "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', { fill: "#FFFFFF", stroke: "black", "stroke-width": 1, "marker-start": "url(#trianglestart)" }));
        group.appendChild(el);

        return group;
    }

    createLineWithStartEndElement(elName) {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', { "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', { fill: "#FFFFFF", stroke: "black", "stroke-width": 1, "marker-start": "url(#trianglestart)", "marker-end": "url(#triangleend)" }));
        group.appendChild(el);

        return group;
    }

    // Returns JSON of serialized models.
    serialize() {
        var uberModel = [];
        var model = surfaceModel.serialize();
        model[Object.keys(model)[0]].id = Constants.SVG_SURFACE_ID;
        uberModel.push(model);

        this.models.map(m => {
            var model = m.model.serialize();
            model[Object.keys(model)[0]].id = m.id;
            uberModel.push(model);
        });

        return JSON.stringify({ model: uberModel, connections: this.connections });
    }

    // Creates an MVC for each model of the provided JSON.
    deserialize(jsonString) {
        var modelData = JSON.parse(jsonString);
        var models = modelData.model;
        this.connections = modelData.connections;
        var objectModels = [];
        surfaceModel.setTranslation(0, 0);
        objectsModel.setTranslation(0, 0);

        models.map(model => {
            var key = Object.keys(model)[0];
            var val = model[key];

            if (key == "Surface") {
                // Special handler for surface, we keep the existing MVC objects.
                // We set both the surface and objects translation, but the surface translation
                // is mod'd by the gridCellW/H.
                surfaceModel.deserialize(val);
                objectsModel.setTranslation(surfaceModel.tx, surfaceModel.ty);
            } else {
                var model = new this.mvc[key].model();
                objectModels.push(model);
                var el = this.mvc[key].creator();
                // Create the view first so it hooks into the model's property change event.
                var view = new this.mvc[key].view(el, model);
                model.deserialize(val, el);
                view.id = val.id;
                var controller = new this.mvc[key].controller(mouseController, view, model);

                // Update our diagram's model collection.
                this.models.push({ model: model, id: val.id });

                Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(el);
                this.mouseController.attach(view, controller);

                // Most shapes also need an anchor controller.  An exception is the Text shape, at least for now.
                if (controller.shouldShowAnchors) {
                    this.mouseController.attach(view, anchorGroupController);
                }
            }
        });
    }
}
