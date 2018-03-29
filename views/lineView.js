class LineView extends ShapeView {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    onPropertyChange(property, value) {
        // A line consists of a transparent portion [0] with a larger stroke width than the visible line [1]
        // firstElementChild drills into the outer group.
        this.svgElement.firstElementChild.children[0].setAttribute(property, value);
        this.svgElement.firstElementChild.children[1].setAttribute(property, value);
    }
}
