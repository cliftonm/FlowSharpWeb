class AnchorView extends View {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // For anchors, we always move the group, not the child elements.
    onPropertyChange(sender, args) {
        this.svgElement.setAttribute(args.propertyName, args.value);
    }
}