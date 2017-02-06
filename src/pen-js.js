/**
 * Created by Luis on 03/02/2017.
 */
(function () {
    this.PenJs = function () {
        this.holder = null; // the holder element, canvas will be instanced inside this element
        this.canvas = null;
        this.context = null;
        this.options = {
            penSize: 2,
            penColor: '#000'
        };
        this.actions = [];
        this.activeAction = {};
        this.activeTool = 'pen';
        this.active = false;

        if (arguments[0] && typeof arguments[0] === "string") {
            try {
                this.holder = document.querySelector(arguments[0]);
            } catch (err) {
                console.error('PenJs: Invalid Css selector informed');
            }
        } else {
            console.error('PenJs: An id or class must be informed');
        }
        if (arguments[1] && typeof arguments[1] === "object") {
            this.options = mergeOptions(this.options, arguments[0]);
        }
        if (this.holder !== null)
            run.call(this);
    };

    // Public Methods
    /**
     * @param {string} [outputType = 'png'] The output format e.g. 'jpeg', 'png'
     * @returns {string} Base64 image of canvas
     */
    PenJs.prototype.toDataURL = function (outputType) {
        if (typeof outputMimeType === 'undefined')
            outputType = 'image/png';
        mime = "image/" + outputType;

        return this.canvas.toDataURL(mime);
    };

    PenJs.prototype.redraw = function() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.context = this.canvas.getContext('2d');
        for (var i = 0, actionsLen = this.actions.length; i < actionsLen; i++) {
            if(this.actions[i].tool)
                PenJs.tools[this.actions[i].tool].draw.call(this, this.actions[i]);
        }
        if (this.active && this.activeAction) {
            PenJs.tools[this.activeTool].draw.call(this, this.activeAction);
        }
    };

    // Private Methods
    /**
     * Starts the plugin
     */
    function run() {
        var _that = this;
        this.canvas = document.createElement("canvas");
        this.canvas.style.cssText = 'width:100%; height:100%; display:block;';
        this.holder.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        addListeners(this.canvas, 'mousedown touchstart', function (e) {
            startAction.call(_that, e)
        });
        addListeners(this.canvas, 'mouseup mouseout mouseleave touchend touchcancel', function (e) {
            stopAction.call(_that, e)
        });
        addListeners(this.canvas, 'click mousemove touchmove', function (e) {
            onAction.call(_that, e)
        });
    }

    /**
     * Start actions
     */
    function startAction(e) {
        this.active = true;
        this.activeAction = {
            tool: this.activeTool,
            color: this.options.penColor,
            size: parseFloat(this.options.penSize),
            events: []
        };
        onAction.call(this, e);
    }

    /**
     * End actions
     */
    function stopAction(e) {
        if (this.activeAction) {
            this.actions.push(this.activeAction);
        }
        this.active = false;
        this.activeAction = null;

        this.redraw();
        onAction.call(this, e);
    }

    /**
     * Process actions
     * @returns {boolean}
     */
    function onAction(e) {
        if (e.originalEvent && e.originalEvent.targetTouches) {
            e.pageX = e.originalEvent.targetTouches[0].pageX;
            e.pageY = e.originalEvent.targetTouches[0].pageY;
        }
        PenJs.tools[this.activeTool].action.call(this, e);
        e.preventDefault();
        return false;
    }

    /**
     *
     * @param {Element} element The element to add the listeners
     * @param {string} eventString List of events to be tracked, must be separated by spaces
     * @param {function} fn The function callback
     */
    function addListeners(element, eventString, fn) {
        var events = eventString.split(' ');
        for (var i = 0, iLen = events.length; i < iLen; i++) {
            element.addEventListener(events[i], fn, false);
        }
    }

    /**
     * Method to extend defaults with user options
     * @param {object} source Default properties
     * @param {object} properties Inputted properties
     * @returns {object} Merged options
     */
    function mergeOptions(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    /**
     * Get the offsets
     * @param {Element} el
     * @returns {{top: number, left: number}}
     */
    function offset(el) {
        var rect = el.getBoundingClientRect(), bodyElt = document.body;

        return {
            top: rect.top + bodyElt.scrollTop,
            left: rect.left + bodyElt.scrollLeft
        }
    }

    // Config
    PenJs.tools = {};
    PenJs.tools.pen = {
        action: function (e) {
            if (this.active) {
                this.activeAction.events.push({
                    x: e.pageX - offset(this.canvas).left,
                    y: e.pageY - offset(this.canvas).top,
                    event: e.type
                });
                return this.redraw();
            }
        },
        draw: function (action) {
            var event, previous, _i, _len, _ref;
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(action.events[0].x, action.events[0].y);
            _ref = action.events;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                event = _ref[_i];
                this.context.lineTo(event.x, event.y);
                previous = event;
            }
            this.context.strokeStyle = action.color;
            this.context.lineWidth = action.size;
            return this.context.stroke();
        }
    };
}());