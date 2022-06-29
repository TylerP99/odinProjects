// Will make calculator "widget"
// Can create a calculator "element" with js logic
// Usage: Create calculator with new Calculator, call init method and pass dom target where calc will be added as a child to the dom
class Calculator {
    constructor() {
        //What should this try to accomplish? Build the whole calculator here? Html and such? Add the css? Turn on logic? Yeah probably

        //Create HTML to place in dom, add styles as needed, should be pretty barebones
        //Outer container
        this.calcContainer;

        this.calcScreenContainer; 

        this.calcScreenContent;

        this.calcButtonContainer;

        this.calcButtons = [];

        this.calcState = new Calc_State();

        //Turn on js parsing and such (event listeners and the like)
        this.create_HTML();
        this.activate_event_listening();
    }


    init(DOM_target) {
        //Places calculator in the dom, starts calc logic loop
        //Add calculator to the dom, event listeners added in ctor, nothing else this func has to do that wasnt handled in ctor. Maybe ill add event listeners here, i need to think
        DOM_target.appendChild(this.calcContainer);
    }

    create_HTML() {
        //Create HTML to place in dom, add styles as needed, should be pretty barebones
        //Outer container
        this.calcContainer = document.createElement("div");
        this.calcContainer.id ="calculator-container";

        this.calcScreenContainer = document.createElement("div");
        this.calcScreenContainer.id = "calculator-screen";

        this.calcScreenContent = document.createElement("span");
        this.calcScreenContent.id = "calculator-screen-content";
        this.calcScreenContainer.appendChild(this.calcScreenContent);

        this.calcButtonContainer = document.createElement("div");
        this.calcButtonContainer.id = "calculator-button-container";

        const buttons = this.BUTTONS();

        for(let i = 0; i < buttons.length; ++i)
        {
            let newButton = document.createElement("div");
            newButton.classList.add("button");
            newButton.innerText = buttons[i];
            newButton.id = String(buttons[i]);
            this.calcButtonContainer.appendChild(newButton);
            this.calcButtons.push(newButton);
        }

        this.calcContainer.appendChild(this.calcScreenContainer);
        this.calcContainer.appendChild(this.calcButtonContainer);
    }

    activate_event_listening() {
        this.calcButtons.forEach( x => x.addEventListener("click", this.button_press.bind(this)))
    }

    button_press(event) {
        //What should happen each button press?
        //First, figure out what button was pressed
        const input = event.target; //Either will used innerText or an id

        //Check if the button press is valid (based on state of calc)
        const valid = this.is_valid_input(input);

        //If valid, add it and update state, if not do nothing
        if(valid)
        {
            this.fire_input(input);
            this.update_display();
        }
        else
        {
            //Do nothing, or provide some feedback
            console.log(input.id);
        }
    }

    //Checks the state of the calculator to see if the attempted addition can be done
    is_valid_input(input) 
    {
        console.log(input)
        //AC, CE, NonZeroNums are always valid
        switch(input.id)
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
                return this.calcState.allowOp || this.calcState.allowNegative;
            case "=":
                return this.allowEq;
            case "1": case "2": case "3": case "4": case "5": case "6" :case "7": case "8": case "9":
                return true;
            default:
                console.error("Unknown input, cannot validate");
                return false;
        }
        return true;
    }

    clear_entry() {
        //If default, do nothing
        if(this.calcState.isDefault)
        {
            //Do nothing
        }
        else
        {
            //Revert to previous calculator state, state updates on each valid entry
        }
    }

    all_clear() {
        //Revert calculator to default state
    }

    fire_input(input)
    {
        //If AC is pressed, go back to default
        if(input === "AC")
        {
            return this.all_clear();
        }

        //If CE is pressed, revert to previous state
        if(input === "CE")
        {
            return this.clear_entry();
        }

        //If eq is pressed, evaluate expression and place result in calc string
        if(input === "=")
        {
            return this.evaluate_expression();
        }

        //If anything else is pressed, just add to calc string
        //I am not sure how I want to interface with calc_state obj yet
        return this.update_calc_string(input);
    }

    update_calc_string(input)
    {
        this.calcState.calcString += input.id;
    }

    update_display(input)
    {
        this.calcScreenContainer.innerText = this.calcState.calcString;
    }

    tokenize_calc_string()
    {
        //Separates calc string into numbers and operators
    }

    //Called when the eq button can and is pressed, evaluates expression so result can be printed
    //Calc string will always be valid, actively parsed while being input, cant call = on invalid
    evaluate_expression() {
        //Tokenize expression into numbers and operators, consider new data structure or use std array

        //Eval left to right multiplications/divisions

        //Eval left to right additions/subtractions
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

    BUTTONS = () => ["AC", "CE", "", "/", "9", "8", "7", "x", "6", "5", "4", "-", "3", "2", "1", "+", "0", ".", "%", "="];
}

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