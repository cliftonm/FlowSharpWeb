class Event {
    constructor() {
        this.listeners = [];
        this.keyedListeners = {};
    }

    // Attaches a listener for the lifetime of the object containing the event.
    // These listeners cannot be detached.
    attach(listener) {
        this.listeners.push(listener);
    }

    // Attaches a listener with a specific key, which can be detached
    attachKeyed(key, listener) {
        this.keyedListeners[key] = listener;
    }

    // Detaches the listener with the specified key.
    detachKeyed(key) {
        delete this.keyedListeners[key];
    }

    // args (if any) is expected to be a dictionary of key-value pairs.
    fire(sender, args) {
        this.listeners.forEach(listener => listener(sender, args));
        Object.values(this.keyedListeners).forEach(listener => listener(sender, args));
    }
}