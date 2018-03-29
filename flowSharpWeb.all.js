// "Extension methods" 

Array.prototype.any = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        if (predicate) {
            var any = predicate(this[i]);
            if (any) {
                return true;
            }
        }
    }

    return false;
}

/*

enumProto.any = function (predicate) {
            var any = false;
            this.forEach(function (elem, index) {
                if (predicate) {
                    any = predicate(elem, index);
                    return !any;
                }
                any = true;
                return false;
            });
            return any;
        };

*/
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
    static createElement(elementName, attributes) {
        var el = document.createElementNS(Constants.SVG_NS, elementName);

        // Create a unique ID for the element so we can acquire the correct shape controller
        // when the user drags the shape.
        el.setAttributeNS(null, "id", Helpers.uuidv4());

        // Create a class common to all shapes so that, on file load, we can get them all and re-attach them
        // to the mouse controller.
        el.setAttributeNS(null, "class", Constants.SHAPE_CLASS_NAME);

        // Add the attributes to the element.
        Object.entries(attributes).map(([key, val]) => el.setAttributeNS(null, key, val));

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
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.5
 * 2018-01-22 15:49:54
 *
 * By Eli Grey, https://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/src/FileSaver.js */

// export default var saveAs = saveAs || (function(view) {
var saveAs = saveAs || (function (view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this
));

class Model {
    constructor() {
        this.eventPropertyChanged = null;

        this._tx = 0;
        this._ty = 0;
    }

    get tx() { return this._tx; }
    get ty() { return this._ty; }

    propertyChanged(propertyName, value) {
        if (this.eventPropertyChanged != null) {
            this.eventPropertyChanged(propertyName, value);
        }
    }

    serialize() {
        return { tx: this._tx, ty: this._ty };
    }

    deserialize(model, el) {
        this._tx = model.tx;
        this._ty = model.ty;
        this.setTranslate(this._tx, this._ty);
    }

    translate(x, y) {
        this._tx += x;
        this._ty += y;
        this.setTranslate(this._tx, this._ty);
    }

    // Update our internal translation and set the translation immediately.
    setTranslation(x, y) {
        this._tx = x;
        this._ty = y;
        this.setTranslate(x, y);
    }

    // Deferred translation -- this only updates _tx and _ty
    // Used when we want to internally maintain the true _tx and _ty
    // but set the translation to a modulus, as in when translating
    // the grid.
    updateTranslation(dx, dy) {
        this._tx += dx;
        this._ty += dy;
    }

    // Sets the "translate" portion of the "transform" property.
    // All models have a translation.  Notice we do not use _tx, _ty here
    // nor do we set _tx, _ty to (x, y) because (x, y) might be mod'ed by
    // the grid (w, h).  We want to use exactly the parameters passed in
    // without modifying our model.
    // See SurfaceController.onDrag and note how the translation is updated
    // but setTranslate is called with the mod'ed (x, y) coordinates.
    setTranslate(x, y) {
        this.translation = "translate(" + x + "," + y + ")";
        this.transform = this.translation;
    }

    // TODO: Later to be extended to build the transform so that it includes rotation and other things we can do.
    set transform(value) {
        this._transform = value;
        this.propertyChanged("transform", value);
    }

    set tx(value) {
        this._tx = value;
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }

    set ty(value) {
        this._ty = value;
        this.translation = "translate(" + this._tx + "," + this._ty + ")";
        this.transform = this.translation;
    }
}

class DiagramModel {
    constructor(mouseController) {
        this.mouseController = mouseController;
        this.models = [];
        this.mvc = {
            Rectangle: { model: RectangleModel, view: ShapeView, controller: RectangleController, creator : () => this.createElement("rect") },
            Circle: { model: CircleModel, view: ShapeView, controller: CircleController, creator: () => this.createElement("circle") },
            Diamond: { model: DiamondModel, view: ShapeView, controller: DiamondController, creator: () => this.createElement("path") },
            Line: { model: LineModel, view: LineView, controller: LineController, creator: () => this.createLineElement() },
            Text: { model: TextModel, view: TextView, controller: TextController, creator: () => this.createTextElement() },
        };

        // For the moment we'll use array indices into the shape's connection points.
        // This is problematic when the feature is added so that the user can add/remove connection points.
        // In that case, each shape should create its default connection points with associated id's.
        // As for the line, it should be OK to always use the endpoint index.
        // Connection structure:
        // shapeId, lineId, shapeConnectionPointIndex, lineEndpointIndex
        this.connections = [];
    }

    clear() {
        this.models = [];
        this.connections = [];
    }

    addModel(model, id) {
        this.models.push({ model: model, id: id });
    }

    connect(shapeId, lineId, shapeCPIdx, lineAnchorIdx) {
        this.connections.push({ shapeId: shapeId, lineId: lineId, shapeCPIdx: shapeCPIdx, lineAnchorIdx: lineAnchorIdx });
    }

    // Disconnect any connections associated with the line and anchor index.
    disconnect(lineId, lineAnchorIdx) {
        this.connections = this.connections.filter(c => !(c.lineId == lineId && c.lineAnchorIdx == lineAnchorIdx));
    }

    // remove connections of this shape as both the "connected to" shape (shapeId) and the "connecting" shape (lineId).
    removeShape(shapeId) {
        this.connections = this.connections.filter(c => !(c.shapeId == shapeId || c.lineId == shapeId));
        this.models = this.models.filter(m => m.id != shapeId);
    }

    createElement(elName) {
        var el = Helpers.createElement(elName, { fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });

        return el;
    }

    createTextElement() {
        var el = Helpers.createElement('text', { "font-size": 12, "font-family": "Verdana" });

        return el;
    }

    createLineElement(elName) {
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', {"stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', {fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));

        return el;
    }

    // Returns JSON of serialized models.
    serialize() {
        var uberModel = [];
        var model = surfaceModel.serialize();
        model[Object.keys(model)[0]].id = Constants.SVG_SURFACE_ID;
        uberModel.push(model);

        this.models.map(m => {
            var model = m.model.serialize();
            model[Object.keys(model)[0]].id = m.id;
            uberModel.push(model);
        });

        return JSON.stringify({ model: uberModel, connections: this.connections });
    }

    // Creates an MVC for each model of the provided JSON.
    deserialize(jsonString) {
        var modelData = JSON.parse(jsonString);
        var models = modelData.model;
        this.connections = modelData.connections;
        var objectModels = [];
        surfaceModel.setTranslation(0, 0);
        objectsModel.setTranslation(0, 0);

        models.map(model => {
            var key = Object.keys(model)[0];
            var val = model[key];

            if (key == "Surface") {
                // Special handler for surface, we keep the existing MVC objects.
                // We set both the surface and objects translation, but the surface translation
                // is mod'd by the gridCellW/H.
                surfaceModel.deserialize(val);
                objectsModel.setTranslation(surfaceModel.tx, surfaceModel.ty);
            } else {
                var model = new this.mvc[key].model();
                objectModels.push(model);
                var el = this.mvc[key].creator();
                // Create the view first so it hooks into the model's property change event.
                var view = new this.mvc[key].view(el, model);
                model.deserialize(val, el);
                view.id = val.id;
                var controller = new this.mvc[key].controller(mouseController, view, model);

                // Update our diagram's model collection.
                this.models.push({ model: model, id: val.id });

                Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(el);
                this.mouseController.attach(view, controller);

                // Most shapes also need an anchor controller.  An exception is the Text shape, at least for now.
                if (controller.shouldShowAnchors) {
                    this.mouseController.attach(view, anchorGroupController);
                }
            }
        });
    }
}

