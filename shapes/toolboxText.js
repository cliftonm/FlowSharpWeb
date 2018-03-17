class ToolboxText extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    // For click and drop
    createElement() {
        var el = super.createElement('text', { x: 240, y: 100, "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = "[text]";

        return el;
    }

    // For drag and drop
    createElementAt(x, y) {
        var el = super.createElement('text', { x: x, y: y, "font-size" : 12, "font-family" : "Verdana" });
        el.innerHTML = "[text]";

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Text(mouseController, el);

        return shape;
    }
}
