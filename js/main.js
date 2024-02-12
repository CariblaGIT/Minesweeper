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
        let cell = document.createElement('fieldCell'); 

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
// FUNCTIONALITIES OF THE MINESWEEPER
// ==============================================================

