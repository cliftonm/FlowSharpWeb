class SvgToolboxElement extends SvgObject {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
        this.toolboxController = toolboxController;
        this.registerEventListener(svgElement, "mousedown", toolboxController.onMouseDown, toolboxController);
        this.registerEventListener(svgElement, "mouseup", toolboxController.onMouseUp, toolboxController);
        this.registerEventListener(svgElement, "mousemove", toolboxController.onMouseMove, toolboxController);
        this.svgns = "http://www.w3.org/2000/svg";
    }

    onDrag(evt) {
        super.onDrag(evt);
        // this.svgElement.setAttribute("transform", "translate(" + this.X + "," + this.Y + ")");
    }

    // Create the specified element with the attributes provided in a key-value dictionary.
    createElement(elementName, attributes) {
        var el = document.createElementNS(this.svgns, elementName);

        for (var key in attributes) {
            var val = attributes[key];
            el.setAttributeNS(null, key, val);
        }

        return el;
    }
}
