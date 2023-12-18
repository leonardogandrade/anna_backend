const emitterFile = require('./my_emitter');
const myEmitter = emitterFile.emitter;

myEmitter.on('test', (res) => {
    console.log('worked!');
});

//within 5s, let's run registration_handler.js to emit the event
setTimeout(console.log, 5000, 'Done');