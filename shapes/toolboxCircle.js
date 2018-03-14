class ToolboxCircle extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    // For click and drop
    createElement() {
        var el = super.createElement('circle', { cx: 260, cy: 130, r: 30, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        return el;
    }

    // For drag and drop
    createElementAt(x, y) {
        var el = super.createElement('circle', { cx: x, cy: y, r: 30, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Circle(mouseController, el);

        return shape;
    }
}
