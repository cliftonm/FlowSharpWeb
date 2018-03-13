class ToolboxRectangle extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    createElement() {
        var el = super.createElement('rect', { x: 240, y: 100, width: 80, height: 80, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        // Use the mouse controller associated with the surface.
        this.toolboxController.dropShapeOnSurface(el, new Rectangle(this.toolboxController.mouseController, el));
    }
}
