class View {
    constructor(svgElement, model) {
        this.svgElement = svgElement;
        model.eventPropertyChanged.attach(this.onPropertyChange.bind(this));
    }

    get id() {
        return this.svgElement.getAttribute("id");
    }

    set id(val) {
        this.svgElement.setAttribute("id", val);
    }

    // Returns the ID of the first child, the "real" shape, of the group surrounding the shape.
    get actualId() {
        return this.actualElement.getAttribute("id");
    }

    // Anchors don't have a wrapping group so there are no child elements.
    get actualElement() {
        return this.svgElement.firstElementChild == null ? this.svgElement : this.svgElement.firstElementChild;
    }

    onPropertyChange(sender, args) {
        // Every shape is grouped, so we want to update the property of the first child in the group.
        // This behavior is overridden by specific views -- surface and objects, for example.
        // firstElementChild ignores text and comment nodes.
        // this.svgElement.firstElementChild.setAttribute(property, value);

        this.actualElement.setAttribute(args.propertyName, args.value);
    }
}
