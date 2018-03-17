class Point {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

    translate(x, y) {
        this.X += x;
        this.Y += y;

        return this;
    }
}