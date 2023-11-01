window.addEventListener("load", async function() {
    let pixen = new Pixen("body");
    let x = 0;

    let tileset = await pixen.loadImage("tileset.png");
    let tile1 = pixen.spriteOf(tileset, 0, 32 * 12, 32, 32);

    this.setInterval(() => {
        pixen.clear();
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);
        pixen.onPointer(p => {
            pixen.color("green");
            // pixen.rect(p.x, p.y, 10, 10);
            pixen.image(tile1, p.x, p.y, 32, 32);
            // pixen.text("@", p.x, p.y);
        });

        if (pixen.isKeyPressed("a")) {
            x -= 10;
        } else if (pixen.isKeyPressed("d")) {
            x += 10;
        }
    }, 40);
})