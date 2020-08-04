window.onload = event => {
  const socket = io();
  socket.emit('subPage', '');
  socket.on('subPage', data => {
    let i = 1;
    data.submissions.map(sub => {
      var a = document.createElement("a");
      document.body.querySelector(".submissionContainer").appendChild(a);
      a.href = sub;
      a.classList.add("btn");
      a.classList.add("btn-success");
      a.classList.add("d-flex");
      a.classList.add("justify-content-center");
      a.classList.add("mt-4");
      a.innerText = "Submission #" + i;
      i++;
    });
  });
};
