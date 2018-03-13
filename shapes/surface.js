class Surface extends SvgElement {
    constructor(mouseController, svgSurface, svgObjects) {
        super(mouseController, svgSurface);
        this.svgObjects = svgObjects;
        this.gridCellW = 80;
        this.gridCellH = 80;

        this.registerEventListener(svgSurface, "mouseleave", mouseController.onMouseLeave, mouseController);
    }

    onDrag(evt) {
        super.onDrag(evt);
        var dx = this.X % this.gridCellW;
        var dy = this.Y % this.gridCellH;
        this.scrollSurface(dx, dy, this.X, this.Y);
    }

    onMouseLeave() {
        this.mouseController.clearSelectedObject();
    }

    scrollSurface(dx, dy, x, y) {
        // svgElement is the surface.
        this.svgElement.setAttribute("transform", "translate(" + dx + "," + dy + ")");
        this.svgObjects.setAttribute("transform", "translate(" + x + "," + y + ")");
    }

    // Programmatically change the grid spacing for the larger grid cells and smaller grid cells.
    resizeGrid(lw, lh, sw, sh) {
        this.gridCellW = lw;
        this.gridCellH = lh;
        var elLargeGridRect = document.getElementById("largeGridRect");
        var elLargeGridPath = document.getElementById("largeGridPath");
        var elLargeGrid = document.getElementById("largeGrid");

        var elSmallGridPath = document.getElementById("smallGridPath");
        var elSmallGrid = document.getElementById("smallGrid");

        var elSvg = document.getElementById("svg");
        var elSurface = document.getElementById("surface");
        var elGrid = document.getElementById("grid");

        elLargeGridRect.setAttribute("width", lw);
        elLargeGridRect.setAttribute("height", lh);

        elLargeGridPath.setAttribute("d", "M " + lw + " 0 H 0 V " + lh);
        elLargeGrid.setAttribute("width", lw);
        elLargeGrid.setAttribute("height", lh);

        elSmallGridPath.setAttribute("d", "M " + sw + " 0 H 0 V " + sh);
        elSmallGrid.setAttribute("width", sw);
        elSmallGrid.setAttribute("height", sh);

        elGrid.setAttribute("x", -lw);
        elGrid.setAttribute("y", -lh);

        var svgW = elSvg.getAttribute("width");
        var svgH = elSvg.getAttribute("height");

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);

        elSurface.setAttribute("x", -lw);
        elSurface.setAttribute("y", -lh);

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);
    }
}
