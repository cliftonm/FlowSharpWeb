class ToolboxRectangle extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    // For click and drop
    createElement() {
        var el = super.createElement('rect', { x: 240, y: 100, width: 60, height: 60, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });

        return el;
    }

    // For drag and drop
    createElementAt(x, y) {
        var el = super.createElement('rect', { x: x-30, y: y-30, width: 60, height: 60, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Rectangle(mouseController, el);

        return shape;
    }
}
