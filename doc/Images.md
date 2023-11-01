# Images


## Initialization
```js
let p = new Pixen();
```




## Load images
```js
let img1 = await p.loadImage();
```


## Load sprite from Images
* To create sprites you need to `p.loadImage`
```js
// Load image from file "tiles.png"
let img1 = await p.loadImage("tiles.png");
```
* After image get loaded then we could chunk it and take sprites of it
* These `Sprite`'s could be used in functions like `sprite` and `tiledSprite`
```js
// Tell positions by hands
// x, y - coordinates of the sprite inside the image
// w, h - sizes of the sprite inside the image
//
// Returns object of type Sprite
let spr1 = p.spriteOf(img1, x, y, w, h)


// Map all the image into a sprite map
// countX, countY        - How many tiles are in this image
// tileWidth, tileHeight - Size of each tile in this image
//
// Returns sprite array
let sprites = p.spriteMap(img1, countX, countY, tileWidth, tileHeight);


// Returns true if this object is an Sprite object
p.isSprite(spr1)
```



## Display sprites
```js
// Change tile size for tiled images
// In our case tiled graphics would have tile of size 20
p.tileSize = 20;

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
