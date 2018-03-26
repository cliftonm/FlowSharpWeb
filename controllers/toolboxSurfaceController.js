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

    onDrag(dx, dy) {
        toolboxGroupController.onDrag(dx, dy);
    }
}
