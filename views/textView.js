class TextView extends View{
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // Custom handling for property "text"
    onPropertyChange(property, value) {
        if (property == "text") {
            this.svgElement.innerHTML = value;
        } else {
            super.onPropertyChange(property, value);
        }
    }
}
