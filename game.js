window.addEventListener("load", function() {
    let pixen = new Pixen("body");
    let x = 0;
    this.setInterval(() => {
        pixen.clear();
        pixen.color("red");
        pixen.rect(x, 25, 50, 50);

        if (pixen.getPointer().pressed) {
            let p = pixen.getPointer();
            pixen.color("green");
            pixen.rect(p.x, p.y, 10, 10);
        }
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