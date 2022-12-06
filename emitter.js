const EventEmitter = require('events');
const newEmitter = new EventEmitter();

module.exports = {
    emitter : newEmitter,
    fireEvent : newEmitter.emit
}