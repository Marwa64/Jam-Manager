const socket = io();
document.querySelector("button").addEventListener('click', () => {
  socket.emit('stop', {stop: true});
});
