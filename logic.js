var inspectionV = false;
var showTimeV = false;
var currentlySolvingV = false;
var globalTime;
var showing = 0;
var counter = 0;
var inspectionCounter = 0;
var timeBeforeSolve = 150;
var deletedRecords = 0;
var gen = [
  "F",
  "L2",
  "D",
  "R",
  "D'",
  "L",
  "F'",
  "F2",
  "D2",
  "B'",
  "U'",
  "R2",
  "R'",
  "L'",
  "B",
  "B2",
  "U",
  "U2",
];
document.addEventListener("DOMContentLoaded", getLastScores);

function getLastScores() {
  if (localStorage.getItem("counter") === null) {
    localStorage.setItem("counter", "0");
  }
  if (localStorage.getItem("currentSolves") === null) {
    localStorage.setItem("currentSolves", "");
  }
  var x = parseInt(localStorage.getItem("counter"));
  counter = x;
  document.getElementById("table").innerHTML = localStorage.getItem(
    "currentSolves"
  );
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    document.getElementById("actual-time").style.color = "#00abdb";
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    document.getElementById("actual-time").style.color = "aliceblue";
    timerState();
  }
});

function getCurrentTime() {
  let time = new Date();
  time = time.getTime();
  return time;
}

function timerState() {
  // console.log("time status entered");
  if (currentlySolvingV) {
    stopTimig();
  } else {
    display();
  }
}

function inspectionF() {
  if (inspectionV) {
    inspectionV = false;
    document.getElementsByClassName("inspection")[0].textContent =
      "allow inspection";
  } else {
    inspectionV = true;
    document.getElementsByClassName("inspection")[0].textContent =
      "disable inspection";
  }
}

function inspectionFAction() {
  // console.log("inspectionFAction entered");
  let inspectionTIme = setInterval(function () {
    // console.log(inspectionCounter);
    if (inspectionCounter == 1) {
      document.getElementsByClassName(
        "actual-time"
      )[0].textContent = Math.round(timeBeforeSolve / 10);
      timeBeforeSolve--;
      if (timeBeforeSolve == 0) {
        display();
      }
    } else {
      if (inspectionCounter == 2) {
        // console.log("inspectionFAction entered its else");
        clearInterval(inspectionTIme);
        timeBeforeSolve = 150;
        display();
      } else {
        clearInterval(inspectionTIme);
        timeBeforeSolve = 150;
      }
    }
  }, 100);
}

function showTimeF() {
  if (showTimeV) {
    showTimeV = false;
    document.getElementsByClassName("showtime")[0].textContent = "show time";
  } else {
    showTimeV = true;
    document.getElementsByClassName("showtime")[0].textContent = "hide time";
  }
}

function showTimeActionF() {
  var liveTime = setInterval(function () {
    if (currentlySolvingV) {
      showing = showing + 0.1;
      showing = Math.round(showing * 10) / 10;
      document.getElementsByClassName("actual-time")[0].textContent = showing;
    } else {
      showing = 0;
      clearInterval(liveTime);
    }
  }, 100);
}

function startTiming() {
  counter = counter + 1;
  currentlySolvingV = true;
  globalTime = getCurrentTime();
}

function stopTimig() {
  currentlySolvingV = false;
  globalTime = getCurrentTime() - globalTime;
  globalTime = globalTime / 1000;
  updateActualTime();
}

function updateActualTime() {
  document.getElementsByClassName("actual-time")[0].textContent = globalTime;
  let closeButton = document.createElement("td");
  let newTimeRow = document.createElement("tr");
  let newTimenumber = document.createElement("td");
  let newTimeScore = document.createElement("td");
  let newTimeScoreAo5 = document.createElement("td");
  closeButton.textContent = "X";
  closeButton.className = "spanScores " + `${counter}`;
  closeButton.onclick = editScore;
  newTimeRow.className = `${counter}` + " timeScore";
  newTimeScore.className = counter;
  newTimeScore.textContent = globalTime;
  newTimenumber.textContent = counter;
  newTimeScoreAo5.className = "Ao5";
  newTimeScoreAo5.textContent = "--";
  newTimeRow.appendChild(newTimenumber);
  newTimeRow.appendChild(newTimeScore);
  newTimeRow.appendChild(newTimeScoreAo5);
  newTimeRow.appendChild(closeButton);
  document.getElementById("table").appendChild(newTimeRow);
  Ao5();
  updateScroll();
  scrambleGenerator();
  saveNewData();
}

function saveNewData() {
  var v = document.getElementById("table").innerHTML;
  localStorage.setItem("currentSolves", `${v}`);
  localStorage.setItem("counter", `${counter}`);
}

function editScore() {
  console.log("score efited");
}

