class ToolboxTextController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var el = Helpers.createElement('text', { x: x, y: y, "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = "[text]";
        var model = new ShapeModel();
        model._x = x;
        model._y = y;
        var view = new TextView(el, model);
        var controller = new TextController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}
