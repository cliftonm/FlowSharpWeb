class Event {
    constructor() {
        this.listeners = [];
    }

    attach(listener) {
        this.listeners.push(listener);
    }

    // args (if any) is expected to be a dictionary of key-value pairs.
    fire(sender, args) {
        this.listeners.forEach(listener => listener(sender, args));
    }
}