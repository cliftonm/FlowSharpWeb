class ObjectsView extends View {
    constructor(svgObjects, shapesModel) {
        super(svgObjects, shapesModel);
    }

    // For objects, we always move the group, not the child elements.
    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}