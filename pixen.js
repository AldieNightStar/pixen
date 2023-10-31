(function () {

    class Signal {
        constructor() {
            this.callbacks = [];
        }

        connect(f) {
            this.callbacks.push(f);
        }

        async emit(data) {
            let oldCallbacks = this.callbacks;
            this.callbacks = [];
            for (let callback of oldCallbacks) {
                let result = await callback(data);
                if (result === true) {
                    // If signal returns true then reconnect it back
                    // The rest will be deleted
                    this.connect(callback)
                }
            }
            return data;
        }

        async wait(timeout = 0, defaultData = null) {
            return new Promise(resolve => {
                // Handler for timeout if need to
                let timeoutTimer = null;
                if (timeout > 0) {
                    timeoutTimer = setTimeout(() => {
                        resolve(defaultData);
                    }, timeout);
                }

                // Connect to a signal and wait
                this.connect(data => {
                    if (timeoutTimer !== null) clearInterval(timeoutTimer);
                    resolve(data);
                });
            });
        }

        clear() {
            this.callbacks = [];
        }
    }

    class Pixen {
        constructor(canvas) {
            if (typeof (canvas) === "string") {
                let doc = document.querySelector(canvas);
                // If not found or empty array then error
                if (!doc) throw new Error("Can't find: " + canvas);
                // If this is array then take first element
                if (Array.isArray(doc)) {
                    if (doc.length < 1) throw new Error("Can't find: " + canvas);
                    doc = doc[0];
                }
                this.canvas = document.createElement("canvas");
                doc.appendChild(this.canvas);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext("2d");
            this._fontSize = 20;
            this._fontName = "Arial";

            // Signals
            this.onKeyDown = new Signal();
            this.onKeyUp = new Signal();
            this.onPointerDown = new Signal();
            this.onPointerUp = new Signal();
            this.onPointerMove = new Signal();

            // Buttons
            this._keys = {};

            // Pointers
            this._pointer = {
                pressed: false,
                x: 0,
                y: 0
            }

            // Connect resources
            this._connect_signals();
        }

        clearSignals() {
            for (const [fieldName, signal] of Object.entries(this)) {
                if (fieldName.startsWith("on") && signal instanceof Signal) {
                    signal.clear();
                }
            }
        }

        isKeyPressed(k) {
            return this._keys[k] === true;
        }

        getPointer() {
            return this._pointer;
        }

        _connect_signals() {
            window.addEventListener("keydown", e => {
                this._keys[e.key] = true;
                this.onKeyDown.emit(e.key);
                return true;
            });
            window.addEventListener("keyup", e => {
                this._keys[e.key] = false;
                this.onKeyUp.emit(e.key);
                return true;
            });
            // TODO - make single pointer control
            window.addEventListener("mousedown", e => {
                this.onPointerDown.emit({ x: e.clientX, y: e.clientY });
                this._pointer.pressed = true;
                this._pointer.x = e.clientX;
                this._pointer.y = e.clientY;
                return true;
            });
            window.addEventListener("mouseup", e => {
                this.onPointerUp.emit({ x: e.clientX, y: e.clientY });
                this._pointer.pressed = false;
                this._pointer.x = e.clientX;
                this._pointer.y = e.clientY;
                console.log(this._pointer, e);
                return true;
            });
            window.addEventListener("touchstart", e => {
                let lastTouch = null;
                for (let touch of e.changedTouches) {
                    this.onPointerDown.emit({ x: touch.clientX, y: touch.clientY });
                    lastTouch = touch;
                }
                if (lastTouch) {
                    this._pointer.pressed = true;
                    this._pointer.x = lastTouch.clientX;
                    this._pointer.y = lastTouch.clientY;
                }
            });
            window.addEventListener("touchend", e => {
                let lastTouch = null;
                for (let touch of e.changedTouches) {
                    this.onPointerUp.emit({ x: touch.clientX, y: touch.clientY });
                    lastTouch = touch;
                }
                if (lastTouch) {
                    this._pointer.pressed = false;
                    this._pointer.x = lastTouch.clientX;
                    this._pointer.y = lastTouch.clientY;
                }
            });
            window.addEventListener("mousemove", e => {
                this.onPointerMove.emit({ x: e.clientX, y: e.clientY });
                this._pointer.x = e.clientX;
                this._pointer.y = e.clientY;
            })
        }

        text(t, x, y) {
            this.ctx.font = "" + this._fontSize + "px " + this._fontName;
            this.ctx.fillText(t, x, y);
        }

        rect(x, y, w, h) {
            this.ctx.fillRect(x, y, w, h);
        }

        color(c) {
            this.ctx.fillStyle = c;
        }

        colorRgb(r, g, b, a = 1) {
            this.color("rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
        }

        fontSize(n) {
            this._fontSize = n;
        }

        fontName(name) {
            this._fontName = name;
        }

        image(img, x, y, w, h) {
            this.ctx.drawImage(img, x, y, w, h);
        }

        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        tile(x, y) {
            let size = this.tileSize;
            this.rect(x * size, y * size, size, size);
        }

        tilePos(x, y) {
            let tileSize = this.tileSize;
            return {
                x: Math.floor(x / tileSize),
                y: Math.floor(y / tileSize)
            }
        }

        tileText(text, x, y) {
            this.fontSize(this.tileSize);
            this.text(text, x * this.tileSize, (0.75 + y) * this.tileSize);
        }

        realPos(x, y) { // Turns back into real cords
            let tileSize = this.tileSize;
            return {
                x: x * tileSize,
                y: y * tileSize
            }
        }

        tileImage(img, x, y) {
            this.image(img, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }

        // Code to free up the resources
        close() {
            this.clearSignals();
        }
    }

    window.Pixen = Pixen;
    window.Signal = Signal;

})();