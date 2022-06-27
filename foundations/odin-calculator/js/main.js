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
    }

    init(DOM_target) {
        //Places calculator in the dom, starts calc logic loop
        //Add calculator to the dom, event listeners added in ctor, nothing else this func has to do that wasnt handled in ctor. Maybe ill add event listeners here, i need to think
    }

    button_press(event) {
        //What should happen each button press?
        //First, figure out what button was pressed
        const input = event.target.innerText; //Either will used innerText or an id

        //Check if the button press is valid (based on state of calc)
        const valid = is_valid_input(input);

        //If valid, add it and update state, if not do nothing
        if(valid)
        {
            update_calc_string(input);
            update_display();
        }
        else
        {
            //Do nothing, or provide some feedback
        }
    }

    //Checks the state of the calculator to see if the attempted addition can be done
    is_valid_input(input) 
    {
        //AC, CE, NonZeroNums are always valid
        switch(input)
        {
            case "0":
                break;
            case ".":
                break;
            case "%":
                break;
            case "+": case "x": case "/":
                break;
            case "-":
                //Determine if op or neg
                break;
            case "=":
                break;
        }
    }

    update_calc_string(input)
    {
        //If AC is pressed, go back to default

        //If CE is pressed, revert to previous state

        //If eq is pressed, evaluate expression and place result in calc string

        //If anything else is pressed, just add to calc string
        //I am not sure how I want to interface with calc_state obj yet
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