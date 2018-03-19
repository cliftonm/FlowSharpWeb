class ShapeView extends View {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    get x() {
        return +this.svgElement.getAttribute("x");
    }

    get y() {
        return +this.svgElement.getAttribute("y")
    }
}
