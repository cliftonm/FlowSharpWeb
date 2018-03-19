class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    translate(x, y) {
        var p = new Point(this.x + x, this.y + y);

        return p;
    }
}