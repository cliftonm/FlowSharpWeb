class Event {
    constructor() {
        this.listeners = [];
    }

    attach(listener) {
        this.listeners.push(listener);
    }

    fire(sender, args) {
        this.listeners.forEach(listener => listener(sender, args));
    }
}