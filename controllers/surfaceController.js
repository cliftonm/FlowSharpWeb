class SurfaceController extends Controller {
    constructor(mouseController, surfaceView, surfaceModel) {
        super(mouseController, surfaceView, surfaceModel);
    }

    // overrides Controller.onDrag.
    onDrag(evt) {
        this.model.updatePosition(evt);
        var dx = this.model.x % this.model.gridCellW;
        var dy = this.model.y % this.model.gridCellH;
        this.scrollSurface(dx, dy);
    }

    onMouseLeave() {
        this.mouseController.clearSelectedObject();
    }

    scrollSurface(dx, dy) {
        this.model.setTranslate(dx, dy);
    }
}
