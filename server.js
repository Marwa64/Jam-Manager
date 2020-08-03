const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let timerContainer, start = false, hours = 0, minutes = 0, seconds = 0, chosenTheme1, chosenTheme2;

app.use(express.static(__dirname+'/public/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
})

let themes = ['print',
              'cheat',
              'discover',
              'step',
              'arrange',
              'communicate',
              'reduce',
              'divide',
              'confess',
              'recognise',
              'love',
              'book',
              'lend',
              'favour',
              'reply',
              'tie',
              'skip',
              'practise',
              'load',
              'care',
              'observe',
              'supply',
              'lock',
              'walk',
              'disagree',
              'file',
              'film',
              'gather',
              'handle',
              'sin',
              'invent',
              'borrow',
              'contain',
              'sign',
              'multiply',
              'trace',
              'decide',
              'complain',
              'learn',
              'consider',
              'accept',
              'scream',
              'puncture',
              'number',
              'produce',
              'live',
              'face',
              'advise',
              'dance',
              'interrupt',
              'battle',
              'overflow',
              'mark',
              'pack',
              'lie',
              'trade',
              'collect',
              'employ',
              'guess',
              'belong',
              'bake',
              'count',
              'invite',
              'search'
             ];

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
  io.sockets.emit('themes', {theme1: chosenTheme1, theme2: chosenTheme2});
}

io.on('connection', socket => {
  console.log("A user connected");
  socket.emit('jamStarted', {start: start});

  socket.on('hours', socket => {
    console.log(socket.hours);
    hours = socket.hours;
    start = true;
    let themeIndex1 = Math.floor(Math.random() * themes.length);
    let themeIndex2 = Math.floor(Math.random() * themes.length);
    while (themeIndex1 === themeIndex2){
      themeIndex2 = Math.floor(Math.random() * themes.length);
    }
    chosenTheme1 = themes[themeIndex1];
    chosenTheme2 = themes[themeIndex2];

    console.log("Theme 1: " + chosenTheme1 + " Theme 2: " + chosenTheme2);

    timerContainer = setInterval(timer, 1000);
  });

  socket.on('disconnect', socket => {
    console.log("A user disconnected");
  })
});
server.listen(process.env.PORT || 3000);
