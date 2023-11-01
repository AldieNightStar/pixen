# Tile Based Graphics


## Initialization
```js
let p = new Pixen();
```


## Tile Based Coordinates
* Converts real `x, y` coordinates into __Tile Based__ ones
* Under the hood divides position by `p.tileSize` and returning tile position
* For example `30, 80` for `tileSize=20` will be `1, 4`
```js
// Convert x, y into TileBased t.x and t.y
// Returns {x, y} object with tile positions
let t = p.tilePos(x, y);
```



## Draw tiled Graphics
* Settings

```js
// Set new tileSize
// It is used to calculate tiles
p.tileSize = 20;

// Set color
p.color("red");
p.colorRgb(r, g, b, a=1);
```

* Tiles itself

```js
// Draw tiled Rectangle
// Using p.tileSize
p.tile(x, y);

// img  - Image or Sprite object
// x, y - Coordinates to draw to
p.tileSprite(img, x, y);

// Draw tiled Text
// Using p.tileSize
p.tileText(text, x, y);
```