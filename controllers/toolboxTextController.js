class ToolboxTextController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var el = Helpers.createElement('text', { x: x, y: y, "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = Constants.DEFAULT_TEXT;
        var model = new TextModel();
        model._x = x;
        model._y = y;
        model._text = Constants.DEFAULT_TEXT;
        var view = new TextView(el, model);
        var controller = new TextController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}
