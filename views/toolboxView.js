class ToolboxView extends View {
    constructor(svgSurface, surfaceModel) {
        super(svgSurface, surfaceModel);
    }

    // For surface, we always move the group, not the child elements.
    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}
