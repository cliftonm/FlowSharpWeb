class ToolboxSurfaceController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // toolbox surface doesn't move around!
    onDrag(dx, dy) { }
}
