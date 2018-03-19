class SurfaceController extends Controller {
    constructor(mouseController, surfaceView, surfaceModel) {
        super(mouseController, surfaceView, surfaceModel);
    }

    // overrides Controller.onDrag.
    onDrag(evt) {
        this.model.updateTranslation(evt);
        var dx = this.model.tx % this.model.gridCellW;
        var dy = this.model.ty % this.model.gridCellH;
        this.model.setTranslate(dx, dy);
    }

    onMouseLeave() {
        this.mouseController.clearSelectedObject();
    }
}
