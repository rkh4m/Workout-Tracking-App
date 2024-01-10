import "./App.css";
import WeekData from "./WeekData.js";


function App() {
  init();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var extractedData = JSON.parse(localStorage.getItem("week"));
  var firstDate = new Date(extractedData[0].date);

  setInterval(UpdateQueue(extractedData, false), 1000 * 60 * 60 * 24);
  return (
    <>
      <h1>{months[firstDate.getMonth()] + " " + firstDate.getFullYear()}</h1>
      <p>
        Workout schedule for Week:{" "}
        <b>
          {GetWeek()}
        </b>{" "}
        of {firstDate.getFullYear()}
      </p>
      <div className="container">
        {DisplayDay(extractedData[0], "1")}
        {DisplayDay(extractedData[1], "2")}
        {DisplayDay(extractedData[2], "3")}
        {DisplayDay(extractedData[3], "4")}
        {DisplayDay(extractedData[4], "5")}
        {DisplayDay(extractedData[5], "6")}
        {DisplayDay(extractedData[6], "7")}
      </div>
      <div className="popup" id="workout" />
      {AddListeners()}
    </>
  );
}

/**
 * Displays the current date and the gym focus associated with it.
 *
 * @param {Object} qData
 *  Extracted data (date and focus day)
 * @param {Strong} id
 * @returns Front end code for the given data.
 */
function DisplayDay(qData, boxId) {
  var thisDate = new Date(qData.date);
  var dateStr = thisDate.toISOString().split("T")[0];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div className="box" id={boxId} data-content={qData.focusDay + " Day"}>
      <ul>
        <u>{days[thisDate.getDay()]}</u>
      </ul>
      <time dateTime={dateStr}>{thisDate.getDate()}</time>
      <select id={"userChoice" + boxId}>{CreateOptions(qData.focusDay)}</select>
    </div>
  );
}

/**
 * Updates the week data localy stored when setInterval calls this function (everyday)
 * or whenever the user changes data (like the focus of the day).
 *
 * @param {Array<String>} extractedData
 *    The data array to be changed.
 * @param {Boolean} userChange
 *    True if the change was from the user, false otherwise.
 */

function UpdateQueue(extractedData, userChange) {
  var today = new Date();
  var indToday = 0;
  for (var i = 0; i < extractedData.length; i++) {
    var dates = new Date(extractedData[i].date);
    if (dates.getDate() === today.getDate()) {
      indToday = i;
      break;
    }
  }

  if (indToday !== 0 || userChange) {
    let totalDaysQueued = parseInt(localStorage.getItem("daysQueued"));
    const weekData = new WeekData(
      extractedData.slice(indToday),
      totalDaysQueued
    );
    var q = weekData.q;
    while (indToday > 0) {
      q.enqueue(weekData.createGymDay(++totalDaysQueued));
      indToday--;
    }
    extractedData = q.toArray();
    localStorage.setItem("daysQueued", q.totalItemsQueued);
    localStorage.setItem("week", JSON.stringify(extractedData));
  }
}

/**
   * Updates the Week number and Year.
*/
function GetWeek() {
  const today = new Date();
  var weeksPassed = Math.floor(DaysPassed(today)/7)+1;

  return weeksPassed;
}

/**
 * Credit for this method:
 * https://www.w3resource.com/javascript-exercises/javascript-date-exercise-16.php
 * 
 * @param {Date} dt 
 * @returns Days passed since beginning of the year.
 */
function DaysPassed(dt) {
  var current = new Date(dt.getTime());
  var previous = new Date(dt.getFullYear(), 0, 1);

  return Math.ceil((current - previous + 1) / 86400000);
}

/**
 * Default initialization of the workout calendar.
 */
function init() {
  if (localStorage.getItem("week") == null) {
    const weekData = new WeekData(null);
    weekData.createWeek();
    localStorage.setItem("week", JSON.stringify(weekData.q.toArray()));
    localStorage.setItem("daysQueued", weekData.q.totalItemsQueued);
  }
}

/**
 * Allows the central textbox to update whenever the user hovers over different boxes.
 */
function AddListeners() {
  var boxes = document.querySelectorAll(".box");

  boxes.forEach(function (box) {
    box.addEventListener("mouseover", function () {
      ShowWorkout(box.getAttribute("data-content"));
      sessionStorage.setItem("currBox", box.id);
    });
  });

  var selections = document.querySelectorAll("select");
  selections.forEach(function (dropdownSelect) {
    dropdownSelect.addEventListener("change", function () {
      UpdateUserChoice();
    });
  });
}

/**
 * Displays the workout associated with the focus of the day.
 *
 * @param {String} content
 */
function ShowWorkout(content) {
  var workout = document.getElementById("workout");
  if (workout) {
    workout.innerHTML = content;
    workout.style.display = "block";
  }
}

/**
 * Set the contents of the workout textbox based on the focus day.
 * Each day will have an image and a schedule to go along with it.
 *
 * @param {String} focusDay
 */
// function setContent(focusDay){
//   var workoutDay = <b>{focusDay + ' Day\n'}</b>;
//   switch(focusDay){
//     case 'Leg':
//       workoutDay += '- Barbell Squats (315 lbs; 5x5)'
//                   + '- RDLs (2 60 lbs dumbells; 5x10)';
//     case 'Pull':

//     case 'Push':

//     default:
//   }
// }

/**
 * Creates the list of remaining muscle group focuses.
 *
 * @param {String} focus
 *    Initial focus day.
 */

function CreateOptions(focus) {
  var options = ["Leg", "Push", "Pull", "Rest"];

  var temp = options[options.length - 1];
  var indOfFocus = options.indexOf(focus);

  options[options.length - 1] = options[indOfFocus];
  options[indOfFocus] = temp;

  return (
    <>
      <option defaultValue={focus}>{focus}</option>
      <option value={options[0]}>{options[0]}</option>
      <option value={options[1]}>{options[1]}</option>
      <option value={options[2]}>{options[2]}</option>
    </>
  );
}

/**
 * Updates the box and the corresponding workout with the new selected muscle focus.
 */
function UpdateUserChoice() {
  var boxId = sessionStorage.getItem("currBox");
  var currBox = document.getElementById(boxId);

  var userChoice = document.getElementsByTagName("select");
  var newFocus = userChoice[boxId - 1].value;

  currBox.setAttribute("data-content", newFocus + " Day");
  var extractedData = JSON.parse(localStorage.getItem("week"));
  var updatedData = [];
  for (var i = 0; i < extractedData.length; i++) {
    if (i === boxId - 1) {
      updatedData.push({
        focusDay: newFocus,
        date: new Date(extractedData[boxId - 1].date),
      });
    } else {
      updatedData.push(extractedData[i]);
    }
  }

  localStorage.setItem("week", JSON.stringify(updatedData));
  ShowWorkout(currBox.getAttribute("data-content"));
}

export default App;
