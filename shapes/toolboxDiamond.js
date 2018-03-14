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
        var points = [{ cmd: "M", x: x-15, y: y-30 }, { cmd: "L", x: x - 45, y: y }, { cmd: "L", x: x-15, y: y + 30 }, { cmd: "L", x: x + 15, y: y }];
        var path = "";

        points.forEach(function (point) {
            path = path + point.cmd + " " + point.x + " " + point.y;
        });

        path = path + " Z";
        var el = super.createElement('path', { d: path, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Diamond(mouseController, el);

        return shape;
    }
}
