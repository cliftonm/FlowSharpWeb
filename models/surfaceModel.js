class SurfaceModel extends Model {
    constructor() {
        super(Constants.SHAPE_SURFACE);
        this.gridCellW = 80;
        this.gridCellH = 80;
        this.cellW = 8;
        this.cellH = 8;
    }

    get actualElement() {
        return this.svgElement;
    }

    serialize() {
        var model = super.serialize();
        model.gridCellW = this.gridCellW;
        model.gridCellH = this.gridCellH;
        model.cellW = this.cellW;
        model.cellH = this.cellH;

        return { Surface: model };
    }

    deserialize(model, el) {
        // DO NOT CALL BASE METHOD.  Surface translations are mod'd by the gridCellW/H
        this.gridCellW = model.gridCellW;
        this.gridCellH = model.gridCellH;
        this.cellW = model.cellW;
        this.cellH = model.cellH;
        this.resizeGrid(this.gridCellW, this.gridCellH, this.cellW, this.cellH);

        // 
        this._tx = model.tx;
        this._ty = model.ty;

        var dx = this.tx % this.gridCellW;
        var dy = this.ty % this.gridCellH;

        this.setTranslate(dx, dy);
    }

    // Programmatically change the grid spacing for the larger grid cells and smaller grid cells.
    // None of this is relevant to the SurfaceView so we just set the attributes directly.
    resizeGrid(lw, lh, sw, sh) {
        this.gridCellW = lw;
        this.gridCellH = lh;
        this.cellW = sw;
        this.cellH = sh;
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

        var svgW = +elSvg.getAttribute("width");
        var svgH = +elSvg.getAttribute("height");

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);

        elSurface.setAttribute("x", -lw);
        elSurface.setAttribute("y", -lh);

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);
    }
}
