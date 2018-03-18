class Helpers {
    // From SO: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
    }

    // https://stackoverflow.com/questions/17824145/parse-svg-transform-attribute-with-javascript
    static parseTransform(transform) {
        var transforms = {};
        for (var i in a = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g)) {
            var c = a[i].match(/[\w\.\-]+/g);
            transforms[c.shift()] = c;
        }

        return transforms;
    }

    static getElement(id) {
        var svg = document.getElementById(SVG_ELEMENT_ID);
        var el = svg.getElementById(id);

        return el;
    }

    static getElements(className) {
        var svg = document.getElementById(SVG_ELEMENT_ID);
        var els = svg.getElementsByClassName(className);

        return els;
    }
}
