class PropertyGridView {
    constructor(mouseController) {
        this.mouseController = mouseController;
        this.currentModel = undefined;
        this.pnpcMap = {};
        this.aliases = {};
        mouseController.eventShapeSelected.attach(this.onShapeSelected.bind(this));
    }

    // Show the shape ID on the property grid.
    onShapeSelected(sender, args) {
        document.getElementById(Constants.SHAPE_ID).innerHTML = args.shapeId;
        this.unregisterExistingPropertyChangedEvent(args.model);
        this.registerPropertyChangedEvent(args.model);
        this.renderProperties(args.model);
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

            let gridControlId = this.pnpcMap[propertyName];

            if (gridControlId === undefined) {
                let alias = this.aliases[propertyName];
                gridControlId = this.pnpcMap[alias];
            }

            if (gridControlId !== undefined) {
                document.getElementById(gridControlId).value = value;
            } 
        }
    }

    unregisterExistingPropertyChangedEvent(model) {
        if (this.currentModel !== undefined && this.currentModel != model) {
            this.currentModel.eventPropertyChanged.detachKeyed(Constants.PROPERTY_GRID_LISTENER_KEY, this.propertyChanged.bind(this));
        }
    }

    registerPropertyChangedEvent(model) {
        this.currentModel = model;
        this.currentModel.eventPropertyChanged.attachKeyed(Constants.PROPERTY_GRID_LISTENER_KEY, this.propertyChanged.bind(this));
    }

    renderProperties(model) {
        this.pnpcMap = {};
        let twoColumnPropertyGridTemplate =
            '<tr id="row0">' +
            '  <td id = "rc00"></td>' +
            '  <td><input id="prop00" style="width:70px" /></td>' +
            '  <td id="rc01" style="padding-left:50px"></td>' +
            '  <td><input id="prop01" style="width:70px" /></td>' +
            '</tr > ';

        let rowNum = -1;
        let pg = document.getElementById(Constants.PROPERTY_GRID_ID);
        pg.innerHTML = '';

        model.getProperties().filter(p => p.alias === undefined).forEach(p => {
            let col = p.column;
            let row = p.row;
            let rowHtml = '';
            let newRow = row > rowNum;

            // Allow for empty rows as visual spacing
            while (row > rowNum) {
                rowNum += 1;
                rowHtml = twoColumnPropertyGridTemplate;
                rowHtml = rowHtml.replace('row0', 'row' + rowNum);
                rowHtml = rowHtml.replace('rc00', 'rc' + rowNum + '-0');
                rowHtml = rowHtml.replace('prop00', 'prop' + rowNum + '-0');
                rowHtml = rowHtml.replace('rc01', 'rc' + rowNum + '-1');
                rowHtml = rowHtml.replace('prop01', 'prop' + rowNum + '-1');
                pg.innerHTML += rowHtml;
            }

            let labelid = 'rc' + rowNum + '-' + col;
            let propid = 'prop' + row + '-' + col;
            this.pnpcMap[p.propertyName] = propid;
            document.getElementById(labelid).innerHTML = p.label + ':';
        });

        // Initialize all property grid input box values.
        model.getProperties().filter(p => p.alias === undefined).forEach(p => {
            let gridControlId = this.pnpcMap[p.propertyName];

            if (gridControlId !== undefined) {
                document.getElementById(gridControlId).value = p.getter();
            }
        });

        // Setup aliases
        this.aliases = {};
        model.getProperties().filter(p => p.alias !== undefined).forEach(p => this.aliases[p.propertyName] = p.alias);
    }
}
