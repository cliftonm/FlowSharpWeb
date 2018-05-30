class SurfaceController extends Controller {
    constructor(mouseController, surfaceView, surfaceModel) {
        super(mouseController, surfaceView, surfaceModel);
    }

    get shapeName() { return "surface"; }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // overrides Controller.onDrag
    onDrag(dx, dy) {
        this.model.updateTranslation(dx, dy);
        var dx = this.model.tx % this.model.gridCellW;
        var dy = this.model.ty % this.model.gridCellH;
        this.model.setTranslate(dx, dy);
    }

    onMouseLeave() {
        this.mouseController.clearSelectedObject();
    }
}
