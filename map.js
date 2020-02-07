// Game problems variables
let problemList = [];
let cityList = [];

// DOM elements.
//draw background of map
var img = document.getElementById("map");
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

// Game variables
let money = 0;
let day = 0;
let dayLimit = 20;
let hour = 0;
let currentCity;
let currentProblem;
let problemAppearing = false;
let enteringCity = false;
let totalProblemSolved = 0;
let sideBarCity;

// Homie Tracker.
let personX = 150;
let personY = 250;

// Name Input
let name = localStorage.getItem("Playername");
let person = document.getElementById("person");

// Generate random number.
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// City Model.
class City{
  constructor(name, x, y, homeless, historicalInformation){
    this.name = name;
    this.x = x;
    this.y = y;
    this.homeless = homeless || 0;
    this.originalHomeless = homeless;
    this.problemSolved = 0;
    this.happiness = 0
    this.historicalInformation = historicalInformation || "";
  }
}

// Problem Model.
class Problem{
  constructor(text, choices, results, cityConstraint, cityList){
    this.text = text;
    this.choices = choices;
    this.results = results;
    this.cityConstraint = cityConstraint;
    this.city = cityList;
  }
}

// City data.
cityList.push(new City("San Francisco", 150, 215, 8011, "The beginning of the Gay rights movement."));
cityList.push(new City("Oakland", 190, 190, 8142, "Black Panther Party.")); 
cityList.push(new City("San Jose", 280, 330, 4350, "Capital of Silicon Valley."));
cityList.push(new City("Berkeley", 190, 160, 2000, "A large part of free speech movements in the 1960s."));
cityList.push(new City("Hayward", 230, 250, 397, "Robust agriculture and canning industries."));
cityList.push(new City("Richmond", 190, 180, 559, "Build ships for WWII in the 1940s-1945."));

// Render map function.
const render = () => {
  
  ctx.clearRect(0, 0, c.width, c.height);
  
  // Map
  ctx.drawImage(img, 0, 0, 408, 512);

  // Display dots on the map.
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
  
  // Display homie.
  ctx.drawImage(person, personX, personY, 31.52, 50);
  
  // Time
  $(".day").text("day: " + day);
  $(".hour").text("hour: " + hour);
}

// Render sidebar.
const renderSide = () => {
  
  if (sideBarCity){
    sideBarCity.happiness = 100 - Math.ceil((sideBarCity.homeless / sideBarCity.originalHomeless) * 100);
    $(".currentCity").text(sideBarCity.name);
    $(".happiness").text("Happiness: " + sideBarCity.happiness);
    $(".homeless").text("Homeless: " + sideBarCity.homeless);
    $(".historicalInformation").text("Historical Information: " + sideBarCity.historicalInformation);
    
  }
}

