class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {

        this.currentState = config.initial;
        this.states = config.states;
        this.stackOfStates = [this.currentState];
        this.undoneStates = [];
        this.actionsDone = [];

    }


    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {

        this.actionsDone.push("getState");
        return this.currentState;
        
  
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        if (!this.states[state]) {
            throw new Error("Error: The state " + state + " doesn't exist");

        }

        
        this.currentState = state;
        this.stackOfStates.push(this.currentState);
        this.actionsDone.push("changeState");

 
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        if (!this.states[this.currentState].transitions[event]) {
            throw new Error(event + " event doesn't exist in current state.");

        }



        this.currentState = this.states[this.currentState].transitions[event];
        this.stackOfStates.push(this.currentState);
        this.actionsDone.push("trigger");
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.stackOfStates[0];
        this.actionsDone.push("reset");

    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let arrayOfAllStates = [];

        for (let state in this.states) {
            arrayOfAllStates.push(state);
     
        }


        if (arguments.length == 0) {
            return arrayOfAllStates;

        }

        let getStatesArray = [];


        for (let state in this.states) {
        
           if (event in this.states[state].transitions) {
            getStatesArray.push(state);
           }
           

        }

        this.actionsDone.push("getStates");

        return getStatesArray;
    }


    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.stackOfStates.length == 0) {
            return false;

        }

        if (this.stackOfStates.length == 1) {
            return false;

        }
        this.currentState = this.stackOfStates[this.stackOfStates.length-2];
        this.undoneStates.push(this.stackOfStates[this.stackOfStates.length-1]);
        this.stackOfStates.pop();
        this.actionsDone.push("undo");
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoneStates.length == 0) {
            return false;

        }

        if (this.changeStatesCounter > 0) {
            return false;

        }

        if (this.triggersCounter > 0) {
            return false;

        }

        if (this.actionsDone[this.actionsDone.length-1] == "trigger" || this.actionsDone[this.actionsDone.length-1] == "changeState") {
            return false;

        }

        this.currentState = this.undoneStates[this.undoneStates.length-1];
        this.stackOfStates.push(this.currentState);
        this.undoneStates.pop();
        this.actionsDone.push("redo");
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        for (let i = this.stackOfStates.length-1; i>=0; i--) {

            this.stackOfStates.pop();
            //console.log(this.stackOfStates);
     
        }

        for (let i = this.undoneStates.length-1; i >= 0; i--) {

            this.undoneStates.pop();
            //console.log(this.stackOfStates);

        }

        this.actionsDone.push("clear");
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
