# Predefined Signals

## Notes
* Used in the game engine as standard ones




## Enumeration of them
* `p.onKeyDown` - Emited with string when key is pressed
* `p.onKeyUp` - Emited with string when key is released
* `p.onPointerDown` - Emited with `{x,y}` when pointer is pressed
* `p.onPointerUp` - Emited with `{x,y}` when pointer is released
* `p.onPointerMove` - Emited with `{x,y}` when pointer is moving


## Sample of connect
```js
p.onKeyDown.connect(k => {
  // Log the key
  console.log("Key " + k + " is pressed");

  // Do not disconnect
  return true
}
```
