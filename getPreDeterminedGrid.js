// var preDeterminedGrid = require('./data/nyt_crosswords/2014/06/02.json')
const preDeterminedGrid = require("./data/nyt_crosswords/2012/06/05.json");

// TO-DO: When near completion of this project - I will have an RNG that will gather a random grid for each crossword instance
// For now, we will deal with a static file

// Below is how I will set up my RNG for a random crossword file
// 1. years 1976 thru 2018
// 2. folder 01 thru 12 (months)
// -- some are not found - re-roll if not a valid file
// 3. 01 thru 31 (days)
// -- if hit a 31 on months that have 30 days - re-roll if not a valid file

// printPreDeterminedGrid(preDeterminedGrid)

exports.blankGrid = createBlankGrid(preDeterminedGrid);

// printGrid(preDeterminedBlankGrid)

function printPreDeterminedGrid(grid) {
    let gridPointer = 0;
    for (let i = 0; i < grid.size.rows; i++) {
        let rowChars = "";
        for (let j = 0; j < grid.size.cols; j++) {
            rowChars += " " + grid.grid[gridPointer] + " ";
            gridPointer++;
        }
        console.log(rowChars);
    }
}

function printGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        let rowChars = "";
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== null) {
                rowChars += "   " + grid[i][j] + "  ";
            } else {
                rowChars += " " + grid[i][j] + " ";
            }
        }
        console.log(rowChars);
    }
}

function createBlankGrid(grid) {
    let gridPointer = 0;
    let blankGrid = [];
    for (let i = 0; i < grid.size.rows; i++) {
        let row = [];
        for (let j = 0; j < grid.size.cols; j++) {
            if (grid.grid[gridPointer] === ".") {
                row.push(null);
            } else {
                row.push(1);
            }
            gridPointer++;
        }
        blankGrid.push(row);
    }
    return blankGrid;
}
