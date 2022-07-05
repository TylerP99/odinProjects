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
        this.calcScreenContent.innerText = "Bana";
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

        //Update screen
        this.update_display();

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
        // Determine which button was pressed (stored as html id)
        const input = event.target.id;

        // Validation variable for end of function confirmation and generic input validation
        let valid = false;

        // AC and CE always fire without validation, call respective function
        if(input === "AC") {
            // Set valid to true since AC is always valid
            valid = true;

            // Call state reset
            this.all_clear();
        }
        else if(input === "CE") {
            // Set valid to true since CE is always valid
            valid = true;

            // Call state revert
            this.clear_entry();
        }
        else // Generic button press, validate against current calc state
        {
            valid = this.is_valid_input(input);

            // If valid, add to calc state
            if(valid)
            {
                this.fire_input(input);
            }
        }

        // Success message and user feedback
        if(valid)
        {
            console.log("Success!");
        }
        else
        {
            console.log("Failed!");
        }
    }

    //Checks the state of the calculator to see if the attempted addition can be done. Uses calc state obj
    //Called by and returns to button_press
    is_valid_input(input) 
    {
        console.log(`Validating ${input}`)
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
                return this.calcState.allowEq;
            case "1": case "2": case "3": case "4": case "5": case "6" :case "7": case "8": case "9": 
                return this.calcState.allowNonZero;
            // AC and CE check removed
            default:
                // If this gets called, it was probably AC or CE at this point
                console.error("Unknown input, cannot validate");
                return false;
        }
    }

    //Takes a validated input, adds it to calc or executes it, then adjusts calc state based on input
    //Called by and returns to button_press
    fire_input(input)
    {
        //If eq is pressed, evaluate expression and place result in calc string
        if(input === "=")
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
    all_clear() {
        //Revert calculator to default state
        this.calcState = new Calc_State(); //Revert to default, history can be added to ctor later
        console.log("All clear")
    }

    // Makes the screen disappear and reappear, one method of input feedback
    blink_screen() {
        this.calcScreenContent.classList.toggle("blink");
        setTimeout(this.unhide_screen_content.bind(this), 100)
    }

    // Used with blink screen to make content reappear
    unhide_screen_content() {
        this.calcScreenContent.classList.toggle("blink");
    }

    //Called when CE is pressed. Returns the calc to its previous state. (technically, deletes the last entered char, but this is synonymous with reverting to prior state)
    clear_entry() {
        if(!this.calcState.isDefault)
        {
            //Revert to previous calculator state, state updates on each valid entry
            this.calcState = this.calcState.prevState;
        }
    }

    //Called when the eq button can and is pressed, evaluates expression so result can be printed
    //Calc string will always be valid, actively parsed while being input, cant call = on invalid
    //Called from fire_input and returns to button_press
    evaluate_expression() {
        //History functionality: history entried will be added on successful call of evaluation, stored in calc state

        //WILL NEED TO UPDATE STATE HERE (Disallow decimal if already present for example)

        //Tokenize expression into numbers and operators, consider new data structure or use std array
        let tokenized_expression = this.tokenize_calc_string();

        //Eval left to right multiplications/divisions
        const mult_or_div = (x) => x === "x" || x === "/";
        const add_or_sub = (x) => x === "+" || x === "-";
        let currIndex = tokenized_expression.findIndex(mult_or_div);
        while(currIndex > -1)
        {
            console.log(tokenized_expression);
            let result = this.operate(tokenized_expression[currIndex-1], tokenized_expression[currIndex+1], tokenized_expression[currIndex]);
            result = String(result);

            tokenized_expression = tokenized_expression.slice(0, currIndex-1).concat(result).concat(tokenized_expression.slice(currIndex+2));

            currIndex = tokenized_expression.findIndex(mult_or_div);
        }

        //Eval left to right additions/subtractions
        currIndex = tokenized_expression.findIndex(add_or_sub);
        while(currIndex > -1)
        {
            console.log(tokenized_expression);
            let result = this.operate(tokenized_expression[currIndex-1], tokenized_expression[currIndex+1], tokenized_expression[currIndex]);
            result = String(result);

            tokenized_expression = tokenized_expression.slice(0, currIndex-1).concat(result).concat(tokenized_expression.slice(currIndex+2));

            currIndex = tokenized_expression.findIndex(add_or_sub);
        }

        console.log("Done")

        //Check result and set state (allow negative, decimal, etc)
        if(tokenized_expression[0] < 0)
        {
            //Negative not allowed
            this.calcState.allowNegative = false;
        }
        else
        {
            this.calcState.allowNegative = true;
        }
        if(tokenized_expression[0].search(".") > -1)
        {
            this.calcState.allowDecimal = false;
        }
        else
        {
            this.calcState.allowDecimal = true;
        }

        console.log(`Result: ${tokenized_expression}`);

        this.calcState.calcString = tokenized_expression[0];
    }

    // I wrote this but I no longer know what it does exactly
    //Likely called from evaluate_expression
    tokenize_calc_string()
    {
        //Separates calc string into numbers and operators
        let tokenized_expression = [];
        let currIndex = 0;

        while(currIndex < this.calcState.calcString.length)
        {
            const currChar = this.calcState.calcString[currIndex];
            if(currChar === "-")
            {
                if(currIndex === 0 || 
                   tokenized_expression[tokenized_expression.length-1] === "-" || 
                   tokenized_expression[tokenized_expression.length-1] === "+" ||
                   tokenized_expression[tokenized_expression.length-1] === "x" ||
                   tokenized_expression[tokenized_expression.length-1] === "/"
                )
                {
                    console.log("Negative");
                    const currCalcString = this.calcState.calcString.slice(currIndex+1); //Do not include negative sign
                    let sliceIndex = currCalcString.search(/[\+ \- \/ x]/);
                    if(sliceIndex === -1)
                    {
                        sliceIndex = currCalcString.length;
                    }
                    const num = currChar + currCalcString.slice(0, sliceIndex); //Append num to negative sign

                    tokenized_expression.push(num);

                    currIndex += num.length;
                }
                else
                {
                    console.log("Op")
                    tokenized_expression.push(currChar);
                    ++currIndex;
                }
            }
            else if(currChar === "x" || 
                    currChar === "/" || 
                    currChar === "+")
            {
                console.log("Op")
                tokenized_expression.push(currChar);
                ++currIndex;
            }
            else
            {
                console.log("Pos")
                const currCalcString = this.calcState.calcString.slice(currIndex);
                let sliceIndex = currCalcString.search(/[\+ \- \/ x]/);
                if(sliceIndex === -1)
                {
                    sliceIndex = currCalcString.length;
                }
                const num = currCalcString.slice(0, sliceIndex);

                tokenized_expression.push(num);

                currIndex += num.length;
            }
        }

        console.log("Returning");
        console.log(tokenized_expression);

        return tokenized_expression;
    }

    //Called at the end of fire_input. If the button press was an operator (not %), a dec, or a number, it is added to the calc string (AC and CE specifically dont add to calc string, % is similar to = in that it evaluates the string rather than adds to it)
    //Called from fire_input and returns to button_press
    update_calc_string(input)
    {
        //AC, CE, =, % not a part of this function as they are not added to calc string

        console.log(typeof input)
        //Update state based on input type
        switch(input)
        {
            //OP type - Toggle operator allowed to off
            //Once an operator is placed, need a number before an additional operator can be placed
            //Allowed inputs after op: 0-9, -, AC, CE
            //Disallowed inputs: =, %, +, x, /, .,
            case "+": case "x": case "/":
                console.log("OP State")
                this.calcState.allowOp = false;
                this.calcState.allowEq = false;
                this.calcState.allowPercent = false;
                this.calcState.allowDecimal = false;

                this.calcState.allowZero = true;
                this.calcState.allowNegative = true;
                this.calcState.allowNonZero = true;

                //Keep track of if an op was just placed to re-enable decimal once a num has been placed
                this.calcState.numAfterOp = true;
                break;

            //Neg type - Toggle operator allowed to off, or neg to off if operator is already off
            //Determine if op or neg
            case "-":
                if(this.calcState.allowOp)
                {
                    console.log("OP State")
                    this.calcState.allowOp = false;
                    this.calcState.allowEq = false;
                    this.calcState.allowPercent = false;
                    this.calcState.allowDecimal = false;
    
                    this.calcState.allowZero = true; 
                    this.calcState.allowNegative = true;
                    this.calcState.allowNonZero = true;
                    this.calcState.numAfterOp = true;

                }
                else
                {
                    console.log("Neg state")
                    //Negative is placed directly after an op usually, so change what isnt allowed, dont do anything else
                    //If we place a negative sign, we require the next input to be a number
                    this.calcState.allowNegative = false;
                }
                break;

            //Decimal type - Turn off everything except number entry 
            case ".":
                console.log("DEC State active");
                this.calcState.allowOp = false;
                this.calcState.allowNegative = false;
                this.calcState.allowEq = false;
                this.calcState.allowPercent = false;
                this.calcState.allowDecimal = false;

                this.calcState.allowZero = true;
                this.calcState.allowNonZero = true;
                break;

            //Zero type - Make sure leading zeros are not allowed, divide by zero is allowed because js has the infinity keyword
            case "0":
                console.log("ZERO State")
                if(this.calcState.isDefault)
                {
                    this.calcState.allowZero = false;
                    this.calcState.allowNonZero = false;
                }
                if(this.calcState.numAfterOp)
                {
                    this.calcState.numAfterOp = false;
                    this.calcState.allowZero = false;
                    this.calcState.allowNonZero = false;

                    this.calcState.allowDecimal = true;
                }
                this.calcState.allowOp = true;
                this.calcState.allowEq = true;
                this.calcState.allowNegative = false;
                this.calcState.allowPercent = false;
                this.calcState.allowDecimal = this.calcState.allowDecimal;
                
                break;
            
            //Nonzero numbers - Not sure what gets changed yet
            default:
                console.log("NUM State")
                if(this.calcState.numAfterOp)
                {
                    this.calcState.numAfterOp = false;

                    this.calcState.allowDecimal = true;
                }
                this.calcState.allowOp = true;
                this.calcState.allowZero = true; //If a number has been placed, leading zeroes are not a consideration
                this.calcState.allowEq = true; //Eq is valid if the calc string ends in a number, everything is actively checked and allowed

                this.calcState.allowNegative = false;
                this.calcState.allowPercent = false; //Percent is only allowed post eval, pre edit
                break;
        }


        //Change placeholder zero if needed
        if(this.calcState.isDefault && (input != "."))
        {
            console.log("Default state edited");
            //If calc string is changing, no longer default. Set back to true by AC or CE
            this.calcState.isDefault = false;

            //If the calc is in default, change placeholder zero to pressed input
            this.calcState.calcString = input;
        }
        else
        {
            console.log("Addings to calc string")
            this.calcState.isDefault = false;
            this.calcState.calcString += input;
        }
        console.log(this.calcState)
    }

    //Called from button press after a valid input has gone through. Places the current content of calc string into the calc screen content span element
    //Called from and returns to button_press
    update_display(input)
    {
        this.calcScreenContent.innerText = this.calcState.calcString;
    }


    // Helper / Util Functions

    // Determines if the given character is an operator ( +, -, /, x)
    is_op(char) {
        switch(char)
        {
            case "+": case "-": case "/": case "x":
                return true;
            default:
                return false;
        }
    }


    //Evaluates a single operator
    operate(left, right, op) {
        let result = undefined;
        left = Number(left);
        right = Number(right);
        switch(op)
        {
            case "+":
                result = this.add(left, right);
                break;
            case "-":
                result = this.subtract(left, right);
                break;
            case "x":
                result = this.multiply(left, right);
                break;
            case "/":
                result = this.divide(left, right);
                break;
            default:
                console.error("Unknown operator")
                break;
        }
        console.log(result)

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

// UPDATE: Will also handle all state setting instead of calc functions doing state setting
// There are some generic states, and some other ways of setting states ( AC is not a true reset, CE doesnt always revert)
// Should logically be separated from Calc class itself
class Calc_State {
    //Default calc state
    constructor() {
        // Validation flags
        this.allowDecimal = true; // Decimal can be placed immediately after placeholder zero
        this.allowEq = true; // Eq can be called on single numbers, like placeholder zero
        this.allowNonZero = true; // Any number can be placed
        this.allowOp = true; // Op can be placed after any digit
        this.allowPercent = true; // Idk what percent even does yet
        this.allowZero = true; // Any number can be placed

        // Other state flags
        this.isDefault = true; // Calc holds placeholder zero
        this.numAfterOp = false; // Tracks if an operator has just been placed
        
        // Other calc info
        this.calcString = "0" // Holds current calc screen data
        this.prevState = {}; // Holds the prior state for CE
    }

    set_op_state() {
        this.allowOp = false;
        this.allowEq = false;
        this.allowPercent = false;
        this.allowDecimal = false;
    
        this.allowZero = true; 
        this.allowNegative = true;
        this.allowNonZero = true;
        this.numAfterOp = true;
    }

    set_neg_state() {
        // Negative state can only be set right after an operator, so the only edit required is to disallow negative
        this.allowNegative = false;
    }

    set_nonzero_state() {
        console.log("NUM State")
        if(this.numAfterOp)
        {
            this.numAfterOp = false;

            this.allowDecimal = true;
        }
        this.allowOp = true;
        this.allowZero = true; //If a number has been placed, leading zeroes are not a consideration
        this.allowEq = true; //Eq is valid if the calc string ends in a number, everything is actively checked and allowed

        this.allowNegative = false;
        this.allowPercent = false; //Percent is only allowed post eval, pre edit
    }

    set_zero_state() {
        console.log("ZERO State")
        if(this.isDefault)
        {
            this.allowZero = false;
            this.allowNonZero = false;
        }
        if(this.numAfterOp)
        {
            this.numAfterOp = false;
            this.allowZero = false;
            this.allowNonZero = false;
            this.allowDecimal = true;
        }
        this.allowOp = true;
        this.allowEq = true;
        this.allowNegative = false;
        this.allowPercent = false;
    }

    set_decimal_state() {
        console.log("DEC State active");
        this.calcState.allowOp = false;
        this.calcState.allowNegative = false;
        this.calcState.allowEq = false;
        this.calcState.allowPercent = false;
        this.calcState.allowDecimal = false;

        this.calcState.allowZero = true;
        this.calcState.allowNonZero = true;
    }
}


const calc = new Calculator();
calc.init(document.querySelector("#calculator-main"));






//Alt calculators/Styles


class Casio_SL300VC extends Calculator {
    constructor() {
        super();

        //New Properties
        this.calcHeader;
        this.calcLogo;
        this.calcSolarContainer;
        this.calcSolarPanel;
        this.calcSolarLabel;
        this.calcScreen;
        this.calcModel;
    }

    create_HTML() {
        // Create Body
        this.calcContainer = document.createElement("div");
        this.calcContainer.id = "calculator-container";

        // Create header
        this.calcHeader;
        this.calcLogo;
        this.calcSolarContainer;
        this.calcSolarPanel;
        this.calcSolarLabel;
        

        // Create Screen
        this.calcScreenContainer;
        this.calcScreen;
        this.calcScreenContent;

        // Create Buttons
        this.calcButtonContainer;
        this.calcButtons = [];
    }

    BUTTONS = () => ["&radic;", "OFF", "MC", "MR", "M-", "M+", "&#247;", "%", "7", "8", "9", "x", "+/-", "4", "5", "6", "-", "C", "1", "2", "3", "+", "AC", "0", ".", "="]
}