// Will make calculator "widget"
// Can create a calculator "element" with js logic
// Usage: Create calculator with new Calculator, call init method and pass dom target where calc will be added as a child to the dom
class Calculator {
    constructor() {
        //What should this try to accomplish? Build the whole calculator here? Html and such? Add the css? Turn on logic? Yeah probably

        //Create HTML to place in dom, add styles as needed, should be pretty barebones

        this.calcContainer;

        this.calcScreenContainer; 

        this.calcScreenContent;

        this.calcButtonContainer;

        this.calcButtons = [];

        this.calcState = new Calc_State();

        this.create_HTML();

        //Calculator constructed, next step is to init calculator to place it in the dom
    }

    // Creates html skeleton for calculator. Use along side separate stylesheet
    //Called by ctor, returns to ctor
    create_HTML() {
        //Create HTML to place in dom, add styles as needed, should be pretty barebones

        //Outer container
        this.calcContainer = document.createElement("div");
        this.calcContainer.id ="calculator-container";

        //Screen container
        this.calcScreenContainer = document.createElement("div");
        this.calcScreenContainer.id = "calculator-screen-container";

        //Screen Content + Screen Container Append
        this.calcScreenContent = document.createElement("span");
        this.calcScreenContent.id = "calculator-screen-content";
        this.calcScreenContainer.appendChild(this.calcScreenContent);

        //Button Container
        this.calcButtonContainer = document.createElement("div");
        this.calcButtonContainer.id = "calculator-button-container";

        //Get buttons from constant function
        const buttons = this.BUTTONS();

        //Create individual buttons from button constant, append to button container
        for(let i = 0; i < buttons.length; ++i)
        {
            let newButton = document.createElement("div");
            newButton.classList.add("button");
            newButton.innerText = buttons[i];
            newButton.id = String(buttons[i]);
            this.calcButtonContainer.appendChild(newButton);
            this.calcButtons.push(newButton);
        }

        //Append screen and button container to calc container
        this.calcContainer.appendChild(this.calcScreenContainer);
        this.calcContainer.appendChild(this.calcButtonContainer);

        return; //Back to ctor
    }


    init(DOM_target) {
        //Places calculator in the dom, starts calc logic loop
        //Add calculator to the dom, event listeners added in ctor, nothing else this func has to do that wasnt handled in ctor. Maybe ill add event listeners here, i need to think

        //Turn on event listening, starting calc loop
        this.activate_event_listening();

        //Add to document target element
        DOM_target.appendChild(this.calcContainer);
    }

    //Adds click type event listeners to calculator buttons, allowing the user to interface with calculator
    //Called by "init", returns to init
    activate_event_listening() {
        //Add event listener to each button
        //TODO: Do not add event listeners to "empty buttons"
        this.calcButtons.forEach( x => x.addEventListener("click", this.button_press.bind(this)))

        return; //Back to init
    }

    //Entry point of calc logic. Each button press starts here.
    //Called by event listener, executes a line of functions to completion, then waits for next button press
    button_press(event) {
        //What should happen each button press?
        //First, figure out what button was pressed
        //input is the button elem that was pressed
        const input = event.target.id; //Use id for button type

        //Check if the button press is valid (based on state of calc)
        const valid = this.is_valid_input(input);

        //If valid, add it and update state, if not do nothing
        if(valid)
        {
            console.log("Input validated")
            this.fire_input(input); //Add button to calc state, update calc state
            this.update_display(); //Update display to include new piece of calc string
        }
        else
        {
            //Do nothing, or provide some feedback
            //In my head, nothing will happen. Could also use calc state to turn off invalid buttons possibly
            console.log(input.id);
        }
    }

