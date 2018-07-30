class TextView extends View{
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // Custom handling for property "text"
    onPropertyChange(sender, args) {
        if (args.propertyName == "text") {
            this.actualElement.innerHTML = args.value;
        } else {
            super.onPropertyChange(sender, args);
        }
    }
}
