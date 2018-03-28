class AnchorView extends View {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // For anchors, we always move the group, not the child elements.
    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}