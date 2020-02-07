//vars
let problemList = [];
let cityList = [];
var c = document.getElementById("canvas");
console.log(c);
var ctx = c.getContext("2d");
console.log(ctx);
//draw background of map
var img = document.getElementById("map");
//game var
let money = 0;
let day = 0;
let dayLimit = 365;
let hour = 0;
let currentCity;
let currentProblem;
let problemAppearing = false;
let enteringCity = false;
//person var
let personX = 150;
let personY = 215;
// name Input
let name = localStorage.getItem("Playername");
let person = document.getElementById("person");
//easy functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//constructors
class City{
  constructor(name, x, y){
    this.name = name;
    this.x = x;
    this.y = y;
    this.homeless = 0;
    this.problemSolved = 0;
    this.happiness = 50;
  }
}

class Problem{
  constructor(text, choices, results, cityConstraint, cityList){
    this.text = text;
    this.choices = choices;
    this.results = results;
    this.cityConstraint = cityConstraint;
    this.city = cityList;
  }
}

//import city
cityList.push(new City("San Francisco", 150, 215));
cityList.push(new City("Oakland", 190, 190));
cityList.push(new City("San Jose", 280, 330));
cityList.push(new City("Berkeley", 190, 160));
cityList.push(new City("Hayward", 230, 250));

//render function
function render(){
  ctx.clearRect(0, 0, c.width, c.height);
  //map
  ctx.drawImage(img, 0, 0, 408, 512);
  //sample dot
  //display a dot on city
  for (let i = 0; i < cityList.length; i ++){
    let city = cityList[i];
    let circleSize = 3;
    ctx.beginPath();
    ctx.arc(city.x, city.y, circleSize, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.fillStyle = "#fc4903";
    ctx.fill();
  }
  //person
  ctx.drawImage(person, personX, personY, 31.52, 50);
}
function renderSide(){
  if (currentCity){
    $(".currentCity").text(currentCity.name);
    $(".happiness").text("Happiness: " + currentCity.happiness);
    $(".homeless").text("Homeless: " + currentCity.homeless);
  }
}
// get mouse pos relative to canvas (yours is fine, this is just different)
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//import problems
//city specific problems
// San Francisco
problemList.push(new Problem("Homeless people booming in San Francisco!", ["Rally Homeless to protest in front of city hall", "Support Homeless with cash money"], [], true, "San Francisco"));
problemList.push(new Problem("Prices of housing in San Francisco are at an all time high in the country!", ["Meet with he mayor to discuss the possibility of stepping in the economy", "Protest to tax the rich more"], [], true, "San Francisco"));
problemList.push(new Problem("Drug addiction in San Francisco is becoming more prominent", ["Open more rehabilitation centers", "Make tighter drug laws"], [], true, "San Francisco"))
// Berekley
problemList.push(new Problem("Homeless population goes up to 43%", ["Open more foundations helping the homeless", "Have more affordable information"], [], true, "Berkeley"));
problemList.push(new Problem("Berkeley students are researching ways to help people in poverty", ["Invest money in their research", "Spread the news around"], [], true, "Berkeley"));
// San Jose
problemList.push(new Problem("Crime escalates escalating across San Jose", ["Invest into the justice system"], [], true, "San Jose"));
// Oakland
problemList.push(new Problem("Wages are lowing while prices are hiring!", ["Protest for higher wages", "Bargain for lower prices"], true, "Oakland"));
problemList.push(new Problem("Gentrification is happening!", ["Spread awareness of the topic", "Get people of color interested tech jobs"], true, "Oakland"));
// Richmond
problemList.push(new Problem("We can't breathe! Oil refineries worsen the quality of air!", ["Air filters for all!", "Switch to Solar and Electrical energy uses!"], [], true, "Richmond"));
problemList.push(new Problem("Study shows that people of color in Richmond are dying earlier than white people!", ["Research to find out why?", "Get national news station's attentions'"], true, "Richmond"));
//problems in all cities
problemList.push(new Problem("A homeless person asks for some money on the street", ["Give them money", "Take them to get food"],  false));
problemList.push(new Problem("You sign up for a program that helps the homeless", ["Donate clothes", "Join the food pantry team"], false));
problemList.push(new Problem("A man is laying on the street unconsious and people have gathered around the scene", ["Call 911", "Pull out your phone and record"], false));
problemList.push(new Problem("f", ["", ""], false));



//canvas handler
function cityEnter(){
  if (enteringCity === false){
    for (let i = 0; i < cityList.length; i ++){
      let city = cityList[i];
      //contact
      let offset = 10;
      if (Math.abs(city.x - personX) <= offset && Math.abs(city.y - personY) <= offset){    
        if (currentCity !== city){
          //contact exist
          enteringCity = true;
          currentCity = city;
          renderProblem(new Problem("Do you want to enter " + city.name, ["Yes", "No"], [
            function(){
              let problem = getProblem(city);
              problemAppearing = true;
              enteringCity = false;
              renderProblem(problem);
              console.log(problem);
            }
            , function(){
              enteringCity = false;
            }]));
        }
        // console.log(problem);
        return;
      }
    }
  }
}
$(".canvasDiv").on("mousemove", function(e){
  if (problemAppearing === false){
    var pos = getMousePos(c, e);
    //if next to a city display city info
    for (let i = 0; i < cityList.length; i ++){
      let city = cityList[i];
      let offset = 10;
      if (Math.abs(city.x - pos.x) <= offset && Math.abs(city.y - pos.y) <= offset){
        currentCity = city;
        renderSide();
        return;
      }
    }
  }
});

function getProblem(city){
  //loop problem list
  let options = [];
  for (let i = 0; i < problemList.length; i ++){
    let problem = problemList[i];
    if (problem.cityConstraint){
      if (problem.city === city.name){
        options.push(problem);
      }
    }else{
      options.push(problem);
    }
  }
  //pick random
  let actualProblem = options[randomInt(0, options.length - 1)];
  return actualProblem;
}

function renderProblem(problem){
  $(".problemDiv").show();
  $(".problemName").text(problem.text);
  $("#option1").text(problem.choices[0]);
  $("#option2").text(problem.choices[1]);
  currentProblem = problem;
}

function resolveProblem(choice){
  let problem = currentProblem;
  $(".problemDiv").hide();
  problemAppearing = false;
  currentProblem = undefined;
  if (problem.results){
    if (problem.results[choice]){
      problem.results[choice]();
    }
  }
  return;
}

//problem click handler
$("#option1").click(function(){
  resolveProblem(0);
});
$("#option2").click(function(){
  resolveProblem(1);
});

let keys = {};
//key bounding
$("body").keydown(function(e) {
  console.log(e.key);
  keys[e.key] = true;
});
$("body").keyup(function(e) {
  keys[e.key] = false;
});


let interval = setInterval(function(){
    
  if (!problemAppearing){
    if (keys.w || keys.ArrowUp){
      personY --;
    }
    if (keys.a || keys.ArrowLeft){
      personX --;
    }
    if (keys.s || keys.ArrowDown){
      personY ++;
    }
    if (keys.d || keys.ArrowRight){
      personX ++;
    }
    cityEnter();
    render();
  }
}, 60);

//start up
render();

// marque
$("marquee").text("Good Luck " + name + "!");