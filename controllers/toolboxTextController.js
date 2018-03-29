class ToolboxTextController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var group = Helpers.createElement("g", {}, false);
        var el = Helpers.createElement('text', { x: x, y: y, "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = Constants.DEFAULT_TEXT;
        group.appendChild(el);
        var model = new TextModel();
        model._x = x;
        model._y = y;
        model._text = Constants.DEFAULT_TEXT;
        var view = new TextView(group, model);
        var controller = new TextController(this.mouseController, view, model);

        return { el: group, model: model, view: view, controller: controller };
    }
}
