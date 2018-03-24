class TextController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get shouldShowAnchors() {
        return false;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    // Update the UI with the text associated with the shape.
    onMouseDown(evt) {
        super.onMouseDown(evt);
        var text = this.model.text;
        document.getElementById("text").value = text;
    }

    getULCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.left, rect.top);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    getLRCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.right, rect.bottom);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }
}