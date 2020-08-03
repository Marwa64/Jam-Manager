let socket, hours='00', minutes='00', seconds='00', timerContainer;
$(document).ready(()=>{
socket = io();
  socket.on('jamStarted', data => {
    if (!data.start){
      landingPage();
    } else {
      jamPage();
    }
  });
});

// if user cancels the jam
let cancel = document.querySelector("#cancel");
cancel.addEventListener('click', () => {
  $(".modal").hide();
  landingPage();
});

// if the user starts the jam
let start = document.querySelector("#start");
start.addEventListener('click', () => {
  hours = document.querySelector("#hours").value;
  socket.emit('hours', {hours: hours});
  $(".modal").hide();
  jamPage();
})

function landingPage() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("#main").innerHTML = this.responseText;

      let setTimeBtn = document.querySelector(".setTime");
      setTimeBtn.addEventListener('click', () => {
        $(".modal").show();
        document.querySelector("#main").innerHTML = "";
      });
    }
  };
  xhttp.open("GET", "html/landingPage.html", true);
  xhttp.send();
}

function jamPage() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("#main").innerHTML = this.responseText;
      timerContainer = setInterval(updateCounter, 1000);
      getTheme();
    }
  };
  xhttp.open("GET", "html/jamPage.html", true);
  xhttp.send();
}

function updateCounter() {
  socket.on('countDown', data => {
    hours = data.hours;
    minutes = data.minutes;
    seconds = data.seconds;

    if (seconds < 10){
      seconds = '0' + seconds;
    }
    if (minutes < 10){
      minutes = '0' + minutes;
    }
    if (hours < 10){
      hours = '0' + hours;
    }

    if (hours == '00' && minutes == '00' && seconds == '00'){
      clearInterval(timerContainer);
    }
    document.querySelector("#countDown").innerHTML = hours + ":" + minutes + ":"+seconds;
  });
}

function getTheme() {
  socket.on('themes', data => {
    document.querySelector("#theme").innerText = " " + data.theme1 + " / " + data.theme2;
  });
}
