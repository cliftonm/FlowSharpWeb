class SvgToolboxElement extends SvgObject {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
        this.toolboxController = toolboxController;
        this.registerEventListener(svgElement, "mousedown", toolboxController.onMouseDown, toolboxController);
        this.registerEventListener(svgElement, "mouseup", toolboxController.onMouseUp, toolboxController);
        this.registerEventListener(svgElement, "mousemove", toolboxController.onMouseMove, toolboxController);
        this.svgns = "http://www.w3.org/2000/svg";
    }

    // Create the specified element with the attributes provided in a key-value dictionary.
    createElement(elementName, attributes) {
        var el = document.createElementNS(this.svgns, elementName);

        // Create a unique ID for the element so we can acquire the correct shape controller
        // when the user drags the shape.
        el.setAttributeNS(null, "id", this.uuidv4())

        // Add the attributes to the element.
        for (var key in attributes) {
            var val = attributes[key];
            el.setAttributeNS(null, key, val);
        }

        return el;
    }

    // From SO: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
    }
}
