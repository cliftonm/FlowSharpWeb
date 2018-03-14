// The toolbox surface has to handle drag operations of the selected toobox item in case the user moves the
// mouse fast enough that it moves off the selected element.  In this case, the surface starts receiving 
// the mouse move events.
// TODO: what happens if the user moves the mouse onto another toolbox shape, or even so fast that it moves
// onto the grid surface???
// Because the SvgToolboxElement base class wires up the mouse events to the toolboxController, there's nothhing
// more here that needs to be done.
class ToolboxSurface extends SvgToolboxElement {
    constructor(toolboxController, svgSurface) {
        super(toolboxController, svgSurface);
    }
}