class ObjectsModel extends Model {
    constructor() {
        super();
    }
}
class ShapeModel extends Model {
    constructor() {
        super();
    }
}
class SurfaceModel extends Model {
    constructor() {
        super();
        this.gridCellW = 80;
        this.gridCellH = 80;
        this.cellW = 8;
        this.cellH = 8;
    }

    serialize() {
        var model = super.serialize();
        model.gridCellW = this.gridCellW;
        model.gridCellH = this.gridCellH;
        model.cellW = this.cellW;
        model.cellH = this.cellH;

        return { Surface: model };
    }

    deserialize(model, el) {
        // DO NOT CALL BASE METHOD.  Surface translations are mod'd by the gridCellW/H
        this.gridCellW = model.gridCellW;
        this.gridCellH = model.gridCellH;
        this.cellW = model.cellW;
        this.cellH = model.cellH;
        this.resizeGrid(this.gridCellW, this.gridCellH, this.cellW, this.cellH);

        // 
        this._tx = model.tx;
        this._ty = model.ty;

        var dx = this.tx % this.gridCellW;
        var dy = this.ty % this.gridCellH;

        this.setTranslate(dx, dy);
    }

    // Programmatically change the grid spacing for the larger grid cells and smaller grid cells.
    // None of this is relevant to the SurfaceView so we just set the attributes directly.
    resizeGrid(lw, lh, sw, sh) {
        this.gridCellW = lw;
        this.gridCellH = lh;
        this.cellW = sw;
        this.cellH = sh;
        var elLargeGridRect = document.getElementById("largeGridRect");
        var elLargeGridPath = document.getElementById("largeGridPath");
        var elLargeGrid = document.getElementById("largeGrid");

        var elSmallGridPath = document.getElementById("smallGridPath");
        var elSmallGrid = document.getElementById("smallGrid");

        var elSvg = document.getElementById("svg");
        var elSurface = document.getElementById("surface");
        var elGrid = document.getElementById("grid");

        elLargeGridRect.setAttribute("width", lw);
        elLargeGridRect.setAttribute("height", lh);

        elLargeGridPath.setAttribute("d", "M " + lw + " 0 H 0 V " + lh);
        elLargeGrid.setAttribute("width", lw);
        elLargeGrid.setAttribute("height", lh);

        elSmallGridPath.setAttribute("d", "M " + sw + " 0 H 0 V " + sh);
        elSmallGrid.setAttribute("width", sw);
        elSmallGrid.setAttribute("height", sh);

        elGrid.setAttribute("x", -lw);
        elGrid.setAttribute("y", -lh);

        var svgW = +elSvg.getAttribute("width");
        var svgH = +elSvg.getAttribute("height");

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);

        elSurface.setAttribute("x", -lw);
        elSurface.setAttribute("y", -lh);

        elSurface.setAttribute("width", svgW + lw * 2);
        elSurface.setAttribute("height", svgH + lh * 2);
    }
}

class RectangleModel extends ShapeModel {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
    }

    serialize() {
        var model = super.serialize();
        model.x = this._x;
        model.y = this._y;
        model.width = this._width;
        model.height = this._height;

        return { Rectangle: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }

    set x(value) {
        this._x = value;
        this.propertyChanged("x", value);
    }

    set y(value) {
        this._y = value;
        this.propertyChanged("y", value);
    }

    set width(value) {
        this._width = value;
        this.propertyChanged("width", value);
    }

    set height(value) {
        this._height = value;
        this.propertyChanged("height", value);
    }
}
class CircleModel extends ShapeModel {
    constructor() {
        super();
        this._cx = 0;
        this._cy = 0;
        this._r = 0;
    }

    serialize() {
        var model = super.serialize();
        model.cx = this._cx;
        model.cy = this._cy;
        model.r = this._r;

        return { Circle: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.cx = model.cx;
        this.cy = model.cy;
        this.r = model.r;
    }

    get cx() { return this._cx; }
    get cy() { return this._cy; }
    get r() { return this._r; }

    set cx(value) {
        this._cx = value;
        this.propertyChanged("cx", value);
    }

    set cy(value) {
        this._cy = value;
        this.propertyChanged("cy", value);
    }

    set r(value) {
        this._r = value;
        this.propertyChanged("r", value);
    }
}
class PathModel extends ShapeModel {
    constructor() {
        super();
        this._d = null;
    }

    serialize() {
        var model = super.serialize();
        model.d = this._d;

        return model;
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.d = model.d;
    }

    get d() { return this._d; }

    set d(value) {
        this._d = value;
        this.propertyChanged("d", value);
    }
}


class DiamondModel extends PathModel {
    constructor() {
        super();
    }

    serialize() {
        var model = super.serialize();

        return { Diamond: model };
    }
}
class LineModel extends ShapeModel {
    constructor() {
        super();
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
    }

    serialize() {
        var model = super.serialize();
        model.x1 = this._x1;
        model.y1 = this._y1;
        model.x2 = this._x2;
        model.y2 = this._y2;

        return { Line: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.x1 = model.x1;
        this.y1 = model.y1;
        this.x2 = model.x2;
        this.y2 = model.y2;
    }

    get x1() { return this._x1; }
    get y1() { return this._y1; }
    get x2() { return this._x2; }
    get y2() { return this._y2; }

    set x1(value) {
        this._x1 = value;
        this.propertyChanged("x1", value);
    }

    set y1(value) {
        this._y1 = value;
        this.propertyChanged("y1", value);
    }

    set x2(value) {
        this._x2 = value;
        this.propertyChanged("x2", value);
    }

    set y2(value) {
        this._y2 = value;
        this.propertyChanged("y2", value);
    }
}
class TextModel extends ShapeModel {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._text = "";
    }

    serialize() {
        var model = super.serialize();
        model.x = this._x;
        model.y = this._y;
        model.text = this._text;

        return { Text: model };
    }

    deserialize(model, el) {
        super.deserialize(model, el);
        this.x = model.x;
        this.y = model.y;
        this.text = model.text;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get text() { return this._text; }

    set x(value) {
        this._x = value;
        this.propertyChanged("x", value);
    }

    set y(value) {
        this._y = value;
        this.propertyChanged("y", value);
    }

    set text(value) {
        this._text = value;
        this.propertyChanged("text", value);
    }
}
class View {
    constructor(svgElement, model) {
        this.svgElement = svgElement;
        model.eventPropertyChanged = this.onPropertyChange.bind(this);
    }

