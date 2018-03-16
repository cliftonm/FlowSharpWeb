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
        el.setAttributeNS(null, "id", this.uuidv4());

        // set the shape name so we can map shape names to shape constructors when loading a diagram.
        // https://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class
        el.setAttributeNS(null, SHAPE_NAME_ATTR, this.constructor.name);

        // Create a class common to all shapes so that, on file load, we can get them all and re-attach them
        // to the mouse controller.
        el.setAttributeNS(null, "class", SHAPE_CLASS_NAME);

        // Add the attributes to the element.
        Object.entries(attributes).map(([key, val]) => el.setAttributeNS(null, key, val));

        return el;
    }

    // From SO: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
    }
}
