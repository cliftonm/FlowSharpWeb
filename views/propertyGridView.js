class PropertyGridView {
    constructor(mouseController) {
        this.mouseController = mouseController;
        this.currentModel = undefined;
        this.pnpcMap = {};              // Property-Name : Property-Control map
        this.aliases = [];              // Array of key-value pairs, because some shapes, like lines, have multiple getters for a single property, like "tx"
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

            // If we don't have a grid control, then we probably have a property that is an alias to an existing property.
            // An example is where the translation (tx,ty) is actually an alias for (cx,cy) - circle or (x,y) - rectangle or (x1/x2, y1/y2) - line.
            if (gridControlId === undefined) {
                // We allow for multiple aliasing, so for a line, updates tx adjusts x1 and x2 together.
                this.aliases.filter(a => a.pname == propertyName).forEach(a => {
                    let alias = a.palias;
                    gridControlId = this.pnpcMap[alias];

                    if (gridControlId !== undefined) {
                        let getter = model.getProperties().filter(p => p.propertyName == a.pname && p.alias == alias)[0].getter;
                        let computedValue = getter();
                        // console.log("pname = " + a.pname + ", alias = " + a.palias + ", ID = " + gridControlId + ", Value = " + computedValue);
                        document.getElementById(gridControlId).value = computedValue;
                    }
                });
            } else {
                // We don't necessarily want to use the value of the property that got changed, particular with regards to (x, y) and (tx, ty).
                // Instead, we always want to use the value returned by the getter method.
                let computedValue = model.getProperties().filter(p => p.propertyName === propertyName)[0].getter();
                document.getElementById(gridControlId).value = computedValue;
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
            // let newRow = row > rowNum;

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
        this.aliases = [];
        model.getProperties().filter(p => p.alias !== undefined).forEach(p => this.aliases.push({ pname: p.propertyName, palias : p.alias }));
    }
}