    get id() {
        return this.svgElement.getAttribute("id");
    }

    set id(val) {
        this.svgElement.setAttribute("id", val);
    }

    onPropertyChange(property, value) {
        // Every shape is grouped, so we want to update the property of the first child in the group.
        // firstElementChild ignores text and comment nodes.
        if (this.svgElement.firstElementChild == null) {
            this.svgElement.setAttribute(property, value);
        } else {
            this.svgElement.firstElementChild.setAttribute(property, value);
        }
    }
}

class AnchorView extends View {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // For anchors, we always move the group, not the child elements.
    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}
class ObjectsView extends View {
    constructor(svgObjects, shapesModel) {
        super(svgObjects, shapesModel);
    }
}
class ShapeView extends View {
    constructor(svgElement, model) {
        super(svgElement, model);
    }
}

class LineView extends ShapeView {
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    onPropertyChange(property, value) {
        // A line consists of a transparent portion [0] with a larger stroke width than the visible line [1]
        this.svgElement.children[0].setAttribute(property, value);
        this.svgElement.children[1].setAttribute(property, value);
    }
}

class TextView extends View{
    constructor(svgElement, model) {
        super(svgElement, model);
    }

    // Custom handling for property "text"
    onPropertyChange(property, value) {
        if (property == "text") {
            this.svgElement.innerHTML = value;
        } else {
            super.onPropertyChange(property, value);
        }
    }
}

class SurfaceView extends View {
    constructor(svgSurface, surfaceModel) {
        super(svgSurface, surfaceModel);
    }

    // For surface, we always move the group, not the child elements.
    onPropertyChange(property, value) {
        this.svgElement.setAttribute(property, value);
    }
}

class Controller {
    constructor(mouseController, view, model) {
        this.mouseController = mouseController;
        this.view = view;
        this.model = model;
        this.events = [];
        this.wireUpEvents();
    }

    get isSurfaceController() {
        return false;
    }

    get isAnchorController() {
        return false;
    }

    get isToolboxShapeController() {
        return false;
    }

    get shouldShowAnchors() {
        return true;
    }

    get hasConnectionPoints() {
        return true;
    }

    registerEvent(element, eventName, callbackRef) {
        this.events.push({ element: element, eventName: eventName, callbackRef: callbackRef });
    }

    destroy() {
        this.unhookEvents();
    }

    registerEventListener(element, eventName, callback, self) {
        var ref;

        if (self == null || self === undefined) {
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
        this.registerEventListener(this.view.svgElement, "mouseenter", this.mouseController.onMouseEnter, this.mouseController);
        this.registerEventListener(this.view.svgElement, "mouseleave", this.mouseController.onMouseLeave, this.mouseController);
    }

    getAbsoluteLocation(p) {
        p = p.translate(this.model.tx, this.model.ty);
        p = p.translate(surfaceModel.tx, surfaceModel.ty);

        return p;
    }

    getRelativeLocation(p) {
        p = p.translate(-this.model.tx, -this.model.ty);
        p = p.translate(-surfaceModel.tx, -surfaceModel.ty);

        return p;
    }

    // Routed from mouse controller:

    onMouseEnter() { }

    onMouseLeave() { }

    onMouseDown() { }

    onMouseUp() { }

    // Default behavior
    onDrag(dx, dy)
    {
        this.model.translate(dx, dy);
        this.adjustConnections(dx, dy);
    }

    // Adjust all connectors connecting to this shape.
    adjustConnections(dx, dy) {
        var connections = diagramModel.connections.filter(c => c.shapeId == this.view.id);
        connections.map(c => {
            // TODO: Sort of nasty assumption here that the first controller is the line controller
            var lineController = this.mouseController.getControllersById(c.lineId)[0];
            lineController.translateEndpoint(c.lineAnchorIdx, dx, dy);
        });
    }

    // Adjust the connectors connecting to this shape's connection point.
    adjustConnectorsAttachedToConnectionPoint(dx, dy, cpIdx) {
        var connections = diagramModel.connections.filter(c => c.shapeId == this.view.id && c.shapeCPIdx == cpIdx);
        connections.map(c => {
            // TODO: Sort of nasty assumption here that the first controller is the line controller
            var lineController = this.mouseController.getControllersById(c.lineId)[0];
            lineController.translateEndpoint(c.lineAnchorIdx, dx, dy);
        });
    }
}

class AnchorController extends Controller {
    constructor(mouseController, view, model, shapeController, fncDragAnchor, anchorIdx) {
        super(mouseController, view, model);
        this.fncDragAnchor = fncDragAnchor;
        this.anchorIdx = anchorIdx;

        // Structure:
        // { id: shapeId, controller: shapeController, connectionPoints: connectionPoints[] }
        this.shapeConnectionPoints = [];

        // Save the controller that is associated with the shape for which we're
        // displaying the anchors, so we can later on see if any of the controllers allows
        // the anchors to be attached to connection points.  Currently only the line
        // controller allows this.
        this.shapeController = shapeController;
    }

    get isAnchorController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // We don't show anchors for anchors.
    // This wouldn't happen anyways because no anchors are returned,
    // but having this flag is a minor performance improvement, maybe.
    get shouldShowAnchors() {
        return false;
    }

    onDrag(dx, dy) {
        // Call into the shape controller to handle
        // the specific anchor drag.
        this.fncDragAnchor(dx, dy);
        this.showAnyConnectionPoints();
    }

    onMouseUp(isClick) {
        super.onMouseUp(isClick);
        this.connectIfCloseToShapeConnectionPoint();
        this.removeConnectionPoints();
        this.shapeConnectionPoints = [];
    }

    showAnyConnectionPoints() {
        if (this.shapeController.canConnectToShapes) {
            var changes = this.getNewNearbyShapes(this.mouseController.x, this.mouseController.y);
            this.createConnectionPoints(changes.newShapes);

            // Other interesting approaches:
            // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
            // [...new Set(a)].filter(x => new Set(b).has(x));
            var currentShapesId = changes.newShapes.concat(changes.existingShapes).map(ns => ns.id);

            var noLongerNearShapes = this.shapeConnectionPoints.filter(s => currentShapesId.indexOf(s.id) < 0);
            this.removeExpiredShapeConnectionPoints(noLongerNearShapes);

            // Remove any shapes from the shapeConnectionPoints that do not exist anymore.
            var existingShapesId = changes.existingShapes.map(ns => ns.id);
            this.shapeConnectionPoints = this.shapeConnectionPoints.filter(s => existingShapesId.indexOf(s.id) >= 0);

            // Add in the new shapes.
            this.shapeConnectionPoints = this.shapeConnectionPoints.concat(changes.newShapes);

            console.log("scp: " + this.shapeConnectionPoints.length + ", new: " + changes.newShapes.length + ", existing: " + existingShapesId.length);
        }
    }

