class ToolboxCircleController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        // var el = super.createElement('circle', { cx: x, cy: y, r: 30, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });
        var el = Helpers.createElement('circle', { cx: x, cy: y, r:30, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        var model = new CircleModel();
        model._cx = x;
        model._cy = y;
        model._r = 30;
        var view = new ShapeView(el, model);
        var controller = new CircleController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}
