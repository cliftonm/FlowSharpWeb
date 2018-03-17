class SvgObject {
    constructor(mouseController, svgElement) {
        this.mouseController = mouseController;
        this.svgElement = svgElement;
        this.events = [];

        // These two parameters are actually the shape TRANSLATION, not the absolute coordinates!!!
        this.X = 0;
        this.Y = 0;

        // These two parameters are the relative change during the CURRENT translation.
        // These is reset to 0 at the beginning of each move.
        // We use these numbers for translating the anchors because anchors are always 
        // placed with an initial translation of (0, 0)
        this.dragX = 0;
        this.dragY = 0;

        this.mouseController.attach(svgElement, this);
    }

    // Register the event so that when we destroy the object, we can unwire the event listeners.
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

    startMove() {
        this.dragX = 0;
        this.dragY = 0;
    }

    updatePosition(evt) {
        var mouseX = evt.clientX;
        var mouseY = evt.clientY;
        var mouseDX = mouseX - this.mouseController.mouseDownX;
        var mouseDY = mouseY - this.mouseController.mouseDownY;
        this.X += mouseDX;
        this.Y += mouseDY;
        this.dragX += mouseDX;
        this.dragY += mouseDY;
        this.mouseController.mouseDownX = mouseX;
        this.mouseController.mouseDownY = mouseY;
    }

    onMouseLeave(evt) { }
}