    getNewNearbyShapes(x, y) {
        var newShapes = [];
        var existingShapes = [];
        var p = new Point(x, y);
        p = Helpers.translateToScreenCoordinate(p);
        var nearbyShapeEls = Helpers.getNearbyShapes(p); // .filter(s => s.outerHTML.split(" ")[0].substring(1) != "line");
        // logging:
        // nearbyShapesEls.map(s => console.log(s.outerHTML.split(" ")[0].substring(1)));

        nearbyShapeEls.map(el => {
            var controllers = this.mouseController.getControllersByElement(el);

            if (controllers) {
                controllers.map(ctrl => {
                    if (ctrl.hasConnectionPoints) {
                        var shapeId = ctrl.view.id;

                        // If it already exists in the list, don't add it again.
                        if (!this.shapeConnectionPoints.any(cp => cp.id == shapeId)) {
                            var connectionPoints = ctrl.getConnectionPoints();
                            newShapes.push({ id: shapeId, controller: ctrl, connectionPoints: connectionPoints });
                        } else {
                            existingShapes.push({ id: shapeId });
                        }
                    }
                });
            }
        });

        return { newShapes : newShapes, existingShapes: existingShapes };
    }

    // "shapes" is a {id, controller, connectionPoints} structure
    createConnectionPoints(shapes) {
        var cpGroup = Helpers.getElement(Constants.SVG_CONNECTION_POINTS_ID);

        shapes.map(shape => {
            shape.connectionPoints.map(cpStruct => {
                var cp = cpStruct.connectionPoint;
                var el = Helpers.createElement("g", { connectingToShapeId: shape.id });
                el.appendChild(Helpers.createElement("line", { x1: cp.x - 5, y1: cp.y - 5, x2: cp.x + 5, y2: cp.y + 5, fill: "#FFFFFF", stroke: "#000080", "stroke-width": 1 }));
                el.appendChild(Helpers.createElement("line", { x1: cp.x + 5, y1: cp.y - 5, x2: cp.x - 5, y2: cp.y + 5, fill: "#FFFFFF", stroke: "#000080", "stroke-width": 1 }));
                cpGroup.appendChild(el);
            });
        });
    }

    removeConnectionPoints() {
        var cpGroup = Helpers.getElement(Constants.SVG_CONNECTION_POINTS_ID);
        Helpers.removeChildren(cpGroup);
    }

    // "shapes" is a {id, controller, connectionPoints} structure
    removeExpiredShapeConnectionPoints(shapes) {
        shapes.map(shape => {
            // https://stackoverflow.com/a/16775485/2276361
            var nodes = document.querySelectorAll('[connectingtoshapeid="' + shape.id + '"]');
            // or: Array.from(nodes); https://stackoverflow.com/a/36249012/2276361
            // https://stackoverflow.com/a/33822526/2276361
            [...nodes].map(node => { node.parentNode.removeChild(node) });
        });
    }

    connectIfCloseToShapeConnectionPoint() {
        var p = new Point(this.mouseController.x, this.mouseController.y);
        p = Helpers.translateToScreenCoordinate(p);

        var nearbyConnectionPoints = [];
        
        this.shapeConnectionPoints.filter(scp => {
            for (var i = 0; i < scp.connectionPoints.length; i++) {
                var cpStruct = scp.connectionPoints[i];
                if (Helpers.isNear(cpStruct.connectionPoint, p, Constants.MAX_CP_NEAR)) {
                    nearbyConnectionPoints.push({ shapeController: scp.controller, shapeCPIdx : i, connectionPoint : cpStruct.connectionPoint});
                }
            }
        });

        if (nearbyConnectionPoints.length == 1) {
            var ncp = nearbyConnectionPoints[0];

            // The location of the connection point of the shape to which we're connecting.
            var p = ncp.connectionPoint;
            // Physical location of endpoint is without line and surface translations.
            p = p.translate(-this.shapeController.model.tx, -this.shapeController.model.ty);
            p = p.translate(-surfaceModel.tx, - surfaceModel.ty);
            // Move the endpoint of the shape from which we're connecting (the line) to this point.
            this.shapeController.connect(this.anchorIdx, p);
            diagramModel.connect(ncp.shapeController.view.id, this.shapeController.view.id, ncp.shapeCPIdx, this.anchorIdx);
        }
    }
}
class AnchorGroupController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
        this.anchors = [];
        this.showingAnchors = false;
    }

    get hasConnectionPoints() {
        return false;
    }

    // Override, as we don't have events on the anchor group.
    wireUpEvents() { }

    // We need to set up a partial call so that we can include the anchor being dragged when we call
    // the drag method for moving the shape's anchor.  At that point we also pass in the event data.
    partialOnDrag(anchors, anchorElement, onDrag) {
        return (function (anchors, anchorElement, onDrag) {
            return function (dx, dy) { onDrag(anchors, anchorElement, dx, dy); }
        })(anchors, anchorElement, onDrag);
    }

    showAnchors(shapeController) {
        this.anchors = shapeController.getAnchors();
        this.anchors.views = [];     // add view to the dictionary.
        this.showingAnchors = true;
        var anchorGroup = Helpers.getElement(Constants.SVG_ANCHORS_ID);
        // Reset any translation because the next mouse hover will set the anchors directly over the shape.
        this.model._tx = 0;
        this.model._ty = 0;
        this.model.setTranslate(0, 0);
        // We pass in the shape (which is also the surface) mouse controller so we can
        // handle when the shape or surface gets the mousemove event, which happens if
        // the user moves the mouse too quickly and the pointer leaves the anchor rectangle.

        // this.anchorController = new AnchorController(this);
        var anchorElements = [];
        var anchorModels = [];

        this.anchors.map(anchorDefinition => {
            var anchor = anchorDefinition.anchor;

            var model = new RectangleModel();
            model._x = anchor.x - 5;
            model._y = anchor.y - 5;
            model._width = 10;
            model._height = 10;
            // TODO: Set other properties (fill, stroke, stroke-width, etc)

            var el = this.createElement("rect", { x: model.x, y: model.y, width: model.width, height: model.height, fill: "#FFFFFF", stroke: "#808080", "stroke-width": 0.5 });

            anchorElements.push(el);
            anchorModels.push(model);
            anchorGroup.appendChild(el);
        });

        // Separate iterator so we can pass in all the anchor elements to the onDrag callback once they've been accumulated.
        for (var i = 0; i < this.anchors.length; i++) {
            var anchorDefinition = this.anchors[i];
            // Create anchor shape, associate it with a generic model, view, and the supplied shapeController.
            // Wire up anchor onDrag event and attach the view-controller to the mouse controller's list of shapes.
            // Note that this will now result in the shape receiving onenter/onleave events for the shape itself when the
            // user mouses over the anchor shape!  The mouse controller handles this.
            var el = anchorElements[i];

            // Helpful for debugging
            el.setAttribute("id", "anchor" + i);

            var anchorView = new View(el, anchorModels[i]);
            var fncDragAnchor = this.partialOnDrag(anchorModels, anchorModels[i], anchorDefinition.onDrag);
            var anchorController = new AnchorController(this.mouseController, anchorView, anchorModels[i], shapeController, fncDragAnchor, i);
            this.mouseController.attach(anchorView, anchorController);
            this.anchors.views.push(anchorView);     // Save the view for when we need to destroy the individual anchors.
        }
    }

