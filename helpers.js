class Helpers {
    // From SO: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
            c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
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
        var svg = document.getElementById(Constants.SVG_ELEMENT_ID);
        var el = svg.getElementById(id);

        return el;
    }

    static getElements(className) {
        var svg = document.getElementById(Constants.SVG_ELEMENT_ID);
        var els = svg.getElementsByClassName(className);

        return els;
    }

    // Create the specified element with the attributes provided in a key-value dictionary.
    static createElement(elementName, attributes, createClass = true) {
        var el = document.createElementNS(Constants.SVG_NS, elementName);

        // Create a unique ID for the element so we can acquire the correct shape controller
        // when the user drags the shape.
        el.setAttributeNS(null, "id", Helpers.uuidv4());

        if (createClass) {
            // Create a class common to all shapes so that, on file load, we can get them all and re-attach them
            // to the mouse controller.
            el.setAttributeNS(null, "class", Constants.SHAPE_CLASS_NAME);
        }

        // Add the attributes to the element.
        Object.entries(attributes).map(([key, val]) => {
            if (key == "href") {
                el.setAttributeNS("http://www.w3.org/1999/xlink", key, val);

            } else {
                el.setAttributeNS(null, key, val);
            }
        });

        //Object.entries(attributes).map(([key, val]) => {
        //    console.log("ATTR: " + key);
        //    el.setAttributeNS(null, key, val);
        //});

        return el;
    }

    // https://stackoverflow.com/questions/22183727/how-do-you-convert-screen-coordinates-to-document-space-in-a-scaled-svg
    static translateToSvgCoordinate(p) {
        var svg = document.getElementById(Constants.SVG_ELEMENT_ID);
        var pt = svg.createSVGPoint();
        var offset = pt.matrixTransform(svg.getScreenCTM().inverse());
        p = p.translate(offset.x, offset.y);

        return p;
    }

    static translateToScreenCoordinate(p) {
        var svg = document.getElementById(Constants.SVG_ELEMENT_ID);
        var pt = svg.createSVGPoint();
        var offset = pt.matrixTransform(svg.getScreenCTM());
        p = p.translate(-offset.x, -offset.y);

        return p;
    }

    static getNearbyShapes(p) {
        // https://stackoverflow.com/questions/2174640/hit-testing-svg-shapes
        // var el = document.elementFromPoint(evt.clientX, evt.clientY);
        // console.log(el);

        var svg = document.getElementById("svg");
        var hitRect = svg.createSVGRect();
        hitRect.x = p.x - Constants.NEARBY_DELTA / 2;
        hitRect.y = p.y - Constants.NEARBY_DELTA / 2;
        hitRect.height = Constants.NEARBY_DELTA;
        hitRect.width = Constants.NEARBY_DELTA;
        var nodeList = svg.getIntersectionList(hitRect, null);

        var nearShapes = [];

        for (var i = 0; i < nodeList.length; i++) {
            // get only nodes that are shapes.
            if (nodeList[i].getAttribute("class") == Constants.SHAPE_CLASS_NAME) {
                nearShapes.push(nodeList[i]);
            }
        }

        return nearShapes;
    }

    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    static removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    static isNear(p1, p2, delta) {
        return Math.abs(p1.x - p2.x) <= delta && Math.abs(p1.y - p2.y) <= delta;
    }
}
