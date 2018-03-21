class ToolboxDiamondController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // For drag and drop
    createElementAt(x, y) {
        var points = [{ cmd: "M", x: x - 15, y: y - 30 }, { cmd: "L", x: x - 45, y: y }, { cmd: "L", x: x - 15, y: y + 30 }, { cmd: "L", x: x + 15, y: y }];
        var path = points.reduce((acc, val) => acc = acc + val.cmd + " " + val.x + " " + val.y, "");
        path = path + " Z";
        var el = Helpers.createElement('path', { d: path, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        var model = new Model();
        model._d = path;
        var view = new ShapeView(el, model);
        var controller = new DiamondController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}
