import Queue from "./Queue.js";

/**
 * Creates a Queue of the upcoming week (starting from the current date) and the workout that goes along with said day.
 *
 * @author Rumi Khamidov
 * @version 12.23.2023
 */
export default class WeekData {
  constructor(itemArray, daysQueued) {
    this.weekDate = new Date();
    this.q = new Queue();
    if(itemArray != null){
      itemArray.forEach(element => {
        this.q.enqueue(element);
      });
      this.weekDate = new Date(itemArray[itemArray.length-1].date);
      this.q.totalItemsQueued = daysQueued;
    }
  }
  createWeek() {
    for (let i = 0; i < 7; i++) {
      this.q.enqueue(this.createGymDay(this.q.totalItemsQueued + 1));
    }
  }
  getGymDay(gymDate){
    var current = this.q.frontIndex;
    while(current){
      var thisDate = current.data.date.getDate();
      if(thisDate === gymDate){
        return current;
      }
      current = current.next;
    }
    return null;
  }
  /**
   * Creates data to be stored by queue and determines the muscle focus of the gym day.
   * 
   * @param {Number} totalDays 
   * @returns Gym day data (focus of workout and date).
   */
  createGymDay(totalDays) {
    var typeDay = "Push";
    if (Math.abs(totalDays - 2) % 6 === 0) {
      typeDay = "Pull";
    } else if (Math.abs(totalDays - 5) % 6 === 0) {
      typeDay = "Leg";
    } else if (Math.abs(totalDays - 3) % 3 === 0) {
      typeDay = "Rest";
    }

    var gymDay = {
      focusDay: typeDay,
      date: new Date(this.weekDate),
    };
    this.weekDate.setDate(this.weekDate.getDate()+1);
    return gymDay;
  }
  /**
   * Updates Queue if the Array passed isn't a week long (7 days).
   * Used to automatically update the queue for the upcoming day.
   * 
   * @param {Array} itemArray 
   */
  updateWeek(itemArray){
    for(var i=7-itemArray.length; i>0; i--){
      this.q.dequeue();
      this.q.enqueue(this.createGymDay(this.q.totalItemsQueued + 1));
    }
  }
}

// const week = new WeekData();
// week.createWeek();

// var q = week.q.toArray();
// console.log(tmrw.data);

// var firstDay = week.q.peek().date.getDate();
// console.log(firstDay)
// console.log(new Date().getDate())
// if(firstDay == new Date().getDate()) console.log(true); else console.log("nope"); 

// var nextDay = week.q.frontIndex.next.data.date;
// console.log(nextDay)