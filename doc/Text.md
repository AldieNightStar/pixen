# Text

# Notes
* Engine allows to print text and tile-based text on the screen


## Initialization
```js
let p = new Pixen();
```


## Usage
```js
// Set new color
p.color("red");
p.colorRgb(r, g, b, a=1);

// Change text font size
p.fontSize(n);

// Change font name. For example "Arial"
fontName(name);

// Print the text on the screen
p.text(text, x, y);

// Print tiled text
// Based on p.tileSize int number
p.tileText(text, x, y);

```