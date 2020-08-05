window.onload = event => {
  const socket = io();
  socket.emit('subPage', '');
  socket.on('subPage', data => {
    let i = 1;
    data.submissions.map(sub => {
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
      i++;
    });
  });
};
