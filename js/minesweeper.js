// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - GAME MANAGER
// ==============================================================

const GameManager = {
    gameDifficulties: [
        {
            difficulty: "Easy",
            minesToPlace : 10,
            rows : 8,
            columns : 10,
            heightSizeRow : "8.75vh",
            widthSizeCell : "6vw",
            heightSizeCell : "8.75vh"
        }, {
            difficulty: "Normal",
            minesToPlace : 40,
            rows : 14,
            columns : 18,
            heightSizeRow : "5vh",
            widthSizeCell : "4.6vw",
            heightSizeCell : "5vh"
        }, {
            difficulty: "Hard",
            minesToPlace : 99,
            rows : 20,
            columns : 24,
            heightSizeRow : "3.5vh",
            widthSizeCell : "2.5vw",
            heightSizeCell : "3.5vh"
        }
    ],
    zeroCellsChecked : [],
    actualDifficulty : "Hard"
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - TIMER
// ==============================================================

let timer;

const StartTimer = () => {
    document.getElementById("timerTime").innerHTML = 0;
    timer = setInterval(UpdateTimer, 1000);
}

const StopTimer = () => {
    clearInterval(timer);
}

const UpdateTimer = () => {
    const timerValue = document.getElementById("timerTime");
    let time = parseInt(timerValue.innerHTML);
    timerValue.innerHTML = (time+1).toString()
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - RESET MAP
// ==============================================================

const NewFieldGenerator = (difficulty) => {
    const field = document.getElementById("field");

    const difficultyData = GameManager.gameDifficulties.find(level => level.difficulty === difficulty);

    CreateBoard(field, difficultyData.rows, difficultyData.columns);

    const cells = document.getElementsByClassName("cell");
    GameManager.zeroCellsChecked = [];

    SetMinesIntoField(difficultyData.minesToPlace, cells, difficultyData.rows * difficultyData.columns)
    SetClasesIntoCells(cells, difficultyData.rows, difficultyData.columns);
    SetClickerEventsIntoCells(cells, difficultyData);
    document.getElementById("flagsCounter").innerHTML = difficultyData.minesToPlace;
}

// ==============================================================
// GENERATION OF MINESWEEPER FIELD INSIDE THE CONTAINER
// ==============================================================

const CreateBoard = (field, rows, columns) => {
    // Create a table element 
    let ChessTable = document.createElement('div'); 
    ChessTable.setAttribute('id', 'tableField');
    for (let i = 0; i < rows; i++) { 
        let row = document.createElement('div'); 
        row.setAttribute('id', 'tableRow');
        row.setAttribute('class', 'rowField');

        for (let j = 0; j < columns; j++) { 
            // Create a cell 
            let cell = document.createElement('div');
            cell.setAttribute('id', 'cell_'+(([i,j]).toString()));

            if ((i + j) % 2 == 0) { 
                cell.setAttribute('class', 'cell lightGreenCell'); 
                row.appendChild(cell); 
            } else { 
                cell.setAttribute('class', 'cell greenCell'); 
                row.appendChild(cell); 
            } 
        } 

        ChessTable.appendChild(row); 
    }

    field.appendChild(ChessTable);
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET MINES
// ==============================================================

const SetMinesIntoField = (minesToPlace, cellList, totalCells) => {
    while(minesToPlace > 0){
        let randCell = Math.floor(Math.random() * totalCells);
        if(!cellList[randCell].classList.contains("mine")){
            cellList[randCell].classList.add("mine");
            minesToPlace--;
        }
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET NUMBERS MINES AROUND
// ==============================================================

const SetClasesIntoCells = (cellList, rows, columns) => {
    for(let i = 0; i < cellList.length; i++){
        if(!cellList[i].classList.contains("mine")){
            let minesAround = 0;
            let cellsAround = GetListCellsAround(i, rows, columns);
            for(let j=0; j<cellsAround.length; j++){
                if(cellList[cellsAround[j]].classList.contains("mine")){
                    minesAround++;
                }
            }
            cellList[i].classList.add("minesAround-"+minesAround.toString());
        }
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET CLICKERS FOR EACH CELL
// ==============================================================

const SetClickerEventsIntoCells = (cellList, difficultyData) => {
    const arrayCells = Array.from(cellList);

    arrayCells.forEach(item => {
        item.addEventListener("mousedown", (e) => {
            switch(e.button){
                case 0:
                    if(e.target.innerHTML === ''){
                        let classes = Array.from(e.target.classList);
                        let numMines;
                        for(let i=0; i<classes.length; i++){
                            (classes[i].includes("minesAround-")) ? numMines = parseInt(classes[i].slice(-1)) : numMines = "mine";
                        }
                        switch(numMines){
                            case "mine":
                                StopTimer();
                                LostGame(e.target.id, arrayCells, difficultyData.minesToPlace);
                                break;
                            default:
                                FlippingCells(e.target.id);
                                if(numMines == 0){
                                    FlipCellsAroundEqualToZero(e.target.id, cellList, difficultyData)
                                }
                                CheckWinGame(difficultyData);
                            break;
                        }
                    }
                    break;
                case 2:
                    let flagCounter = parseInt(document.getElementById("flagsCounter").innerHTML);
                    if(!e.target.innerHTML && flagCounter > 0){
                        e.target.innerHTML='<i class="bi bi-flag-fill"></i>';
                        document.getElementById("flagsCounter").innerHTML = (flagCounter - 1).toString();
                    } else if(e.target.innerHTML){
                        e.target.innerHTML='';
                        document.getElementById("flagsCounter").innerHTML = (flagCounter + 1).toString();
                    }
                    break;
            }
        })
    })
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - LOST GAME
// ==============================================================

const LostGame = (mineClickedID, arrayCells, mines) => {
    let listMines = [];
    arrayCells.forEach(item => {
        if(item.classList.contains("mine")){
            (mineClickedID == item.id) ? listMines.unshift(item) : listMines.push(item);
        }
    })

    //First mine clicked
    listMines[0].innerHTML = '<i class="bi bi-crosshair"></i>';
    listMines.shift();

    const ShowMineIcon = (cell) => {
        cell.innerHTML = '<i class="bi bi-crosshair"></i>';
    }

    let index = 0;
    const showNextMine = () => {
        if (index < mines-1) {
            const randomPos = Math.floor(Math.random() * listMines.length);
            // Block click events
            document.addEventListener('mousedown', blockClicks, true);
            setTimeout(() => {
                const mineAudioPlayer = document.getElementById("audioBombs");
                mineAudioPlayer.play();
                ShowMineIcon(listMines[randomPos]);
                listMines.splice(randomPos, 1);
                showNextMine(); // Call the function recursively for the next mine
            }, 100);
            index++;
        } else {
            // Handle the end of the loop here if needed
            const lostGameTitle = document.getElementById("lostWinTitle");
            lostGameTitle.innerHTML = '<img src="./img/loose.png">';
            const divReset = document.getElementById("restartGame");
            divReset.style.display = "flex";

            document.removeEventListener('mousedown', blockClicks, true);
        }
    }

    // Event handler to block clicks
    function blockClicks(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    showNextMine(); // Start the loop
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - WIN GAME
// ==============================================================

const CheckWinGame = (difficultyData) => {
    const cells = document.getElementsByClassName("cell");
    let counterCellsFliped = 0;
    for(let i = 0; i < cells.length; i++){
        if(/clickedCell/.test(cells[i].classList)){
            counterCellsFliped++;
        }
    }
    if(counterCellsFliped == (difficultyData.rows * difficultyData.columns) - difficultyData.minesToPlace){
        StopTimer();
        const winGameTitle = document.getElementById("lostWinTitle");
        winGameTitle.innerHTML = '<img src="./img/win.png">'
        const divReset = document.getElementById("restartGame");
        divReset.style.display = "flex";
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - FLIP CELL AND ADD CONTENT IF IS NECESSARY
// ==============================================================

const FlippingCells = (cell) => {
    const cellClicked = document.getElementById(cell);
    let classListCell = cellClicked.classList;
    for(let i = 0; i < classListCell.length; i++){
        if(parseInt(classListCell[i].slice(-1)) && parseInt(classListCell[i].slice(-1)) > 0){
            let num = classListCell[i].slice(-1);
            classListCell.add("minesAround"+num);
            cellClicked.innerHTML = num;
        }
    }
    for(let i = 0; i < cellClicked.classList.length; i++){
        if(cellClicked.classList[i].match("lightGreenCell")){
            cellClicked.classList.remove("lightGreenCell")
            cellClicked.classList.add("clickedCellLightGreen");
        } else if (cellClicked.classList[i] == "greenCell"){
            cellClicked.classList.remove("greenCell")
            cellClicked.classList.add("clickedCellGreen");
        }
        
    }
    cellClicked.style.pointerEvents = "none";
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - MATRIX CELLS AROUND CELL
// ==============================================================

let GetListCellsAround = (index, rows, columns) => {
    let cellsAround;

    if(index == 0){
        cellsAround = [index+1, index+columns, index+columns+1];
    } else if (index == columns-1){
        cellsAround = [index-1, index+columns-1, index+columns];
    } else if (index == rows*columns-columns){
        cellsAround = [index-columns, index-columns-1, index+1];
    } else if (index == rows*columns-1){
        cellsAround = [index-columns-1, index-columns, index-1];
    } else if (index > 0 && index < columns-1){
        cellsAround = [index-1, index+1, index+columns-1, index+columns, index+columns+1];
    } else if (index > rows*columns-columns && index < rows*columns-1){
        cellsAround = [index-columns-1, index-columns, index-columns+1, index-1, index+1];
    } else if (index > 0 && index % columns == 0 && index < rows*columns-columns){
        cellsAround = [index-columns, index-columns+1, index+1, index+columns, index+columns+1];
    } else if (index > columns-1 && index % columns == columns-1 && index < rows*columns-1){
        cellsAround = [index-columns-1, index-columns, index-1, index+columns-1, index+columns];
    } else {
        cellsAround = [index-columns-1, index-columns, index-columns+1, index-1, index+1, index+columns-1, index+columns, index+columns+1];
    }

    return cellsAround;
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - FLIPPING CELLS AROUND WHEN CELL IS ZERO
// ==============================================================

const FlipCellsAroundEqualToZero = (cell, cellList, difficultyData) => {
    let cellID = document.getElementById(cell);
    let arrCellsToCheck = [];
    for(let i = 0; i < cellList.length; i++){
        if(cellList[i].id == cellID.id){
            let cellsAround = GetListCellsAround(i, difficultyData.rows, difficultyData.columns);
            for(let j = 0; j <= cellsAround.length; j++){
                if(cellList[cellsAround[j]] != undefined && !GameManager.zeroCellsChecked.includes(cellList[cellsAround[j]].id)){
                    if(cellList[cellsAround[j]].classList.contains("minesAround-0")){
                        FlippingCells(cellList[cellsAround[j]].id);
                        arrCellsToCheck.push(cellList[cellsAround[j]].id);
                    } else if(/minesAround-/.test(cellList[cellsAround[j]].classList)){
                        FlippingCells(cellList[cellsAround[j]].id);
                    }
                }
            }
            GameManager.zeroCellsChecked.push(cellList[i].id);
        }
    }
    if(arrCellsToCheck.length >= 1){
        for(let k = 0; k < arrCellsToCheck.length; k++){
            FlipCellsAroundEqualToZero(arrCellsToCheck[k], cellList, difficultyData);
        }
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - RESET BUTTON
// ==============================================================

const resetButton = document.getElementById("buttonRestart");
const difficultyData = GameManager.gameDifficulties.find(level => level.difficulty === GameManager.actualDifficulty);

resetButton.addEventListener("click", (e) => {
    const field = document.getElementById("field");
    field.removeChild(document.getElementById("tableField"));
    const divReset = document.getElementById("restartGame");
    divReset.style.display = "none";
    document.getElementById("lostWinTitle").innerHTML = '';
    document.getElementById("flagsCounter").innerHTML = difficultyData.minesToPlace;

    NewFieldGenerator(GameManager.actualDifficulty);
    ChangeSizeBoard(GameManager.actualDifficulty);
    StartTimer();
})

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - CHANGE DIFFICULTY
// ==============================================================

const ChangeDifficulty = (difficulty) => {
    const difficultyData = GameManager.gameDifficulties.find(level => level.difficulty === difficulty);
    GameManager.actualDifficulty = difficulty;

    const field = document.getElementById("field");
    field.removeChild(document.getElementById("tableField"));

    document.getElementById("lostWinTitle").innerHTML = '';
    document.getElementById("flagsCounter").innerHTML = difficultyData.minesToPlace;

    NewFieldGenerator(difficulty);
    ChangeSizeBoard(difficulty);
    StopTimer();
    StartTimer();
}

// ==============================================================
// ESTETIC FUNCTION - RESIZE BOARD DYNAMICALLY
// ==============================================================

const ChangeSizeBoard = (difficulty) => {
    const cells = document.getElementsByClassName("cell");
    const arrayCells = Array.from(cells);
    const rows = document.getElementsByClassName("rowField");
    const arrayRows = Array.from(rows);
    const difficultyData = GameManager.gameDifficulties.find(level => level.difficulty === difficulty)

    let heightSizeRow = difficultyData.heightSizeRow;
    let widthSizeCell = difficultyData.widthSizeCell;
    let heightSizeCell = difficultyData.heightSizeCell;

    arrayRows.forEach(item => {
        item.style.height = heightSizeRow;
    })

    arrayCells.forEach(item => {
        item.style.height = heightSizeCell;
        item.style.width = widthSizeCell;
    })
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - MAIN
// ==============================================================

NewFieldGenerator("Hard");
StartTimer();