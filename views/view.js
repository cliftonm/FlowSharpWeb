class View {
    constructor(svgElement, model) {
        this.svgElement = svgElement;
        model.eventPropertyChanged = this.onPropertyChange.bind(this);
    }

    get id() {
        return this.svgElement.getAttribute("id");
    }

    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}