    // TODO: Very similar to SvgToolboxElement.createElement.  Refactor for common helper class?
    createElement(name, attributes) {
        var svgns = "http://www.w3.org/2000/svg";
        var el = document.createElementNS(svgns, name);
        el.setAttribute("id", Helpers.uuidv4());
        Object.entries(attributes).map(([key, val]) => el.setAttribute(key, val));

        return el;
    }

    removeAnchors() {
        var anchorGroup = Helpers.getElement(Constants.SVG_ANCHORS_ID);

        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        // Will change later.
        anchorGroup.innerHTML = "";
        this.anchors.views.map(view => this.mouseController.destroy(view));
        this.anchors = [];
        this.showingAnchors = false;
        // this.anchorController.destroyAll();
        // Alternatively:
        //while (anchorGroup.firstChild) {
        //    anchorGroup.removeChild(anchorGroup.firstChild);
        //}
    }
}


const LEFT_MOUSE_BUTTON = 0;
const TOOLBOX_DRAG_MIN_MOVE = 3;

class MouseController {
    constructor() {
        this.mouseDown = false;
        this.controllers = {};
        this.activeControllers = null;
        this.currentHoverControllers = [];
        this.leavingId = -1;
        this.draggingToolboxShape = false;
        this.selectedControllers = null;
        this.selectedShapeId = null;
        this.hoverShapeId = null;

        // We really can't use movementX and movementY of the event because
        // when the user moves the mouse quickly, the move events switch from
        // the shape to the surface (or another shape) and this causes deviances
        // in the movementX and movementY so that the shape is no longer positioned
        // at the same location as when clicked down.
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
    }

    // Attach as many controllers as you want to the view.
    attach(view, controller) {
        var id = view.id;

        if (this.controllers[id] == undefined) {
            this.controllers[id] = [];
        }

        this.controllers[id].push(controller);
    }

    // Compare functions detach with destroyAll.
    // We should probably implement a "destroy" method as well.

    // Detach all controllers associated with this view.
    detach(view) {
        var id = view.id;
        delete this.controllers[id];
    }

    detachAll() {
        this.controllers = {};
    }

    destroy(view) {
        var id = view.id;
        this.controllers[id].map(controller=>controller.destroy());
        delete this.controllers[id];
    }

    destroyShapeById(id) {
        this.controllers[id].map(controller => controller.destroy());
        delete this.controllers[id];
    }

    // Detaches all controllers and unwires events associated with the controller.
    destroyAll() {
        Object.entries(this.controllers).map(([key, val]) => val.map(v => v.destroy()));
        this.controllers = {};
    }

    destroyAllButSurface() {
        Object.entries(this.controllers).map(([key, val]) => {
            val.map(v => {
                // Don't remove surface, toolbox, objects group, or toolbox shapes.
                if (!v.isSurfaceController && !v.isToolboxShapeController) {
                    v.destroy();
                    // Hopefully deleting the dictionary entry while iterating won't be
                    // a disaster since we called Object.entries!
                    delete this.controllers[key];
                }
            });
        });
    }

    get isClick() {
        var endDownX = this.x;
        var endDownY = this.y;

        var isClick = Math.abs(this.startDownX - endDownX) < TOOLBOX_DRAG_MIN_MOVE &&
            Math.abs(this.startDownY - endDownY) < TOOLBOX_DRAG_MIN_MOVE;

        return isClick;
    }

    onKeyDown(evt) {
        var isOverShape = this.hoverShapeId != null;
        var handled = false;

        if (isOverShape) {
            switch (evt.keyCode) {
                case Constants.KEY_RIGHT:
                    this.currentHoverControllers.map(c => c.onDrag(1, 0));
                    handled = true;
                    break;
                case Constants.KEY_UP:
                    this.currentHoverControllers.map(c => c.onDrag(0, -1));
                    handled = true;
                    break;
                case Constants.KEY_LEFT:
                    this.currentHoverControllers.map(c => c.onDrag(-1, 0));
                    handled = true;
                    break;
                case Constants.KEY_DOWN:
                    this.currentHoverControllers.map(c => c.onDrag(0, 1));
                    handled = true;
                    break;
                case Constants.KEY_DELETE:
                    // Mouse is "leaving" this control, this removes any anchors.
                    this.currentHoverControllers.map(c => c.onMouseLeave());
                    // Remove shape from diagram model, and all connections of this shape.
                    diagramModel.removeShape(this.hoverShapeId);
                    // Remove shape from mouse controller and detach events.
                    this.destroyShapeById(this.hoverShapeId);
                    // Remove from "objects" collection.
                    var el = Helpers.getElement(this.hoverShapeId);
                    el.parentNode.removeChild(el);
                    // Cleanup.
                    this.currentHoverControllers = [];
                    this.hoverShapeId = null;
                    handled = true;
                    break;
            }
        }

        return isOverShape && handled;
    }

    // Get the controller associated with the event and remember where the user clicked.
    onMouseDown(evt) {
        if (evt.button == LEFT_MOUSE_BUTTON) {
            evt.preventDefault();
            var id = evt.currentTarget.getAttribute("id");
            this.selectedShapeId = id;
            this.activeControllers = this.controllers[id];
            this.selectedControllers = this.controllers[id];
            this.mouseDown = true;
            this.startDownX = evt.clientX;
            this.startDownY = evt.clientY;
            this.x = evt.clientX;
            this.y = evt.clientY;
            this.activeControllers.map(c => c.onMouseDown());
        }
    }

    // If the user is dragging, call the controller's onDrag function.
    onMouseMove(evt) {
        evt.preventDefault();
        if (this.mouseDown && this.activeControllers != null) {
            this.dx = evt.clientX - this.x;
            this.dy = evt.clientY - this.y;
            this.x = evt.clientX;
            this.y = evt.clientY;
            this.activeControllers.map(c => c.onDrag(this.dx, this.dy));
        }
    }

    onMouseUp(evt) {
        evt.preventDefault();
        if (evt.button == LEFT_MOUSE_BUTTON && this.activeControllers != null) {
            this.selectedShapeId = null;
            this.x = evt.clientX;
            this.y = evt.clientY;
            var isClick = this.isClick;

            this.activeControllers.map(c => c.onMouseUp(isClick));
            this.clearSelectedObject();

            // Do this after the mouseDown flag is reset, otherwise anchors won't appear.
            if (this.draggingToolboxShape) {
                // shapeBeingDraggedAndDropped is set by the ToolboxShapeController.
                // We preserve this shape in case the user releases the mouse button
                // while the mouse is over a different shape (like the surface) as
                // as result of a very fast drag & drop where the shape hasn't caught
                // up with the mouse, or the mouse is outside of shape's boundaries.
                this.finishDragAndDrop(this.shapeBeingDraggedAndDropped, evt.currentTarget);
            }
        }
    }

