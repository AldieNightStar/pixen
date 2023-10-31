window.addEventListener("load", async function() {
    let pixen = new Pixen("body");
    let x = 0;

    let ball = await pixen.loadImage("https://pngimg.com/uploads/football/football_PNG52781.png");

    this.setInterval(() => {
        pixen.clear();
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);
        pixen.onPointer(p => {
            pixen.color("green");
            // pixen.rect(p.x, p.y, 10, 10);
            pixen.image(ball, p.x, p.y, 25, 25);
            // pixen.imageChunked(ball, p.x, p.y, 25, 25, 500, 0, 500, 1000);
            pixen.text("@", p.x, p.y);
        });

        if (pixen.isKeyPressed("a")) {
            x -= 10;
        } else if (pixen.isKeyPressed("d")) {
            x += 10;
        }
    }, 40);
})