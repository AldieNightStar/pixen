window.addEventListener("load", async function() {
    let pixen = new Pixen("body");
    let x = 0;

    let tileset = await pixen.loadImage("tileset.png");
    let tiles = pixen.spriteMap(tileset, 16, 16, 32, 32);

    this.setInterval(() => {
        pixen.clear();
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);
        pixen.onPointer(p => {
            // pixen.color("green");
            // pixen.rect(p.x, p.y, 10, 10);
            pixen.sprite(tiles[p.x % tiles.length], p.x, p.y, 50, 50);
            // pixen.text("@", p.x, p.y);
        });

        if (pixen.isKeyPressed("a")) {
            x -= 10;
        } else if (pixen.isKeyPressed("d")) {
            x += 10;
        } else if (pixen.isKeyPressed("w")) {
            console.log(pixen.gamepad);
        }
    }, 40);
})