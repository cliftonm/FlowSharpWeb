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
        this.mouseController.detach(this.svgElement, this);
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

    // Routed from mouse controller:

    onMouseDown() { }
    onMouseOver() { }
    onMouseUp() { }
    onDrag(evt) { }
}
