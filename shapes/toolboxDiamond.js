class ToolboxDiamond extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }


    createElement() {
        var el = super.createElement('path', { d: "M 240 100 L 200 140 L 240 180 L 280 140 Z", stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });
        // Use the mouse controller associated with the surface.
        this.toolboxController.dropShapeOnSurface(el, new Rectangle(this.toolboxController.mouseController, el));
    }
}
