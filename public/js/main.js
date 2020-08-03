let time;
$(document).ready(()=>{
  const socket = io();
  landingPage();
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
  time = document.querySelector("#hours").value;
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
      document.querySelector("#countDown").innerHTML = time + ":00:00";
    }
  };
  xhttp.open("GET", "html/jamPage.html", true);
  xhttp.send();
}
