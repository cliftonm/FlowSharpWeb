class ToolboxCircle extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    createElement() {
        var el = super.createElement('circle', { cx: 260, cy: 130, r: 31, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });
        // Use the mouse controller associated with the surface.
        this.toolboxController.dropShapeOnSurface(el, new Rectangle(this.toolboxController.mouseController, el));
    }
}