    onMouseEnter(evt) {
        evt.preventDefault();
        var id = evt.currentTarget.getAttribute("id");
        this.hoverShapeId = id;

        if (this.mouseDown) {
            // Doing a drag operation, so ignore shapes we enter and leave so
            // that even if the mouse moves over another shape, we keep track
            // of the shape we're dragging.
        } else {
            // Hover management.
            if (this.leavingId != -1) {
                console.log("Leaving " + this.leavingId);

                // If we're entering an anchor, don't leave anything as we want to preserve the anchors.
                if (!this.controllers[id][0].isAnchorController) {
                    this.currentHoverControllers.map(c => c.onMouseLeave());
                    console.log("Entering " + id + " => " + this.controllers[id].map(ctrl=>ctrl.constructor.name).join(", "));
                    // Tell the new shape that we're entering.
                    this.currentHoverControllers = this.controllers[id];
                    this.currentHoverControllers.map(c => c.onMouseEnter());
                } else {
                    console.log("Leaving shape to enter anchor.");
                }
            }
        }
    }

    onMouseLeave(evt) {
        evt.preventDefault();
        this.leavingId = evt.currentTarget.getAttribute("id");
        this.hoverShapeId = null;
    }

    // Returns the controllers associated with the SVG element.
    getControllers(evt) {
        var id = evt.currentTarget.getAttribute("id");
        var controllers = this.controllers[id];

        return controllers;
    }

    getControllersById(id) {
        var controllers = this.controllers[id];

        return controllers;
    }

    getControllersByElement(el) {
        var id = el.getAttribute("id");

        return this.getControllersById(id);
    }

    clearSelectedObject() {
        this.mouseDown = false;
        this.activeControllers = null;
    }

    // Move the shape out of the toolbox group and into the objects group.
    // This requires dealing with surface translation.
    // Show the anchors, because the mouse is currently over the shape since it
    // is being drageed & dropped.
    finishDragAndDrop(elDropped, elCurrent) {
        // Remove from toolbox group, translate, add to objects group.
        Helpers.getElement(Constants.SVG_TOOLBOX_ID).removeChild(elDropped);
        var id = elDropped.getAttribute("id");
        this.controllers[id].map(c => c.model.translate(-surfaceModel.tx + toolboxGroupController.model.tx, -surfaceModel.ty + toolboxGroupController.model.ty));
        Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(elDropped);

        // Only show anchors if mouse is actually on the dropped shape.
        if (id == elCurrent.getAttribute("id")) {
            this.currentHoverControllers = this.controllers[id];
            this.currentHoverControllers.map(c => c.onMouseEnter());
        }

        this.draggingToolboxShape = false;
    }
}


// The shape controller handles showing the anchors and other decorations.
class ShapeController extends Controller {
    constructor(mouseController, shapeView, shapeModel) {
        super(mouseController, shapeView, shapeModel);
    }

    // Not all shapes have anchors.
    getAnchors() {
        return [];
    }

    // Not all shapes have connection points.
    getConnectionPoints() {
        return [];
    }

    getCorners() {
        return [this.getULCorner(), this.getLRCorner()];
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);
    }

    // Overrridden by the line controller.
    get canConnectToShapes() {
        return false;
    }

    connect(idx, p) {
        throw "Shape appears to be capable of connecting to other shapes but doesn't implement connect(idx, p).";
    }

    onMouseEnter() {
        if (!this.mouseController.mouseDown && this.shouldShowAnchors) {
            anchorGroupController.showAnchors(this);
        }
    }

    // If we're showing the anchors, moving the mouse on top of an anchor will cause the current shape to leave, which
    // will erase the anchors!  We handle this situation in the mouse controller.
    onMouseLeave() {
        if (this.shouldShowAnchors) {
            anchorGroupController.removeAnchors();
        }
    }

    moveAnchor(anchor, dx, dy) {
        anchor.translate(dx, dy);
    }

    adjustAnchorX(anchor, dx) {
        anchor.translate(dx, 0);
    }

    adjustAnchorY(anchor, dy) {
        anchor.translate(0, dy);
    }
}
class ToolboxShapeController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isToolboxShapeController() {
        return true;
    }

    // Check if click.  If so, create element on the surface.
    onMouseUp(isClick) {
        if (isClick) {
            console.log("toolbox shape click");
            var emvc = this.createElementAt(270, 130);
            diagramModel.addModel(emvc.model, emvc.view.id);
            // Account for surface translation (scrolling) so that shape is always placed in a fixed position.
            emvc.model.translate(-surfaceModel.tx, -surfaceModel.ty);
            this.addToObjectsGroup(emvc);
            this.attachToMouseController(emvc);
        }
    }

    // Dragging a toolbox shape has a custom implementation.
    onDrag(dx, dy) {
        // The user must move the mouse a wee bit.
        if (!this.mouseController.isClick) {
            console.log("toolbox shape onDrag");
            // TODO: Figure out where we place the element so the shape is created centered over the mouse!
            // Account for the translation of the toolbox group.
            var emvc = this.createElementAt(this.mouseController.x - toolboxGroupController.model.tx, this.mouseController.y - toolboxGroupController.model.ty);
            diagramModel.addModel(emvc.model, emvc.view.id);
            // Add the shape to the toolbox group for now so it is topmost, rather than adding
            // it to the objects group.
            this.addToToolboxGroup(emvc);
            var controllers = this.attachToMouseController(emvc);
            // Hoist these controllers onto the mouse active controllers so it switches over to moving this shape.
            this.mouseController.activeControllers = controllers;
            // Indiicate to the mouse controller that we're dragging a toolbox shape so that when it is dropped
            // on the service, special things can happen - the shape is moved into the objects group and the
            // anchors are shown.
            this.mouseController.draggingToolboxShape = true;
            this.mouseController.shapeBeingDraggedAndDropped = emvc.el;
        }
    }

    // Simply so that this method can be overridden.
    addToObjectsGroup(emvc) {
        Helpers.getElement(Constants.SVG_OBJECTS_ID).appendChild(emvc.el);
    }

    addToToolboxGroup(emvc) {
        Helpers.getElement(Constants.SVG_TOOLBOX_ID).appendChild(emvc.el);
    }

    attachToMouseController(emvc) {
        this.mouseController.attach(emvc.view, emvc.controller);
        // Most shapes also need an anchor controller.  An exception is the Text shape, at least for now.
        this.mouseController.attach(emvc.view, anchorGroupController);

        return [emvc.controller, anchorGroupController];
    }
}

class SurfaceController extends Controller {
    constructor(mouseController, surfaceView, surfaceModel) {
        super(mouseController, surfaceView, surfaceModel);
    }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // overrides Controller.onDrag
    onDrag(dx, dy) {
        this.model.updateTranslation(dx, dy);
        var dx = this.model.tx % this.model.gridCellW;
        var dy = this.model.ty % this.model.gridCellH;
        this.model.setTranslate(dx, dy);
    }

