
// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - FLIPPING CELLS
// ==============================================================

let zeroCellsChecked = [];

let GetListCellsAround = (index) => {
    let cellsAround;

    if(index == 0){
        cellsAround = [index+1, index+24, index+25];
    } else if (index == 23){
        cellsAround = [index-1, index+23, index+24];
    } else if (index == 456){
        cellsAround = [index-24, index-23, index+1];
    } else if (index == 479){
        cellsAround = [index-25, index-24, index-1];
    } else if (index > 0 && index < 23){
        cellsAround = [index-1, index+1, index+23, index+24, index+25];
    } else if (index > 456 && index < 479){
        cellsAround = [index-25, index-24, index-23, index-1, index+1];
    } else if (index > 0 && index % 24 == 0 && index < 456){
        cellsAround = [index-24, index-23, index+1, index+24, index+25];
    } else if (index > 23 && index % 24 == 23 && index < 479){
        cellsAround = [index-25, index-24, index-1, index+23, index+24];
    } else {
        cellsAround = [index-25, index-24, index-23, index-1, index+1, index+23, index+24, index+25];
    }

    return cellsAround;
}

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

const FlipCellsAroundEqualToZero = (cell, cellList) => {
    let cellID = document.getElementById(cell);
    let arrCellsToCheck = [];
    for(let i = 0; i < cellList.length; i++){
        if(cellList[i].id == cellID.id){
            let cellsAround = GetListCellsAround(i);
            for(let j = 0; j <= cellsAround.length; j++){
                if(cellList[cellsAround[j]] != undefined && !zeroCellsChecked.includes(cellList[cellsAround[j]].id)){
                    if(cellList[cellsAround[j]].classList.contains("minesAround-0")){
                        FlippingCells(cellList[cellsAround[j]].id);
                        arrCellsToCheck.push(cellList[cellsAround[j]].id);
                    } else if(/minesAround-/.test(cellList[cellsAround[j]].classList)){
                        FlippingCells(cellList[cellsAround[j]].id);
                    }
                }
            }
            zeroCellsChecked.push(cellList[i].id);
        }
    }
    if(arrCellsToCheck.length >= 1){
        for(let k = 0; k < arrCellsToCheck.length; k++){
            FlipCellsAroundEqualToZero(arrCellsToCheck[k], cellList);
        }
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - LOST GAME
// ==============================================================

const LostGame = (mineClickedID, arrayCells) => {
    let listMines = [];
    arrayCells.forEach(item => {
        if(item.classList.contains("mine")){
            (mineClickedID == item.id) ? listMines.unshift(item) : listMines.push(item);
        }
    })
    //First mine clicked
    listMines[0].innerHTML = '<i class="bi bi-crosshair"></i>';
    listMines.shift();

    while(listMines.length > 0){
        let randomPos = Math.floor(Math.random() * listMines.length);
        listMines[randomPos].innerHTML = '<i class="bi bi-crosshair"></i>';
        listMines.splice(randomPos, 1);
    }

    const divReset = document.getElementById("restartGame");
    divReset.style.display = "flex";
}

// ==============================================================
// GENERATION OF MINESWEEPER FIELD INSIDE THE CONTAINER
// ==============================================================

const CreateBoard = (field) => {
    // Create a table element 
    let ChessTable = document.createElement('div'); 
    ChessTable.setAttribute('id', 'tableField');
    for (let i = 0; i < 20; i++) { 
        let row = document.createElement('div'); 
        row.setAttribute('id', 'tableRow');

        for (let j = 0; j < 24; j++) { 
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

const SetMinesIntoField = (minesToPlace, cellList) => {
    while(minesToPlace > 0){
        let randCell = Math.floor(Math.random() * 480);
        if(!cellList[randCell].classList.contains("mine")){
            cellList[randCell].classList.add("mine");
            minesToPlace--;
        }
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET NUMBERS MINES AROUND
// ==============================================================

const SetClasesIntoCells = (cellList) => {
    for(let i = 0; i < cellList.length; i++){
        if(!cellList[i].classList.contains("mine")){
            let minesAround = 0;
            let cellsAround = GetListCellsAround(i);
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
// FUNCTIONALITIES OF THE MINESWEEPER - RESET MAP
// ==============================================================

const NewFieldGenerator = () => {
    const field = document.getElementById("field");

    CreateBoard(field);

    let minesToPlace = 99;
    const cells = document.getElementsByClassName("cell");

    SetMinesIntoField(minesToPlace, cells)
    SetClasesIntoCells(cells);
    SetClickerEventsIntoCells(cells);
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET CLICKERS FOR EACH CELL
// ==============================================================

const SetClickerEventsIntoCells = (cellList) => {
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
                                LostGame(e.target.id, arrayCells);
                                break;
                            default:
                                FlippingCells(e.target.id);
                                if(numMines == 0){
                                    FlipCellsAroundEqualToZero(e.target.id, cellList)
                                }
                                //WinGame();
                            break;
                        }
                    }
                    break;
                case 2:
                    if(!e.target.innerHTML){
                        e.target.innerHTML='<i class="bi bi-flag-fill"></i>';
                    } else {
                        e.target.innerHTML='';
                    }
                    break;
            }
        })
    })
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - RESET BUTTON
// ==============================================================

const resetButton = document.getElementById("buttonRestart");

resetButton.addEventListener("click", (e) => {
    const field = document.getElementById("field");
    field.removeChild(document.getElementById("tableField"));
    const divReset = document.getElementById("restartGame");
    divReset.style.display = "none";

    NewFieldGenerator();
})

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - MAIN
// ==============================================================

NewFieldGenerator();