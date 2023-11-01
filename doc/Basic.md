# Basic

## Create new API
```js
let p = new Pixen();
```

## Create timer
```js
// Interval for 25 fps (1000/25 == 40)
setInterval(async () => {
    // Clear the screen
    p.clear();

    // Do another logic
}, 40);
```