    onMouseLeave() {
        this.mouseController.clearSelectedObject();
    }
}

class ObjectsController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    // We do not want to attach mouse events to the view of the "objects" SVG element!
    wireUpEvents() { }
}
class ToolboxGroupController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    wireUpEvents() { }
}
class ToolboxSurfaceController extends Controller {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get isSurfaceController() {
        return true;
    }

    get hasConnectionPoints() {
        return false;
    }

    onDrag(dx, dy) {
        toolboxGroupController.onDrag(dx, dy);
    }
}

class RectangleController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);
        //var upperRight = new Point(corners[1].X, corners[0].Y);
        //var lowerLeft = new Point(corners[0].X, corners[1].Y);

        // maybe later:
        // var anchors = [corners[0], corners[1], middleTop, middleBottom, middleLeft, middleRight, upperRight, lowerLeft];
        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);
        //var upperRight = new Point(corners[1].X, corners[0].Y);
        //var lowerLeft = new Point(corners[0].X, corners[1].Y);

        // maybe later:
        // var anchors = [corners[0], corners[1], middleTop, middleBottom, middleLeft, middleRight, upperRight, lowerLeft];
        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    getULCorner() {
        var p = new Point(this.model.x, this.model.y);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.x + this.model.width, this.model.y + this.model.height);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    topMove(anchors, anchor, dx, dy) {
        // Moving the top affects "y" and "height"
        var y = this.model.y + dy;
        var height = this.model.height - dy;
        this.model.y = y;
        this.model.height = height;
        this.moveAnchor(anchors[0], 0, dy);
        this.adjustAnchorY(anchors[2], dy / 2);
        this.adjustAnchorY(anchors[3], dy / 2);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy / 2, 2);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy / 2, 3);
    }

    bottomMove(anchors, anchor, dx, dy) {
        // Moving the bottom affects only "height"
        var height = this.model.height + dy;
        this.model.height = height;
        this.moveAnchor(anchors[1], 0, dy);
        this.adjustAnchorY(anchors[2], dy / 2);
        this.adjustAnchorY(anchors[3], dy / 2);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 1);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy / 2, 2);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy / 2, 3);
    }

    leftMove(anchors, anchor, dx, dy) {
        // Moving the left affects "x" and "width"
        var x = this.model.x + dx;
        var width = this.model.width - dx;
        this.model.x = x;
        this.model.width = width;
        this.moveAnchor(anchors[2], dx, 0);
        this.adjustAnchorX(anchors[0], dx / 2);
        this.adjustAnchorX(anchors[1], dx / 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx / 2, 0, 0);
        this.adjustConnectorsAttachedToConnectionPoint(dx / 2, 0, 1);
    }

    rightMove(anchors, anchor, dx, dy) {
        // Moving the right affects only "width"
        var width = this.model.width + dx;
        this.model.width = width;
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustAnchorX(anchors[0], dx / 2);
        this.adjustAnchorX(anchors[1], dx / 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 3);
        this.adjustConnectorsAttachedToConnectionPoint(dx / 2, 0, 0);
        this.adjustConnectorsAttachedToConnectionPoint(dx / 2, 0, 1);
    }
}

class CircleController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    getULCorner() {
        var p = new Point(this.model.cx - this.model.r, this.model.cy - this.model.r);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.cx + this.model.r, this.model.cy + this.model.r);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    topMove(anchors, anchor, dx, dy) {
        this.changeRadius(-dy);
        this.moveAnchor(anchors[0], 0, dy);
        this.moveAnchor(anchors[1], 0, -dy);
        this.moveAnchor(anchors[2], dy, 0);
        this.moveAnchor(anchors[3], -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 1);
        this.adjustConnectorsAttachedToConnectionPoint(dy, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dy, 0, 3);
    }

    bottomMove(anchors, anchor, dx, dy) {
        this.changeRadius(dy);
        this.moveAnchor(anchors[0], 0, -dy);
        this.moveAnchor(anchors[1], 0, dy);
        this.moveAnchor(anchors[2], -dy, 0);
        this.moveAnchor(anchors[3], dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 1);
        this.adjustConnectorsAttachedToConnectionPoint(-dy, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dy, 0, 3);
    }

    leftMove(anchors, anchor, dx, dy) {
        this.changeRadius(-dx);
        this.moveAnchor(anchors[0], 0, dx);
        this.moveAnchor(anchors[1], 0, -dx);
        this.moveAnchor(anchors[2], dx, 0);
        this.moveAnchor(anchors[3], -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dx, 1);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 3);
    }

    rightMove(anchors, anchor, dx, dy) {
        this.changeRadius(dx);
        this.moveAnchor(anchors[0], 0, -dx);
        this.moveAnchor(anchors[1], 0, dx);
        this.moveAnchor(anchors[2], -dx, 0);
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dx, 1);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 3);
    }

    changeRadius(amt) {
        this.model.r = this.model.r + amt;
    }
}

class DiamondController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    getAnchors() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var anchors = [
            { anchor: middleTop, onDrag: this.topMove.bind(this) },
            { anchor: middleBottom, onDrag: this.bottomMove.bind(this) },
            { anchor: middleLeft, onDrag: this.leftMove.bind(this) },
            { anchor: middleRight, onDrag: this.rightMove.bind(this) }
        ];

        return anchors;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    getULCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.left, rect.top);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    getLRCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.right, rect.bottom);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    topMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, -dy);
        this.moveAnchor(anchors[0], 0, dy);          // top
        this.moveAnchor(anchors[1], 0, -dy);         // bottom
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 1);
    }

    bottomMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeHeight(ulCorner, lrCorner, dy);
        this.moveAnchor(anchors[0], 0, -dy);
        this.moveAnchor(anchors[1], 0, dy);
        this.adjustConnectorsAttachedToConnectionPoint(0, -dy, 0);
        this.adjustConnectorsAttachedToConnectionPoint(0, dy, 1);
    }

    leftMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, -dx);
        this.moveAnchor(anchors[2], dx, 0);
        this.moveAnchor(anchors[3], -dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 3);
    }

    rightMove(anchors, anchor, dx, dy) {
        var ulCorner = this.getULCorner();
        var lrCorner = this.getLRCorner();
        this.changeWidth(ulCorner, lrCorner, dx);
        this.moveAnchor(anchors[2], -dx, 0);
        this.moveAnchor(anchors[3], dx, 0);
        this.adjustConnectorsAttachedToConnectionPoint(-dx, 0, 2);
        this.adjustConnectorsAttachedToConnectionPoint(dx, 0, 3);
    }

    changeWidth(ulCorner, lrCorner, dx) {
        ulCorner.x -= dx;
        lrCorner.x += dx;
        this.updatePath(ulCorner, lrCorner);
    }

    changeHeight(ulCorner, lrCorner, dy) {
        ulCorner.y -= dy;
        lrCorner.y += dy;
        this.updatePath(ulCorner, lrCorner);
    }

    updatePath(ulCorner, lrCorner) {
        // example path: d: "M 240 100 L 210 130 L 240 160 L 270 130 Z"
        var ulCorner = this.getRelativeLocation(ulCorner);
        var lrCorner = this.getRelativeLocation(lrCorner);
        var mx = (ulCorner.x + lrCorner.x) / 2;
        var my = (ulCorner.y + lrCorner.y) / 2;
        var path = "M " + mx + " " + ulCorner.y;
        path = path + " L " + ulCorner.x + " " + my;
        path = path + " L " + mx + " " + lrCorner.y;
        path = path + " L " + lrCorner.x + " " + my;
        path = path + " Z"
        this.model.d = path;
    }
}

