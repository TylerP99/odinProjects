
// Randomly chooses rock, paper, or scissors, and returns the choice
function computerPlay() {
    const randInt = Math.floor(Math.random()*3);

    switch(randInt) {
        case 0:
            return "rock";
        case 1:
            return "paper";
        case 2:
            return "scissors";
        default:
            console.error("Random number out of range, fix it Tyler...");
            break;
    }
    return;
}


function playRound(playerChoice, computerChoice = computerPlay())
{
    //Format inputs to work case-insensitive. compuerChoice is preformatted
    playerChoice = playerChoice.toLowerCase();

    console.log("Computer chose: " + computerChoice)

    if(playerChoice == computerChoice) //Check Tie
    {
        return -1;
    }
    else
    {
        switch(playerChoice) { //Check Loss
            case "rock":
                if(computerChoice == "paper")
                {
                    return 0;
                }break;

    
            case "paper":
                if(computerChoice == "scissors")
                {
                    return 0;
                }
                break;
    
            case "scissors":
                if(computerChoice == "rock")
                {
                    return 0;
                }
                break;

            default:
                console.error("If you see this, something bad happened...");
                console.log(playerChoice)
                break;
        }
        //Wins!
        return 1;
    }
}


//Plays a best three out of five game of rock paper scissors
function game() {
    let playerWinCount = 0;
    let computerWinCount = 0;

    for(let i = 0; i < 5; ++i)
    {
        const playerChoice = prompt("Enter 'rock', 'paper', or 'scissors'.");

        const result = playRound(playerChoice);

        switch(result) {
            case -1:
                console.log("Tie");
                --i;
                break;
            case 0:
                console.log("You lose...");
                ++computerWinCount
                break;
            case 1:
                console.log("You win!!!");
                ++playerWinCount;
                break;
        }

        if(playerWinCount >= 3 || computerWinCount >= 3)
        {
            break;
        }
    }

    if(playerWinCount > computerWinCount)
    {
        console.log(`You win!!!\nScore: ${playerWinCount} : ${computerWinCount}`);
    }
    else
    {
        console.log(`You lose...\nScore: ${playerWinCount} : ${computerWinCount}`);
    }

    return true;
}

game();