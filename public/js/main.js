let socket, hours='00', minutes='00', seconds='00', timerContainer, submissions=[], fieldColor;
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

      socket.emit('subPage', '');
      socket.on('subPage', data => {
        if (data.submissions.length > 0) {
          console.log("there is enough");
          document.querySelector("#previousJam").style.visibility = "visible";
        }
      });

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
      fieldColor = setInterval(changeColor);

      let submit = document.querySelector(".submitBtn");
      submit.addEventListener('click', () => {
        let url = document.querySelector('#fileSubmitted').value;
        let name = document.querySelector("#name").value;
        if (name !== ''){
          if (url !== ''){
            if (url.includes("https:") || url.includes("http:")){
              socket.emit('submission', {url: url, name: name});
              document.querySelector("#name").value = "";
              document.querySelector('#fileSubmitted').value = "";
              document.querySelector('#alert').innerHTML = '<div class="alert alert-success text-center" role="alert">The project has been submitted!</div>';
            } else {
              document.querySelector('#alert').innerHTML = '<div class="alert alert-danger text-center" role="alert">Invalid link. Please ensure it includes https:/http:</div>';
            }
          } else {
            document.querySelector('#alert').innerHTML = '<div class="alert alert-danger text-center" role="alert">Please enter the link</div>';
          }
        } else {
          document.querySelector('#alert').innerHTML = '<div class="alert alert-danger text-center" role="alert">Please enter your name</div>';
        }
      });
    }
  };
  xhttp.open("GET", "html/jamPage.html", true);
  xhttp.send();
}

function submissionsPage() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("#main").innerHTML = this.responseText;
      submissions.map(sub => {
        var a = document.createElement("a");
        document.body.querySelector(".submissionContainer").appendChild(a);
        a.href = sub.url;
        a.classList.add("btn");
        a.classList.add("subBtn");
        a.classList.add("d-flex");
        a.classList.add("justify-content-center");
        a.classList.add("mt-4");
        a.innerText = sub.name + "'s submission";
        a.setAttribute('target', '_blank');
      });
    }
  };
  xhttp.open("GET", "html/submissionsPage.html", true);
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
      clearInterval(fieldColor);
      submissionsPage();
    }
    document.querySelector("#countDown").innerHTML = hours + ":" + minutes + ":"+seconds;
  });

  socket.on('sub', data => {
    submissions = [];
    data.submissions.map(sub => {
      submissions.push(sub);
    });
  });

}

function getTheme() {
  socket.on('themes', data => {
    document.querySelector("#theme").innerText = " " + data.theme1 + " / " + data.theme2;
  });
}

function changeColor(){
  let urlField = document.querySelector('#fileSubmitted');
  let nameField = document.querySelector("#name");
  if (urlField.value !== "" || urlField === document.activeElement){
    urlField.style.backgroundColor = "#e7bbff";
  } else {
    urlField.style.backgroundColor = "white";
  }
  if (nameField.value !== "" || nameField === document.activeElement){
    nameField.style.backgroundColor = "#e7bbff";
  } else {
    nameField.style.backgroundColor = "white";
  }
}
