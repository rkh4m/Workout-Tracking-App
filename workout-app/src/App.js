import "./App.css";
import WeekData from "./WeekData.js"

function App() {
  init();

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var extractedData = JSON.parse(localStorage.getItem('week'));
  var firstDate = new Date(extractedData[0].date);

  setInterval(UpdateQueue(extractedData), 24*60*60*1000);
  return (
    <>
      <h1>{months[firstDate.getMonth()]+' '+firstDate.getFullYear()}</h1>
        <ul>
          {DisplayDay(extractedData[0])}
          {DisplayDay(extractedData[1])}
          {DisplayDay(extractedData[2])}
          {DisplayDay(extractedData[3])}
          {DisplayDay(extractedData[4])}
          {DisplayDay(extractedData[5])}
          {DisplayDay(extractedData[6])}
        </ul>
    </>
  );
}

function DisplayDay(qData){
  var thisDate = new Date(qData.date);
  var dateStr = thisDate.toISOString().split('T')[0];
  return (
    <li>
      <time datetime={dateStr}>{thisDate.getDate()}</time>
      {qData.focusDay}
    </li>
  );
}
/**
 * 
 * @param {Array<String>} extractedData 
 */
function UpdateQueue(extractedData){
  var today = new Date().getDate().toString();
  var indToday = 0;
  for(var i=0; i<extractedData.length; i++){
    var dates = extractedData[i].date;
    if(dates.includes(today)){
      indToday = i; 
      break;
    }
  }

  if(indToday !== 0){
    let totalDaysQueued = parseInt(localStorage.getItem('daysQueued'));
    const weekData = new WeekData(extractedData.slice(indToday), totalDaysQueued);
    while(indToday > 0){
      var q = weekData.q;
      q.enqueue(weekData.createGymDay(totalDaysQueued));
      indToday--;
    }
    extractedData = q.toArray();
    localStorage.setItem('daysQueued'. totalDaysQueued++);
    localStorage.setItem('week', JSON.stringify(extractedData));
  }
}

function init(){
  if(localStorage.getItem('week') == null){
    const weekData= new WeekData(null);
    weekData.createWeek();
    localStorage.setItem('week', JSON.stringify(weekData.q.toArray()));
    localStorage.setItem('daysQueued', weekData.q.totalItemsQueued);
  }
}

export default App;
