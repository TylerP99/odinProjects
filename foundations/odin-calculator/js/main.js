// Will make calculator "widget"
//Can create a calculator "element" with js logic

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

    button_press(event) {
        //What should happen each button press?
        //Check if the button press is valid (based on state of calc)

        //If valid, add it and update state, if not do nothing
    }

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