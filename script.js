var name;
localStorage.setItem("Playername", name);
// function welcome(name){
//   $(".appendee").html(`<h1>Welcome ` + name + `!</h1><br>` + `<h2>Click <a id="here" href="/map.html">here</a> to begin!<h2>`);
// }

$(".enter").click(function(){
  // name = $(".nameinput").val();
  localStorage.setItem("Playername", $("input").val());
 // window.location.replace('map.html');
  // welcome(name);
  // $('html, body').animate({
  //       scrollTop: 100
  //   }, 700);
});
