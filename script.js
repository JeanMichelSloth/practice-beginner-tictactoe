const EMPTY_SYMBOL = "";
const PLAYER_SYMBOL = "X";
const BOT_SYMBOL = "O";
const PLAYER_NAME = "Player";
const BOT_NAME = "Bot";
const CELL_UNAVALAIBLE_MSG = "Cell already checked ! Choose an other one !";
const GAME_OVER_MSG = "Game is over !";
const NO_WINNER_MSG = "Noone wins this one !";

const playAgainButton = document.getElementById('play-again-btn');

let actualSymbol = PLAYER_SYMBOL;// Player first !
let gameCells;
let availableGameCellIds;
let gameIsOver = false;

initGameCells();

function initGameCells() {
    gameCells = [];
    
    for(i = 1; i < 10; i++) {
        gameCells.push({id: i.toString(), value: EMPTY_SYMBOL});
    }

    availableGameCellIds = gameCells.map(cell => cell.id);
}

function playerPlays(cellId) {
    if(gameIsOver) {
        displayMessageGameIsOver();
        return;
    }

    if(!checkCellIsAvailable(cellId)) {
        displayMessageCellUnavailable();
        return;
    }

    fillCellAndUpdateGame(cellId);

    if(checkWin()) {
        displayWinMessage(getWinner());
        endTheGame();
        return;
    }

    if(checkDraw()) {
        displayDrawMessage();
        endTheGame();
        return;
    }

    changePlayer();

    if(itsBotTurnToPlay()){
        botPlays();
    }
}

function checkCellIsAvailable(cellId) {
    return availableGameCellIds.includes(cellId);
}

function fillCellAndUpdateGame(cellId) {
    updateGameCells(cellId);
    removeCellIdfromAvailableCellIds(cellId);
    fillDisplayedCell(cellId)
}

function updateGameCells(cellId) {
    gameCells.find(cell => cell.id === cellId).value = actualSymbol;
}

function removeCellIdfromAvailableCellIds(cellId) {
    availableGameCellIds = availableGameCellIds.filter(id => id !== cellId);
}

function fillDisplayedCell(cellId) {
    document.getElementById(cellId).innerHTML = actualSymbol;  
}

function checkWin() {

    const WIN_COMBOS = [
        //horizontal
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        // vertical
        ["1", "4", "7"],
        ["2", "5", "8"],
        ["3", "6", "9"],
        //diagonal
        ["1", "5", "9"],
        ["3", "5", "7"]
    ];

    // NOTE : forEach bugs because of return only exiting
    for(i = 0; i < WIN_COMBOS.length; i++) {
        const combo = WIN_COMBOS[i];
        const symbol1 = gameCells.find(cell => cell.id === combo[0]).value;

        if(symbol1 === actualSymbol) {
            const symbol2 = gameCells.find(cell => cell.id === combo[1]).value;

            if(symbol2 === actualSymbol) {
                const symbol3 = gameCells.find(cell => cell.id === combo[2]).value;

                if(symbol3 === actualSymbol) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getWinner() {
    return (actualSymbol === PLAYER_SYMBOL) ? PLAYER_NAME : BOT_NAME;
}

function endTheGame() {
    gameIsOver = true;
    showPlayAgainButton();
}

function displayWinMessage(winner) {
    alert(`${winner} wins the game !`);
}

function showPlayAgainButton() {
    playAgainButton.hidden = false;
}

function checkDraw() {
    return availableGameCellIds.length === 0;
}

function displayDrawMessage() {
    alert(NO_WINNER_MSG);
}

function hidePlayAgainButton() {
    playAgainButton.hidden = true;
}

function changePlayer() {
    actualSymbol = (actualSymbol === PLAYER_SYMBOL) ? BOT_SYMBOL : PLAYER_SYMBOL;
}

function itsBotTurnToPlay() {
    return actualSymbol === BOT_SYMBOL;
}

function botPlays() {
    let randomAvailableCellIdIndex = Math.floor(Math.random()*availableGameCellIds.length);
    let randomAvailableCellId = availableGameCellIds[randomAvailableCellIdIndex];
    
    fillCellAndUpdateGame(randomAvailableCellId);
    
    if(checkWin()) {
        displayWinMessage(getWinner());
        endTheGame();
        return;
    }

    if(checkDraw()) {
        displayDrawMessage();
        endTheGame();
        return;
    }

    changePlayer();
}

function displayMessageCellUnavailable() {
    alert(CELL_UNAVALAIBLE_MSG);
}

function displayMessageGameIsOver() {
    alert(GAME_OVER_MSG);
}

function resetGame() {
    gameIsOver = false;
    emptyAllCellsDisplayed();
    initGameCells();
    hidePlayAgainButton();
}

function emptyAllCellsDisplayed() {
    gameCells.forEach(cell => {
        document.getElementById(cell.id).innerHTML = EMPTY_SYMBOL;
    });
}