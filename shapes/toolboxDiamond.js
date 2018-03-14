class ToolboxDiamond extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    // For click and drop
    createElement() {
        var el = super.createElement('path', { d: "M 240 100 L 210 130 L 240 160 L 270 130 Z", stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        return el;
    }

    // For drag and drop
    createElementAt(x, y) {
        var el = super.createElement('path', { d: "M 240 100 L 210 130 L 240 160 L 270 130 Z", stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Diamond(mouseController, el);

        return shape;
    }
}
