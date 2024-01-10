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
      this.weekDate.setDate(this.weekDate.getDate()+1);
      this.q.totalItemsQueued = daysQueued;
    }
  }
  /**
   * Creates the initial week.
   */
  createWeek() {
    for (let i = 0; i < 7; i++) {
      this.q.enqueue(this.createGymDay(this.q.totalItemsQueued + 1));
    }
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
    console.log(this.weekDate);
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