class SvgObject {
    constructor(mouseController, svgElement) {
        this.mouseController = mouseController;
        this.events = [];
        this.X = 0;
        this.Y = 0;
        this.mouseController.register(svgElement, this);
    }

    // Register the event so that when we destroy the object, we can unwire the event listeners.
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
    }

    onDrag(evt) {
        var mouseX = evt.clientX;
        var mouseY = evt.clientY;
        var mouseDX = mouseX - this.mouseController.mouseDownX;
        var mouseDY = mouseY - this.mouseController.mouseDownY;
        this.X += mouseDX;
        this.Y += mouseDY;
        this.mouseController.mouseDownX = mouseX;
        this.mouseController.mouseDownY = mouseY;
    }

    onMouseLeave(evt) { }
}
