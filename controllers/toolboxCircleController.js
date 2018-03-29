class ToolboxCircleController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var group = Helpers.createElement("g", {}, false);
        var el = Helpers.createElement('circle', { cx: x, cy: y, r:30, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        group.appendChild(el);
        var model = new CircleModel();
        model._cx = x;
        model._cy = y;
        model._r = 30;
        var view = new ShapeView(group, model);
        var controller = new CircleController(this.mouseController, view, model);

        return { el: group, model: model, view: view, controller: controller };
    }
}
