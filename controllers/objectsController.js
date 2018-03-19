class ObjectsController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // We do not want to attach mouse events to the view of the "objects" SVG element!
    wireUpEvents() { }
}