    //Checks the state of the calculator to see if the attempted addition can be done. Uses calc state obj
    //Called by and returns to button_press
    is_valid_input(input) 
    {
        console.log(input)
        //AC, CE, NonZeroNums are always valid
        switch(input)
        {
            case "0":
                return this.calcState.allowZero;
            case ".":
                return this.calcState.allowDecimal;
            case "%":
                return this.calcState.allowPercent;
            case "+": case "x": case "/":
                return this.calcState.allowOp;
            case "-":
                //Determine if op or neg
                return this.calcState.allowOp || this.calcState.allowNegative; //If op is allowed, the minus is an operator. If op isnt allowed, but negative is, then this can be placed as a negative. If neither are allowed, then dont validate (false)
            case "=":
                return this.allowEq;
            case "1": case "2": case "3": case "4": case "5": case "6" :case "7": case "8": case "9": case "AC": case "CE":
                return true;
            default:
                console.error("Unknown input, cannot validate");
                return false;
        }
    }

    //Takes a validated input, adds it to calc or executes it, then adjusts calc state based on input
    //Called by and returns to button_press
    fire_input(input)
    {
        //If AC is pressed, go back to default
        if(input === "AC")
        {
            console.log("Calling AC")
            return this.all_clear();
        }

        //If CE is pressed, revert to previous state
        else if(input === "CE")
        {
            console.log("Calling CE")
            return this.clear_entry();
        }

        //If eq is pressed, evaluate expression and place result in calc string
        else if(input === "=")
        {
            console.log("Calling eval")
            return this.evaluate_expression();
        }

        //If anything else is pressed, just add to calc string
        //I am not sure how I want to interface with calc_state obj yet
        else {
            console.log(`Adding ${input} to calcstr`)
            return this.update_calc_string(input);
        }
    }

    //Called when AC is pressed. Returns the calc to default state. History can be saved if the func is added
    //Currently called by fire_input and returns to button_press
    //TODO: Maybe fast track at the start of button_press since it is always valid
    all_clear() {
        //Revert calculator to default state
        this.calcState = new Calc_State(); //Revert to default, history can be added to ctor later
        console.log("All clear")
    }

    //Called when CE is pressed. Returns the calc to its previous state. (technically, deletes the last entered char, but this is synonymous with reverting to prior state)
    //Currently called from fire_input and returns to button press, but can fast track from button_press since its always valid
    //TODO: Consider fast tracking prior to input validation if this is pressed
    clear_entry() {
        if(!this.calcState.isDefault)
        {
            //Revert to previous calculator state, state updates on each valid entry
            this.calcState = this.calcState.prevState;
        }
        else
        {
            //Do nothing, or provide some kind of feedback, like a blink of the zero/screen
        }
    }

    //Called when the eq button can and is pressed, evaluates expression so result can be printed
    //Calc string will always be valid, actively parsed while being input, cant call = on invalid
    //Called from fire_input and returns to button_press
    evaluate_expression() {
        //History functionality: history entried will be added on successful call of evaluation, stored in calc state

        //WILL NEED TO UPDATE STATE HERE (Disallow decimal if already present for example)

        //Tokenize expression into numbers and operators, consider new data structure or use std array

        //Eval left to right multiplications/divisions

        //Eval left to right additions/subtractions
    }

