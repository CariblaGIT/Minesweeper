const FlippingCells = (cell) => {
    const cellClicked = document.getElementById(cell);
    for(let i = 0; i < cellClicked.classList.length; i++){
        if(cellClicked.classList[i].match("lightGreenCell")){
            cellClicked.classList.remove("lightGreenCell")
            cellClicked.classList.add("clickedCellLightGreen");
        } else if (cellClicked.classList[i] == "greenCell"){
            cellClicked.classList.remove("greenCell")
            cellClicked.classList.add("clickedCellGreen");
        }
        
    }
    
} 

// ==============================================================
// GENERATION OF MINESWEEPER FIELD INSIDE THE CONTAINER
// ==============================================================

const field = document.getElementById("field");

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

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET MINES
// ==============================================================

let minesToPlace = 99;
const cells = document.getElementsByClassName("cell")

while(minesToPlace > 0){
    let randCell = Math.floor(Math.random() * 480);
    if(!cells[randCell].classList.contains("mine")){
        cells[randCell].classList.add("mine");
        minesToPlace--;
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET NUMBERS MINES AROUND
// ==============================================================

for(let i = 0; i < cells.length; i++){
    if(!cells[i].classList.contains("mine")){
        let minesAround = 0;
        let cellsAround;

        if(i == 0){
            cellsAround = [i+1, i+24, i+25];
        } else if (i == 23){
            cellsAround = [i-1, i+23, i+24];
        } else if (i == 456){
            cellsAround = [i-24, i-23, i+1];
        } else if (i == 479){
            cellsAround = [i-25, i-24, i-1];
        } else if (i > 0 && i < 23){
            cellsAround = [i-1, i+1, i+23, i+24, i+25];
        } else if (i > 456 && i < 479){
            cellsAround = [i-25, i-24, i-23, i-1, i+1];
        } else if (i > 0 && i % 24 == 0 && i < 456){
            cellsAround = [i-24, i-23, i+1, i+24, i+25];
        } else if (i > 23 && i % 24 == 23 && i < 479){
            cellsAround = [i-25, i-24, i-1, i+23, i+24];
        } else {
            cellsAround = [i-25, i-24, i-23, i-1, i+1, i+23, i+24, i+25];
        }
        for(let j=0; j<cellsAround.length; j++){
            if(cells[cellsAround[j]].classList.contains("mine")){
                minesAround++;
            }
        }
        cells[i].classList.add("minesAround-"+minesAround.toString());
    }
}

// ==============================================================
// FUNCTIONALITIES OF THE MINESWEEPER - SET CLICKERS FOR EACH CELL
// ==============================================================

const arrayCells = Array.from(cells);

arrayCells.forEach(item => {
    item.addEventListener("click", (e) => {
        let classes = Array.from(e.target.classList);
        let numMines;
        for(let i=0; i<classes.length; i++){
            (classes[i].includes("minesAround-")) ? numMines = parseInt(classes[i].slice(-1)) : numMines = "mine";
        }
        switch(numMines){
            case "mine":
                //TODO: GameOver interaction goes right here
                break;
            default:
                FlippingCells(e.target.id);
                e.target.classList.add("minesAround"+numMines);
                if(numMines != 0){
                    e.target.innerHTML = numMines;
                }
                break;
        }
    })
})
