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
        el.setAttributeNS(null, "id", Helpers.uuidv4());

        // Create a class common to all shapes so that, on file load, we can get them all and re-attach them
        // to the mouse controller.
        el.setAttributeNS(null, "class", SHAPE_CLASS_NAME);

        // Add the attributes to the element.
        Object.entries(attributes).map(([key, val]) => el.setAttributeNS(null, key, val));

        return el;
    }

    // A child element doesn't set the class attribute.
    createChildElement(elementName, attributes) {
        var el = document.createElementNS(this.svgns, elementName);

        // Create a unique ID for the element so we can acquire the correct shape controller
        // when the user drags the shape.
        el.setAttributeNS(null, "id", Helpers.uuidv4());

        // Add the attributes to the element.
        Object.entries(attributes).map(([key, val]) => el.setAttributeNS(null, key, val));

        return el;
    }
}
