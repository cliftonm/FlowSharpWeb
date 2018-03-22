class TextController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // Update the UI with the text associated with the shape.
    onMouseDown(evt) {
        super.onMouseDown(evt);
        var text = this.model.text;
        document.getElementById("text").value = text;
        this.mouseController.selectedShapeController = this;
    }
}