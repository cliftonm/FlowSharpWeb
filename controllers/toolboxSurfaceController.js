class ToolboxSurfaceController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // toolbox surface doesn't move around!
    onDrag(dx, dy) { }
}
