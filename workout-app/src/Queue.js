/**
 * Backend data structure of this project:
 * Days of the week are organized via Queue.
 *  
 * @author Rumi Khamidov
 * @version 12.23.2023
 */
export default class Queue {
    /**
     * Creates an instance of a Queue.
     */
	constructor() {
		this.frontIndex = null;
		this.backIndex = null;
        this.totalItemsQueued = 0;
	}
    /**
     * Adds items to Queue
     * 
     * @param {any} item 
     *  data to be added to Queue.
     */
	enqueue(item) {
        var node = new Node(item);
        if(this.backIndex == null){
            this.frontIndex = node;
            this.backIndex = node;
        } else {
            this.backIndex.setNext(node);
            this.backIndex = node;
        }
        this.totalItemsQueued++;
	}
    /**
     * Removes the first item in Queue.
     * 
     * @returns First item in Queue.
     */
	dequeue() {
		const item = this.peek();
        if(this.frontIndex === this.backIndex){
            this.frontIndex = null;
            this.backIndex = null;
        } else {
            this.frontIndex = this.frontIndex.next;
        }
		return item;
	}
    /**
     * Gets the first item in the Queue.
     * 
     * @returns First item in Queue.
     */
	peek() {
		return this.frontIndex.data;
	}
    toArray(){
        var current = this.frontIndex;
        var array = new Array(7);
        var i = 0;
        while(current){
            array[i] = current.data;
            current = current.next;
            i++;
        }
        return array;
    }
}

/**
 * Queue utilizes Nodes to organize data.
 */
class Node {
    /**
     * Creates an instance of a Node.
     * 
     * @param {any} value 
     * @param {Node} nextNode 
     */
    constructor(value, nextNode = null){
        this.data = value;
        this.next = nextNode;
    }
    /**
     * Sets the next Node of the currently referenced Node.
     * 
     * @param {Node} nextNode 
     */
    setNext(nextNode){
        this.next = nextNode;
    }
    /**
     * Changes the Node's data.
     * 
     * @param {any} value 
     */
    setData(value){
        this.data = value;
    }
}

