class ToolboxImageController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get shapeName() { return "image"; }

    createElementAt(x, y) {
        var group = Helpers.createElement("g", {}, false);
        var el = Helpers.createElement('image', { x: x - 30, y: y - 30, width: 60, height: 60, href: Constants.DEFAULT_IMAGE_HREF });
        group.appendChild(el);
        var model = new ImageModel();
        model._x = x - 30;
        model._y = y - 30;
        model._width = 60;
        model._height = 60;
        model._href = Constants.DEFAULT_IMAGE_HREF;
        var view = new ShapeView(group, model);
        var controller = new ImageController(this.mouseController, view, model);

        return { el: group, model: model, view: view, controller: controller };
    }
}
