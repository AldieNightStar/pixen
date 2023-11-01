# Signal

## Notes
* Used to connect to some events then emit them when needed
* Connected function should return `true` to keep connected
* You can `wait` on signal by blocking `async` code until it emitted


## Usage
```js
// Create new signal
let sig = new Signal();

// Emit signal with some data
sig.emit("Data");


// Connect to the signal and receive data from it
sig.connect(async dat => {
    // Do something
    console.log(dat);

    // Returns true to keep connected
    return true
});


// Wait on data from Signal in async-blocking way
let dat = await sig.wait()
```