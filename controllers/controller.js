class Controller {
    constructor(mouseController, view, model) {
        this.mouseController = mouseController;
        this.view = view;
        this.model = model;
        this.events = [];
        this.wireUpEvents();
    }

    registerEvent(element, eventName, callbackRef) {
        this.events.push({ element: element, eventName: eventName, callbackRef: callbackRef });
    }

    destroy() {
        this.unhookEvents();
    }

    registerEventListener(element, eventName, callback, self) {
        var ref;

        if (self == null) {
            self = this;
        }

        element.addEventListener(eventName, ref = callback.bind(self));
        this.registerEvent(element, eventName, ref);
    }

    unhookEvents() {
        for (var i = 0; i < this.events.length; i++) {
            var event = this.events[i];
            event.element.removeEventListener(event.eventName, event.callbackRef);
        }

        this.events = [];
    }

    wireUpEvents() {
        this.registerEventListener(this.view.svgElement, "mousedown", this.mouseController.onMouseDown, this.mouseController);
        this.registerEventListener(this.view.svgElement, "mouseup", this.mouseController.onMouseUp, this.mouseController);
        this.registerEventListener(this.view.svgElement, "mousemove", this.mouseController.onMouseMove, this.mouseController);
        this.registerEventListener(this.view.svgElement, "mouseover", this.mouseController.onMouseOver, this.mouseController);
        this.registerEventListener(this.view.svgElement, "mouseleave", this.mouseController.onMouseLeave, this.mouseController);
    }
/*
    getAbsoluteLocation(p) {
        p.translate(this.X, this.Y);
        p.translate(this.mouseController.surface.X, this.mouseController.surface.Y);

        return p;
    }

    getRelativeLocation(p) {
        p.translate(-this.X, -this.Y);
        p.translate(-this.mouseController.surface.X, -this.mouseController.surface.Y);

        return p;
    }
*/
    // https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
    translateToSvgCoordinate(p) {
        var svg = document.getElementById(SVG_ELEMENT_ID);
        var pt = svg.createSVGPoint();
        var offset = pt.matrixTransform(svg.getScreenCTM().inverse());
        p.translate(offset.x, offset.y);
    }

    // Routed from mouse controller:

    onMouseDown() { }

    onMouseOver()
    {
    }

    onMouseUp() { }

    onMouseLeave()
    {
    }

    // Default behavior
    onDrag(evt)
    {
        this.model.updateTranslation(evt);
        this.model.setTranslate(this.model.x, this.model.y);
    }
}