    //Called at the end of fire_input. If the button press was an operator (not %), a dec, or a number, it is added to the calc string (AC and CE specifically dont add to calc string, % is similar to = in that it evaluates the string rather than adds to it)
    //Called from fire_input and returns to button_press
    update_calc_string(input)
    {
        //AC, CE, =, % not a part of this function as they are not added to calc string

        //Update state based on input type
        switch(input)
        {
            //OP type - Toggle operator allowed to off
            //Once an operator is placed, need a number before an additional operator can be placed
            //Allowed inputs after op: 0-9, -, AC, CE
            //Disallowed inputs: =, %, +, x, /, .,
            case "+": case "x": case "/":
                this.calcState.allowOp = false;
                this.calcState.allowEq = false;
                this.calcState.allowPercent = false;
                this.calcState.allowDecimal = false;

                this.calcState.allowZero = true;
                this.calcState.allowNegative = true;
                break;

            //Neg type - Toggle operator allowed to off, or neg to off if operator is already off
            //Determine if op or neg
            case "-":
                if(this.calcState.allowOp)
                {
                    this.calcState.allowOp = false;
                    this.calcState.allowEq = false;
                    this.calcState.allowPercent = false;
                    this.calcState.allowDecimal = false;
    
                    this.calcState.allowZero = true; 
                    this.calcState.allowNegative = true;
                }
                else
                {
                    //Negative is placed directly after an op usually, so change what isnt allowed, dont do anything else
                    //If we place a negative sign, we require the next input to be a number
                    this.calcState.allowNegative = false;
                }
                break;

            //Decimal type - Turn off everything except number entry 
            case ".":
                this.allowOP = false;
                this.allowNegative = false;
                this.allowEq = false;
                this.allowPercent = false;
                this.allowDecimal = false;

                this.allowZero = true;
                break;

            //Zero type - Make sure leading zeros are not allowed, divide by zero is allowed because js has the infinity keyword
            case "0":
                if(this.allowDecimal) //If a decimal is placed, no limit on zeros
                //Need to detect leading zeroes somehow
                {

                }
                else
                {

                }
                break;
            
            //Nonzero numbers - Not sure what gets changed yet
            default:
                this.allowOp = true;
                this.allowZero = true; //If a number has been placed, leading zeroes are not a consideration
                this.allowEq = true; //Eq is valid if the calc string ends in a number, everything is actively checked and allowed

                this.allowNegative = false;
                this.allowPercent = false; //Percent is only allowed post eval, pre edit

                this.allowDecimal = this.allowDecimal //Not sure if this should be changed yet, I think it is dependant on op placement and dec placement over number placement
                break;
        }

        this.calcState.calcString += input;
    }

    //Called from button press after a valid input has gone through. Places the current content of calc string into the calc screen content span element
    //Called from and returns to button_press
    update_display(input)
    {
        this.calcScreenContainer.innerText = this.calcState.calcString;
    }

    //Likely called from evaluate_expression
    tokenize_calc_string()
    {
        //Separates calc string into numbers and operators
    }


    //Evaluates a single operator
    operate(left, right, op) {
        let result = undefined;
        switch(op)
        {
            case "+":
                result = add(left, right);
                break;
            case "-":
                result = subtract(left, right);
                break;
            case "x":
                result = multiply(left, right);
                break;
            case "/":
                result = divide(left, right);
                break;
            default:
                console.error("Unknown operator")
                break;
        }

        return result;
    }

    add(left, right)
    {
        return Number(left + right);
    }

    subtract(left, right)
    {
        return Number(left - right);
    }

    multiply(left, right)
    {
        return Number(left * right);
    }

    divide(left, right)
    {
        if(Number(right) === 0)
        {
            return Infinity;
        }
        else
        {
            return Number(left/right);
        }
    }

    //CONSTANTS

    //Calculator buttons from top left to bottom right
    BUTTONS = () => ["AC", "CE", "", "/", "9", "8", "7", "x", "6", "5", "4", "-", "3", "2", "1", "+", "0", ".", "%", "="];
}


//Used by the Calculator obj to keep track of flags for active parsing
//Used to create the default state, edited completely by calculator obj
//Can add history to ctor later with a history obj
class Calc_State {
    //Default calc state
    constructor() {
        this.allowDecimal = true;
        this.allowNegative = true;
        this.allowZero = true;
        this.allowEq = true;
        this.allowOp = true;
        this.allowPercent = true;
        this.isDefault = true;
        this.calcString = "0"
        this.prevState = {};
    }
}


const calc = new Calculator();
calc.init(document.querySelector("#calculator-main"));






//Alt calculators/Styles


class Casio_SL300VC extends Calculator {
    constructor() {
        this.calcBody;
        this.calcHeader;
        this.calcScreenContainer;
        this.calcScreen;
        this.calcScreenContent;
        this.calcModel;
        this.calcButtonContainer;
        this.calcButtons;
    }

    BUTTONS = () => ["&radic;", "OFF", "MC", "MR", "M-", "M+", "&#247;", "%", "7", "8", "9", "x", "+/-", "4", "5", "6", "-", "C", "1", "2", "3", "+", "AC", "0", ".", "="]
}