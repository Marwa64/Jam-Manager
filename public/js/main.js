$(document).ready(() => {
  $(".setTime").click(() => {
      $("#main").hide();
      $(".modal").show();
      const socket = io();
  });
});