class LineController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get canConnectToShapes() {
        return true;
    }

    onDrag(dx, dy) {
        super.onDrag(dx, dy);
        // When the entire line is being dragged, we disconnect any connections.
        diagramModel.disconnect(this.view.id, 0);
        diagramModel.disconnect(this.view.id, 1);
    }

    // Move the specified endpoint (by idx) to the point p.
    connect(idx, p) {
        switch (idx) {
            case 0:
                this.model.x1 = p.x;
                this.model.y1 = p.y;
                break;
            case 1:
                this.model.x2 = p.x;
                this.model.y2 = p.y;
                break;
        }
    }

    translateEndpoint(idx, dx, dy) {
        switch (idx) {
            case 0:
                var p = new Point(this.model.x1, this.model.y1);
                p = p.translate(dx, dy);
                this.model.x1 = p.x;
                this.model.y1 = p.y;
                break;
            case 1:
                var p = new Point(this.model.x2, this.model.y2);
                p = p.translate(dx, dy);
                this.model.x2 = p.x;
                this.model.y2 = p.y;
                break;
        }
    }

    getAnchors() {
        var corners = this.getCorners();        
        var anchors = [
            { anchor: corners[0], onDrag: this.moveULCorner.bind(this) },
            { anchor: corners[1], onDrag: this.moveLRCorner.bind(this) }];

        return anchors;
    }

    getULCorner() {
        var p = new Point(this.model.x1, this.model.y1);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    getLRCorner() {
        var p = new Point(this.model.x2, this.model.y2);
        p = this.getAbsoluteLocation(p);

        return p;
    }

    // Move the (x1, y1) coordinate.
    moveULCorner(anchors, anchor, dx, dy) {
        this.model.x1 = this.model.x1 + dx;
        this.model.y1 = this.model.y1 + dy;
        this.moveAnchor(anchor, dx, dy);
        diagramModel.disconnect(this.view.id, 0);
    }

    // Move the (x2, y2) coordinate.
    moveLRCorner(anchors, anchor, dx, dy) {
        this.model.x2 = this.model.x2 + dx;
        this.model.y2 = this.model.y2 + dy;
        this.moveAnchor(anchor, dx, dy);
        diagramModel.disconnect(this.view.id, 1);
    }
}

class TextController extends ShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    get shouldShowAnchors() {
        return false;
    }

    getConnectionPoints() {
        var corners = this.getCorners();
        var middleTop = new Point((corners[0].x + corners[1].x) / 2, corners[0].y);
        var middleBottom = new Point((corners[0].x + corners[1].x) / 2, corners[1].y);
        var middleLeft = new Point(corners[0].x, (corners[0].y + corners[1].y) / 2);
        var middleRight = new Point(corners[1].x, (corners[0].y + corners[1].y) / 2);

        var connectionPoints = [
            { connectionPoint: middleTop },
            { connectionPoint: middleBottom },
            { connectionPoint: middleLeft },
            { connectionPoint: middleRight }
        ];

        return connectionPoints;
    }

    // Update the UI with the text associated with the shape.
    onMouseDown(evt) {
        super.onMouseDown(evt);
        var text = this.model.text;
        document.getElementById("text").value = text;
    }

    getULCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.left, rect.top);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }

    getLRCorner() {
        var rect = this.view.svgElement.getBoundingClientRect();
        var p = new Point(rect.right, rect.bottom);
        p = Helpers.translateToSvgCoordinate(p);

        return p;
    }
}
class ToolboxRectangleController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var group = Helpers.createElement("g", {});
        var el = Helpers.createElement('rect', { x: x - 30, y: y - 30, width: 60, height: 60, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        group.appendChild(el);
        var model = new RectangleModel();
        model._x = x - 30;
        model._y = y - 30;
        model._width = 60;
        model._height = 60;
        var view = new ShapeView(group, model);
        var controller = new RectangleController(this.mouseController, view, model);

        return { el: group, model: model, view: view, controller: controller };
    }
}

class ToolboxCircleController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        // var el = super.createElement('circle', { cx: x, cy: y, r: 30, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });
        var el = Helpers.createElement('circle', { cx: x, cy: y, r:30, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 });
        var model = new CircleModel();
        model._cx = x;
        model._cy = y;
        model._r = 30;
        var view = new ShapeView(el, model);
        var controller = new CircleController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}

class ToolboxDiamondController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // For drag and drop
    createElementAt(x, y) {
        var points = [{ cmd: "M", x: x - 15, y: y - 30 }, { cmd: "L", x: x - 45, y: y }, { cmd: "L", x: x - 15, y: y + 30 }, { cmd: "L", x: x + 15, y: y }];
        var path = points.reduce((acc, val) => acc = acc + val.cmd + " " + val.x + " " + val.y, "");
        path = path + " Z";
        var el = Helpers.createElement('path', { d: path, stroke: "black", "stroke-width": 1, fill: "#FFFFFF" });

        var model = new DiamondModel();
        model._d = path;
        var view = new ShapeView(el, model);
        var controller = new DiamondController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}

class ToolboxLineController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    // For drag and drop
    createElementAt(x, y) {
        var x1 = x - 30;
        var y1 = y - 30;
        var x2 = x + 30;
        var y2 = y + 30;
        var el = Helpers.createElement('g', {});
        el.appendChild(Helpers.createElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, "stroke-width": 20, stroke: "black", "stroke-opacity": "0", "fill-opacity": "0" }));
        el.appendChild(Helpers.createElement('line', { x1: x1, y1: y1, x2: x2, y2: y2, fill: "#FFFFFF", stroke: "black", "stroke-width": 1 }));

        var model = new LineModel();
        model._x1 = x1;
        model._y1 = y1;
        model._x2 = x2;
        model._y2 = y2;
        var view = new LineView(el, model);
        var controller = new LineController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}

class ToolboxTextController extends ToolboxShapeController {
    constructor(mouseController, view, model) {
        super(mouseController, view, model);
    }

    createElementAt(x, y) {
        var el = Helpers.createElement('text', { x: x, y: y, "font-size": 12, "font-family": "Verdana" });
        el.innerHTML = Constants.DEFAULT_TEXT;
        var model = new TextModel();
        model._x = x;
        model._y = y;
        model._text = Constants.DEFAULT_TEXT;
        var view = new TextView(el, model);
        var controller = new TextController(this.mouseController, view, model);

        return { el: el, model: model, view: view, controller: controller };
    }
}

