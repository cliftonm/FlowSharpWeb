class ToolboxLine extends SvgToolboxElement {
    constructor(toolboxController, svgElement) {
        super(toolboxController, svgElement);
    }

    /*
          <rect id="endpoint1" transform="translate(10, 70)" x="-5" y="-5" width="10" height="10" stroke-opacity="0" fill-opacity="0" />
          <rect id="endpoint2" transform="translate(50, 110)" x="-5" y="-5" width="10" height="10" stroke-opacity="0" fill-opacity="0" />
    */

    /* Create this group when dropping a line:
        <g id="toolboxLine">
          <line id="line" x1="10" y1="70" x2="50" y2="110" fill="#FFFFFF" stroke="black" stroke-width="1" />  
          <line id="lineSelection" x1="10" y1="70" x2="50" y2="110" stroke="black" stroke-width="20" stroke-opacity="0" fill-opacity="0" />
        </g>
    */

    // For click and drop
    createElement() {
        var el = super.createElement('g', {});
        el.appendChild(super.createChildElement('line', { x1: 240, y1: 100, x2: 300, y2: 160, "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(super.createChildElement('line', { x1: 240, y1: 100, x2: 300, y2: 160, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));

        return el;
    }

    // For drag and drop
    createElementAt(x, y) {
        var x1 = x - 30;
        var y1 = y - 30;
        var x2 = x + 30;
        var y2 = y + 30;
        var el = super.createElement('g', {});
        el.appendChild(super.createChildElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(super.createChildElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));

        return el;
    }

    createShape(mouseController, el) {
        var shape = new Line(mouseController, el);

        return shape;
    }
}
