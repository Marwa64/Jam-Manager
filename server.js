const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let timerContainer, start = false, hours = 0, minutes = 0, seconds = 0;

app.use(express.static(__dirname+'/public/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
})

function timer(){
  if (hours === 0 && minutes === 0 && seconds === 0){
    console.log("Time's up!");
    clearInterval(timerContainer);
    start = false;
  } else {
    if (seconds === 0){
      if (minutes === 0){
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
      seconds = 59;
    } else {
      seconds--; 
    }
  }
  console.log(hours + ":" + minutes + ":"+seconds);
  io.sockets.emit('countDown', {hours: hours, minutes: minutes, seconds: seconds});
}

io.on('connection', socket => {
  console.log("A user connected");
  socket.emit('jamStarted', {start: start});

  socket.on('hours', socket => {
    console.log(socket.hours);
    hours = socket.hours;
    start = true;

    timerContainer = setInterval(timer, 1000);
  });

  socket.on('disconnect', socket => {
    console.log("A user disconnected");
  })
});
server.listen(process.env.PORT || 3000);
