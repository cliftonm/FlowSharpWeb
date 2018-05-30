class SurfaceView extends View {
    constructor(svgSurface, surfaceModel) {
        super(svgSurface, surfaceModel);
    }

    // For surface, we always move the group, not the child elements.
    onPropertyChange(sender, args) {
        this.svgElement.setAttribute(args.propertyName, args.value);
    }
}
