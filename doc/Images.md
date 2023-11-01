# Images

## Load images
```js
let img1 = await p.loadImage();
```



## Load sprite from Images
```js
// Tell positions by hands
// x, y - coordinates of the sprite inside the image
// w, h - sizes of the sprite inside the image
let spr1 = p.spriteOf(img1, x, y, w, h)


// Map all the image into a sprite map
// countX, countY        - How many tiles are in this image
// tileWidth, tileHeight - Size of each tile in this image
//
// Returns sprite array
let sprites = p.spriteMap(img1, countX, countY, tileWidth, tileHeight);
```



## Display that images
```js
// Display sprite on the screen
// img  - Display image or sprite
// x, y - Coordinates
// w, h - Size of the Sprite
p.sprite(img, x, y, w, h)

// Display sprite on the screen using tile placing
// img  - Display image or sprite
// x, y - Tile position (Multiplied by tile size)
p.tileSprite(img, x, y)
```



## Change tile size
* By default `tileSize` is `32`
```js
// Now tile size will be 20
p.tileSize = 20;
```