class View {
    constructor(svgElement, model) {
        this.svgElement = svgElement;
        model.eventPropertyChanged = this.onPropertyChange.bind(this);
    }

    get id() {
        return this.svgElement.getAttribute("id");
    }

    set id(val) {
        this.svgElement.setAttribute("id", val);
    }

    onPropertyChange(property, value) {
        // Every shape is grouped, so we want to update the property of the first child in the group.
        // firstElementChild ignores text and comment nodes.
        if (this.svgElement.firstElementChild == null) {
            this.svgElement.setAttribute(property, value);
        } else {
            this.svgElement.firstElementChild.setAttribute(property, value);
        }
    }
}
