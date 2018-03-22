class AnchorController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isAnchorController() {
        return true;
    }
}