// Get mouse pos relative to canvas (yours is fine, this is just different)
const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// City specific problems
// San Francisco
problemList.push(new Problem("Homeless people booming in San Francisco!", ["Rally Homeless to protest in front of city hall", "Support Homeless with cash money"], [100, 35], true, "San Francisco"));
problemList.push(new Problem("Prices of housing in San Francisco are at an all-time high in the country!", ["Meet with he mayor to discuss the economy", "Protest to tax the rich more"], [50, 250], true, "San Francisco"));
problemList.push(new Problem("Drug addiction in San Francisco is becoming more prominent", ["Open more rehabilitation centers", "Make tighter drug laws"], [150, -20], true, "San Francisco"))
// Berekley
problemList.push(new Problem("Homeless population goes up to 43%", ["Open more foundations helping the homeless", "Have more affordable housing"], [100, 50], true, "Berkeley"));
problemList.push(new Problem("Berkeley students are researching ways to help people in poverty", ["Invest money in their research", "Spread the news around"], [25, 50], true, "Berkeley"));
// San Jose
problemList.push(new Problem("Crime escalates escalating across San Jose", ["Invest into the justice system", "Protest Supportive Progression in Jails"], [50, 200], true, "San Jose"));
// Oakland
problemList.push(new Problem("Wages are lowing while prices are hiring!", ["Protest for higher wages", "Bargain for lower prices"], [75, 5], true, "Oakland"));
problemList.push(new Problem("Gentrification is happening!", ["Spread awareness of the topic", "Get people of color interested tech jobs"], [10, 50], true, "Oakland"));
// Richmond
problemList.push(new Problem("We can't breathe! Oil refineries worsen the quality of air!", ["Air filters for all!", "Switch to Solar and Electrical energy uses!"], [-10, 300], true, "Richmond"));
problemList.push(new Problem("Study shows that people of color in Richmond are dying earlier than white people!", ["Research to find out why?", "Get national news station's attentions'"], [50, 60], true, "Richmond"));
//problems in all cities
problemList.push(new Problem("A homeless person asks for some money on the street", ["Give them money", "Take them to get food"], [0, 20],  false));
problemList.push(new Problem("You sign up for a program that helps the homeless", ["Donate clothes", "Join the food pantry team"], [40, 80], false));
problemList.push(new Problem("A man is laying on the street unconscious and people have gathered around the scene", ["Call 911", "Pull out your phone and record"], [30, -50], false));
problemList.push(new Problem("You're invited to a meeting to discuss the wellness of the City", ["Participate", "Skip it"], [100, 0], false));



//canvas handler
function cityEnter(){
  if (enteringCity === false){
    for (let i = 0; i < cityList.length; i ++){
      let city = cityList[i];
      //contact
      let offset = 10;
      if (Math.abs(city.x - (personX + 12)) <= offset && Math.abs(city.y - (personY + 25)) <= offset){    
        if (currentCity !== city){
          //contact exist
          enteringCity = true;
          currentCity = city;
          sideBarCity = city;
          renderSide();
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
    // pos.x *= $("#canvas").width() / 408;
    // pos.y *= $("#canvas").height() / 512;
    console.log(pos);
    //if next to a city display city info
    for (let i = 0; i < cityList.length; i ++){
      let city = cityList[i];
      let offset = 10;
      console.lg
      if (Math.abs(city.x - pos.x) <= offset && Math.abs(city.y - pos.y) <= offset){
        sideBarCity = city;
        console.log(city);
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
    if (typeof problem.results[choice] === "function"){
      problem.results[choice]();
      console.log("resolve");
    }else if (typeof problem.results[choice] === "number"){
      currentCity.problemSolved ++;
      totalProblemSolved ++;
      currentCity.homeless -= problem.results[choice];
      if (currentCity.homeless < 0){
        currentCity.homeless = 0;
      }
    }
  }
  renderSide();
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

function timeIncrement(){
  hour ++;
  if (hour >= 24){
    hour -= 24;
    day += 1;
  }
  if (day >= dayLimit){
    renderProblem(new Problem("Your mission to solve the homeless problem is now finished! You have solved " + totalProblemSolved + " problems in the bay area!", ["Restart", "Restart"], 
    [
      function(){
        //restart
        console.log("something");
        window.location.href = './';
      }, 
      function(){
        //restart
        window.location.href = './';
      }
    ]));
  }
}

let interval = setInterval(function(){
    
  if (!problemAppearing && !currentProblem){
    if (keys.w || keys.ArrowUp){
      personY --;
      timeIncrement();
    }
    if (keys.a || keys.ArrowLeft){
      personX --;
      timeIncrement();
    }
    if (keys.s || keys.ArrowDown){
      personY ++;
      timeIncrement();
    }
    if (keys.d || keys.ArrowRight){
      personX ++;
      timeIncrement();
    }
    if (personX < 0){
      personX = 0;
    }
    if (personY < 0){
      personY = 0;    
    }
    if (personX > 408){
      personX = 408;
    }
    if (personY > 512){
      personY = 512;    
    }
    cityEnter();
    render();
  }
}, 60);

//start up
render();

// marque
$("marquee").text("Good Luck " + name + "!");