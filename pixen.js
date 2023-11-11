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

    class Sprite {
        constructor(img, x, y, w, h) {
            this.img = img;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
    }

    class Pixen {
        constructor(canvas = "body", width = 400, height = 400) {
            // Default values
            this.width = width;
            this.height = height;

            // Get/Create the Canvas
            // If string is provided then it is used as query selector to put into
            if (typeof (canvas) === "string") {
                let element = document.querySelector(canvas);
                // If not found or empty array then error
                if (!element) throw new Error("Can't find: " + canvas);
                // If this is array then take first element
                if (Array.isArray(element)) {
                    if (element.length < 1) throw new Error("Can't find: " + canvas);
                    element = element[0];
                }
                // If element is canvas then use it
                // If element is not a canvas then add into it
                if (element instanceof HTMLCanvasElement) {
                    this.canvas = element;
                } else {
                    this.canvas = document.createElement("canvas");
                    element.appendChild(this.canvas);
                }
            } else {
                this.canvas = canvas;
            }
            
            // Tile size
            this.tileSize = 32;

            // Change width and height of the canvas
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            // Get context 2d of the canvas
            this.ctx = this.canvas.getContext("2d");
            this.ctx.imageSmoothingEnabled = false; // Do not allow images to blur
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

            // Gamepad
            // this._gamepad.index
            // this._gamepad.id
            // this._gamepad.buttons.length
            // this._gamepad.buttons[0].pressed
            // this._gamepad.buttons[0].value
            // this._gamepad.axes.length
            this._gamepad = null;

            // Pointers
            this._pointer = {
                pressed: false,
                x: 0,
                y: 0
            }

            // Connect resources
            this._connect_signals();
        }

        async loadImage(src) {
            let img = new Image();
            img.src = src;
            return new Promise((resolve, reject) => {
                img.addEventListener("load", () => {
                    resolve(img);
                });
                img.addEventListener("error", reject);
            });
        }

        // Handy sprite set from image
        spriteOf(img, x, y, w, h) {
            return new Sprite(img, x, y, w, h);
        }

        isSprite(img) {
            return img instanceof Sprite;
        }

        // Turn image into some tileset. Returns array of tiles
        spriteMap(img, countX, countY, tileWidth, tileHeight) {
            let sprites = [];
            for (let y = 0; y < countY; y++) {
                for (let x = 0; x < countX; x++) {
                    sprites.push(new Sprite(img, x * tileWidth, y * tileHeight, tileWidth, tileHeight))
                }
            }
            return sprites;
        }

        gamepadInfo() {
            if (!this._gamepad) return null;
            return {
                id: this._gamepad.id,
                buttons: this._gamepad.buttons.length,
                axes: this._gamepad.axes.length,
                mapping: this._gamepad.mapping,
            }
        }

        gamepadButton(buttonId) {
            if (!this._gamepad) return 0;
            const buttons = this._gamepad.buttons;
            if (buttonId < 0 || buttonId >= buttons.length) {
                return 0;
            }
            let button = buttons[buttonId];
            if (!button.pressed) {
                return 0;
            }
            return button.value;
        }

        gamepadAxe(axeId) {
            if (!this._gamepad) return 0
            const axes = this._gamepad.axes;
            if (axeId < 0 || axeId >= axes.length) {
                return 0;
            }
            return axes[axeId];
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

        onPointer(cb) {
            if (this._pointer.pressed) {
                cb(this._pointer);
            }
        }

        _updatePointerPos(x, y) {
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > this.width) x = this.width;
            if (y > this.height) y = this.height;
            this._pointer.x = x;
            this._pointer.y = y;
        }

        _connect_signals() {
            const bound = (x, y) => {
                let bound = this.canvas.getBoundingClientRect();
                return {
                    x: x - bound.left - this.canvas.clientLeft,
                    y: y - bound.top - this.canvas.clientTop
                };
            }

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
            this.canvas.addEventListener("mousedown", e => {
                let { x, y } = bound(e.clientX, e.clientY);
                this.onPointerDown.emit({ x, y });
                this._pointer.pressed = true;
                this._updatePointerPos(x, y);
                return true;
            });
            this.canvas.addEventListener("mouseup", e => {
                let { x, y } = bound(e.clientX, e.clientY);
                this.onPointerDown.emit({ x, y });
                this._pointer.pressed = false;
                this._updatePointerPos(x, y);
                return true;
            });
            this.canvas.addEventListener("touchstart", e => {
                let lastTouch = null;
                for (let touch of e.changedTouches) {
                    let { x, y } = bound(e.clientX, e.clientY);
                    this.onPointerDown.emit({ x, y });
                    lastTouch = touch;
                }
                if (lastTouch) {
                    this._pointer.pressed = true;
                    this._updatePointerPos(lastTouch.clientX, lastTouch.clientY);
                }
            });
            this.canvas.addEventListener("touchend", e => {
                let lastTouch = null;
                for (let touch of e.changedTouches) {
                    let { x, y } = bound(e.clientX, e.clientY);
                    this.onPointerDown.emit({ x, y });
                    lastTouch = touch;
                }
                if (lastTouch) {
                    this._pointer.pressed = false;
                    this._updatePointerPos(lastTouch.clientX, lastTouch.clientY);
                }
            });
            this.canvas.addEventListener("mousemove", e => {
                let { x, y } = bound(e.clientX, e.clientY);
                this.onPointerMove.emit({ x, y });
                this._updatePointerPos(x, y);
            });
            window.addEventListener("gamepadconnected", (e) => {
                this._gamepad = e.gamepad;
            });
            window.addEventListener("gamepaddisconnected", (e) => {
                this._gamepad = e.gamepad;
            });
        }

        text(t, x, y) {
            this.ctx.font = "" + this._fontSize + "px " + this._fontName;
            this.ctx.fillText(t, x, y + this._fontSize);
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

        sprite(img, x, y, w, h) {
            // If this image is a sprite then draw a chunk of it
            if (img instanceof Sprite) {
                this.ctx.drawImage(img.img,
                    // Tile location on the image
                    img.x, img.y, img.w, img.h,
    
                    // Tile position/size on the Canvas
                    x, y, w, h
                );
                return;
            }
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
            this.text(text, x * this.tileSize, y * this.tileSize);
        }

        realPos(x, y) { // Turns back into real cords
            let tileSize = this.tileSize;
            return {
                x: x * tileSize,
                y: y * tileSize
            }
        }

        tileSprite(img, x, y) {
            this.sprite(img, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }

        // Code to free up the resources
        close() {
            this.clearSignals();
        }
    }

    window.Pixen = Pixen;
    window.Signal = Signal;

})();