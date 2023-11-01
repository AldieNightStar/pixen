# Monna Histea Pixen

## Install
TO BE DONE

## Using
* Download `pixen.js` file and connect
* Write code
```js
window.addEventListener("load", async function() {

    // Create new Pixen instance (It's our engine)
    let pixen = new Pixen("body");

    // Create temporary variable for an object to draw
    let x = 0;

    // Load some image (In our case it will be used as tileset)
    let tileset = await pixen.loadImage("tileset.png");

    // Load tiles from Tileset image
    // In this engine we call it SpriteMap
    let tiles = pixen.spriteMap(tileset, 16, 16, 32, 32);

    // Now let's add some timer
    this.setInterval(() => {
        // Clear the screen
        pixen.clear();

        // Draw object based on `x` variable
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);

        // Test keyboard and change the position of the object
        if (pixen.isKeyPressed("a")) {
            x -= 10;
        } else if (pixen.isKeyPressed("d")) {
            x += 10;
        } else if (pixen.isKeyPressed("w")) {
            console.log(pixen.gamepad);
        }
    }, 40);
})
```

## Reference
[Go to the Reference](doc/README.md)