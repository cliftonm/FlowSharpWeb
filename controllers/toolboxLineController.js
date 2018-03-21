class ToolboxLineController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // For drag and drop
    createElementAt(x, y) {
        var x1 = x - 30;
        var y1 = y - 30;
        var x2 = x + 30;
        var y2 = y + 30;
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));

        var model = new Model();
        model._x1 = x1;
        model._y1 = y1;
        model._x2 = x2;
        model._y2 = y2;
        var view = new LineView(el, model);
        var controller = new LineController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}
