class PropertyGridView {
    propertyChanged(model, propertyName, value) {

        if (model.shapeName !== undefined && value != null) {
            console.log(model.shapeName + " : " + propertyName + ' = ' + value);

            // TODO: x, y, width, height and translate all affect the x, y, w, h PG controls.
            // Also, we map to a function that deals with the setting of the value, particularly
            // to perform computations and custom UI control value settings, like colors, comboboxes with line ends, width num up/down, etc.

            let gridControlId = pnpcMap[propertyName];

            if (gridControlId !== undefined) {
                document.getElementById(gridControlId).value = value;
            }
        }
    }
}