function deleteTime(event) {
  var elementClicked = event.target;
  if (elementClicked.classList[0] == "spanScores") {
    document.getElementsByClassName(elementClicked.classList[1])[0].remove();
    counter--;
    deletedRecords++;
    Ao5();
  }
}

function Ao5() {
  var solves = document.getElementById("table").childNodes;
  if (solves.length < 5) {
    document.getElementsByClassName("Ao5")[counter - 1].textContent = "--";
  }
  // console.log(solves.length);
  else {
    var sum = 0;
    var max = 0;
    var maxPass = true;
    var maxCounter = 0;
    var min = 100;
    var currentNumber;
    for (var i = solves.length - 1; i >= solves.length - 5; i--) {
      maxPass = true;
      if (solves[i].childNodes[1].textContent == "DNF") {
        max = 0;
        maxPass = false;
        maxCounter++;
      }
      if (maxPass) {
        currentNumber = parseFloat(solves[i].childNodes[1].textContent);
        sum = sum + currentNumber;
        if (currentNumber > max) {
          max = currentNumber;
        }
        if (currentNumber < min) {
          min = currentNumber;
        }
      }
    }
    // console.log(min);
    // console.log(max);
    if (maxCounter >= 2) {
      sum = "DNF";
    } else {
      sum = sum - min;
      sum = sum - max;
      sum = sum / 3;
      sum = sum.toFixed(3);
    }
    // console.log(sum);
    document.getElementsByClassName("Ao5")[counter - 1].textContent = sum;
  }
}

function display() {
  // console.log("display entered");
  if (inspectionV) {
    // console.log("enterd display and ic is " + inspectionCounter);
    if (inspectionCounter < 2) {
      inspectionCounter = inspectionCounter + 1;
      inspectionFAction();
    } else {
      // console.log("else");
      inspectionCounter = 0;
      dispaly2();
    }
  } else {
    dispaly2();
  }
}

function dispaly2() {
  // console.log("display 2 entered");
  if (showTimeV) {
    startTiming();
    showTimeActionF();
  } else {
    startTiming();
    document.getElementsByClassName("actual-time")[0].textContent = "solve";
  }
}

function updateScroll() {
  var element = document.getElementsByClassName("scores")[0];
  element.scrollTop = element.scrollHeight;
}

function scrambleGenerator() {
  var scramble = "";
  var newmove = gen[Math.floor(Math.random() * 18)];
  while (scramble.length < 54) {
    scramble = scramble + gen[Math.floor(Math.random() * 18)] + " ";
    if (scramble.split(" ").length > 1) {
      scramble = scramble.split(" ");
      for (var i = 0; i < scramble.length - 1; i = i + 1) {
        if (scramble[i].length == 2 && scramble[i + 1].length == 2) {
          if (scramble[i][0] == scramble[i + 1][0]) {
            while (scramble[i][0] == scramble[i + 1][0]) {
              newmove = gen[Math.floor(Math.random() * 18)];
              if (newmove.length > 1) {
                scramble[i] = newmove;
              }
            }
          }
        } else if (scramble[i].length == 2 && scramble[i + 1].length == 1) {
          if (scramble[i][0] == scramble[i + 1]) {
            while (scramble[i][0] == scramble[i + 1]) {
              newmove = gen[Math.floor(Math.random() * 18)];
              if (newmove.length > 1) {
                scramble[i] = newmove;
              }
            }
          }
        } else if (scramble[i].length == 1 && scramble[i + 1].length == 2) {
          if (scramble[i] == scramble[i + 1][0]) {
            while (scramble[i] == scramble[i + 1][0]) {
              newmove = gen[Math.floor(Math.random() * 18)];
              if (newmove.length == 1) {
                scramble[i] = newmove;
              }
            }
          }
        }
        if (scramble[i] == scramble[i + 1]) {
          while (newmove == scramble[i]) {
            newmove = gen[Math.floor(Math.random() * 18)];
          }
          scramble[i] = newmove;
        }
      }
      scramble = scramble.join(" ");
    }
  }

  document.getElementById("actual-scramble").textContent = scramble;
}

function plusTwo() {
  let currentTime = document.getElementsByClassName("actual-time")[0]
    .textContent;
  currentTime = parseFloat(currentTime);
  currentTime = currentTime + 2;
  currentTime = currentTime.toFixed(3);
  document.getElementsByClassName("actual-time")[0].textContent = currentTime;
  document.getElementsByClassName(counter)[1].textContent = currentTime;
  Ao5();
}

function DNF() {
  document.getElementsByClassName("actual-time")[0].textContent = "DNF";
  document.getElementsByClassName(counter)[1].textContent = "DNF";
  Ao5();
}

function Clear() {
  console.log("clear enterd");
  localStorage.setItem("currentSolves", "");
  localStorage.setItem("counter", "0");
  getLastScores();
}
