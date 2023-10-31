window.addEventListener("load", function() {
    let pixen = new Pixen("body");
    let x = 0;
    this.setInterval(() => {
        pixen.clear();
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);
        pixen.onPointer(p => {
            pixen.color("green");
            pixen.rect(p.x, p.y, 10, 10);
            pixen.text("@", p.x, p.y);
        })
    }, 40);

    pixen.onKeyDown.connect(k => {
        if (k === "a") {
            x -= 10;
        } else if (k === "d") {
            x += 10;
        }
        return true;
    });
})