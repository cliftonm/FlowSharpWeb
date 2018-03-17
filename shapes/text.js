class Text extends SvgElement {
    constructor(mouseController, svgElement) {
        super(mouseController, svgElement);
        this.registerEventListener(svgElement, "mousedown", this.onMouseDown);
    }

    // Update the UI with the text associated with the shape.
    onMouseDown(evt) {
        var text = this.svgElement.innerHTML;
        document.getElementById("text").value = text;
        this.mouseController.selectedShape = this;
    }

    setText(text) {
        this.svgElement.innerHTML = text;
    }
}
