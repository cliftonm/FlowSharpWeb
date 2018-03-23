class ObjectsController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // We do not want to attach mouse events to the view of the "objects" SVG element!
    wireUpEvents() { }
}