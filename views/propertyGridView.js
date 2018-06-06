class PropertyGridView {
    constructor(mouseController) {
        this.mouseController = mouseController;
        this.currentModel = undefined;
        mouseController.eventShapeSelected.attach(this.onShapeSelected.bind(this));
    }

    // Show the shape ID on the property grid.
    onShapeSelected(sender, args) {
        document.getElementById(Constants.SHAPE_ID).innerHTML = args.shapeId;
        this.unregisterExistingPropertyChangedEvent(args.model);
        this.registerPropertyChangedEvent(args.model);
    }

    propertyChanged(sender, args) {
        let model = sender;
        let propertyName = args.propertyName;
        let value = args.value;

        if (model.shapeName !== undefined && value != null) {
            // console.log(model.shapeName + " : " + propertyName + ' = ' + value);

            // TODO: x, y, width, height and translate all affect the x, y, w, h PG controls.
            // Also, we map to a function that deals with the setting of the value, particularly
            // to perform computations and custom UI control value settings, like colors, comboboxes with line ends, width num up/down, etc.

            let gridControlId = pnpcMap[propertyName];

            if (gridControlId !== undefined) {
                document.getElementById(gridControlId).value = value;
            }
        }
    }

    unregisterExistingPropertyChangedEvent(model) {
        if (this.currentModel !== undefined && this.currentModel != model) {
            this.currentModel.eventPropertyChanged.detachKeyed("pgv", this.propertyChanged.bind(this));
        }
    }

    registerPropertyChangedEvent(model) {
        this.currentModel = model;
        this.currentModel.eventPropertyChanged.attachKeyed("pgv", this.propertyChanged.bind(this));
    }
}
