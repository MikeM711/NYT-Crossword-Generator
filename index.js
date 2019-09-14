const _ = require("lodash");

const { randomWordGenerator, randomNumberGenerator, printGrid } = require("./helperMethods");
const { insertFirstHorizontalEntry, insertFirstHorizontalWord } = require("./firstEntryMethods");
const { insertHorizontalWordFromPartial } = require("./laterEntryMethods")
const { isGridValidHorizontally, 
    isGridValidVertically, 
    isGridPartialWordValidHorizontally, 
    isGridComplete } = require("./validityMethods");
const { wordHash } = require("./dictionary/dictionaryHash");
const { dictionary} = require("./dictionary/dictionary")
const { blankGrid } = require("./getPreDeterminedGrid");

// First, place the first word on the bottom-left
// Find the first white cell on the last row, as far bottom/left as possible
// we receive an object that has the properties of where to start the word on the left, end on the right, and what row
// Future: May want to "dice roll" the following line as well, rather than be stuck with one word
const firstEntry = insertFirstHorizontalEntry(blankGrid, blankGrid.length - 1);

// the returned grid of the below function gives us a random valid word on the bottom left of the grid
let grid = insertFirstHorizontalWord(blankGrid, firstEntry, dictionary);

// insert vertical words from the horizontal word we have just laid down
// This is where we would loop the program for "section re-do's"
let gridComplete = false;
while (gridComplete === false) {
    // below method will always return a valid grid - whether it is updated or the same
    let newGrid = createInitialValidSection(grid, firstEntry, dictionary);
    if (_.isEqual(grid, newGrid) === false) {
        // this grid has changed, meaning we have made valid progress
        grid = newGrid;
        gridComplete = true;
        printGrid(grid);
        // we have just kickstarted our grid board
        // below is the "meat" of the program, responsible for filling the rest of the board
        grid = createValidSectionBacktracking(grid)
        // if execution is here, the program is over
    }
    // else, continue the loop
}

console.log("we have created the new grid");
printGrid(grid);
// when I print out the grid, I hope to have "horizontal words" as a proper for me to look at
console.log("end");

function createValidSectionBacktracking(grid) {
    let gridComplete = false
    while (gridComplete === false) {
        // we create a deep clone of the incoming grid, which allows us to backtrack if our newGrid is invalid
        let dummyGrid = _.cloneDeep(grid);

        console.log(dummyGrid)

        // insert a horizontal word on a "horizontal partial word" entry that has the least amount of possible words
        // FUTURE: I will need to test to make sure that the inserted word IS VALID WITH PARTIAL WORDS
        // Step #1: RNG a valid word from the list of "least amount of possible words" horizontally- minWordsArr property
        let leastNumberWordsList = grid.horizontalWordPartial.minWordsArr
        let rngHorizontalWordIdx = randomNumberGenerator(leastNumberWordsList.length)
        let horizontalWordForPartial = leastNumberWordsList[rngHorizontalWordIdx]

        dummyGrid = insertHorizontalWordFromPartial(grid, horizontalWordForPartial)
        console.log(dummyGrid)
        printGrid(dummyGrid)

        // Next we will insert vertical words as follows:
        // // begin to insert vertical words
        // // we will insert words from entry.startLeft to entry.endRight for entry.row
        // for (let i = entry.startLeft; i <= entry.endRight; i++) {
        //     newGrid = insertVerticalEntry(newGrid, entry.row, i);
        // }
        // newGrid.horizontalWords; // not really needed

        // // if the grid is valid, return the new grid
        // // if the grid is not valid, return the old grid we put in, and do another "dice roll"
        // // printGrid(newGrid)
        // let horizontalAnalysis = isGridValidHorizontally(newGrid);
        // let horizontalWordPartialAnalysis = isGridPartialWordValidHorizontally(newGrid, 4)
        // let verticalAnalysis = isGridValidVertically(newGrid)

        // if (horizontalAnalysis.validity === true && verticalAnalysis.validity === true && horizontalWordPartialAnalysis.validity === true) {
        //     newGrid.horizontalWords = horizontalAnalysis;
        //     newGrid.verticalWords = verticalAnalysis
        //     newGrid.horizontalWordPartial = horizontalWordPartialAnalysis
        //     return newGrid;
        // }
        // return grid;

        isGridComplete(grid)
        break // temorary break
    }
    return grid;
}


/* 
The following function takes some cell location in the grid
From that cell location, it travels as far up and as far down as possible to find:
1. Where to start the vertical word
2. How big the vertical word must be

Extra Notes:
This function also has the ability to NOT OVERWRITE OTHER WORDS
*/
function insertVerticalEntry(grid, row, col, dictionary) {
    // where do we want to begin the word coming down?

    // iterate up the column until we hit either a null or undefined for a start
    let rowPointer = row;
    let rowPointerValue = grid[rowPointer][col];
    while (rowPointerValue !== undefined && rowPointerValue !== null) {
        rowPointer--;
        if (grid[rowPointer] === undefined) {
            break;
        }
        rowPointerValue = grid[rowPointer][col];
    }
    let rowStart = rowPointer + 1;

    // iterate down the column until we hit either a null or undefined for an end
    // while we do this, if we find a letter, we will store that letter and its location in the hash
    // this hash indicates the particular existing characters and their locations
    // we will use this hash to not overwrite these existing characters
    let charsInclude = {};
    let hashPointer = 0;

    rowPointer = rowStart;
    rowPointerValue = grid[rowPointer][col];
    while (rowPointerValue !== undefined && rowPointerValue !== null) {
        charsInclude[hashPointer] = rowPointerValue;
        hashPointer++;
        rowPointer++;
        if (grid[rowPointer] === undefined) {
            break;
        }
        rowPointerValue = grid[rowPointer][col];
    }

    let rowEnd = rowPointer - 1;

    // we now have a hash of characters and their locations that must belong in the incoming word
    // we can also figure out the wordHeight from our pointers

    // insert a valid word from rowStart to rowEnd down vertically
    // Valid includes: 1) proper height, 2) does not destroy other words (adheres to charsInclude hash)
    let wordHeight = rowEnd - rowStart + 1;

    // Find a random word that satisisfies the criteria of letters and their locations, found inside the hash
    let randomWord = null;
    while (randomWord === null) {
        // first, find a word of the same length as wordHeight
        while (randomWord === null) {
            randomWord = randomWordGenerator(dictionary);
            if (randomWord.length == wordHeight) {
                break;
            } else {
                randomWord = null;
            }
        }

        // We now have a word that is the same length as wordHeight

        // next, see if that word adheres to our hash
        // we go through every letter of the random word, and check it against our hash
        // "1" means "free space"

        let randomWordPointer = 0;
        while (randomWordPointer < wordHeight) {
            if (charsInclude[randomWordPointer] === 1) {
                // this is the free space, you may continue
            } else if (
                charsInclude[randomWordPointer] !== randomWord[randomWordPointer]
            ) {
                // execution is here when we end up on an a space with an existing character (defined by the hash) and that letter-location does NOT equal the letter-location of the random word
                // if we hit this, we must break out of for this loop and find another random word
                break;
            }
            // continue the loop if:
            // 1: the hash says that, at a particular location, we have a 1 - which is a "free space"
            // 2: the hash has a character at a particular location, and our RNG word has a character at that location as well
            randomWordPointer++;
        }

        // if we passed all of the tests, break out of the while loop
        if (randomWordPointer === wordHeight) {
            break;
        } else {
            randomWord = null;
        }
    }

    // if execution is here, we have a valid vertical word that adheres to our constraints found in our hash
    // We will now insert that word in the desired location

    let insertPointer = 0;
    for (let i = rowStart; i <= rowEnd; i++) {
        grid[i][col] = randomWord[insertPointer];
        insertPointer++;
    }

    return grid;
}

/*
The following function inserts vertical words from one arbitrary white cell to another
- An example of an "arbitrary white cell" would be our first horizontal cell we lay down in the bottom-left corner
- At each character, we build words going vertical to it

After we insert all vertical words
*/
function createInitialValidSection(grid, entry, dictionary) {
    // we create a deep clone of the incoming grid, which allows us to backtrack if our newGrid is invalid
    // in the above case, we use grid as our return to redo this particular section, instead of the invalid newGrid
    // entry is an object with properties of: startLeft, endRight, row

    let newGrid = _.cloneDeep(grid);

    // printGrid(grid)

    // begin to insert vertical words
    // we will insert words from entry.startLeft to entry.endRight for entry.row
    for (let i = entry.startLeft; i <= entry.endRight; i++) {
        newGrid = insertVerticalEntry(newGrid, entry.row, i, dictionary);
    }
    newGrid.horizontalWords; // not really needed

    // if the grid is valid, return the new grid
    // if the grid is not valid, return the old grid we put in, and do another "dice roll"
    // printGrid(newGrid)
    let horizontalAnalysis = isGridValidHorizontally(newGrid);
    let horizontalWordPartialAnalysis = isGridPartialWordValidHorizontally(newGrid, 4)
    let verticalAnalysis = isGridValidVertically(newGrid)

    if (horizontalAnalysis.validity === true && verticalAnalysis.validity === true && horizontalWordPartialAnalysis.validity === true) {
        newGrid.horizontalWords = horizontalAnalysis;
        newGrid.verticalWords = verticalAnalysis
        newGrid.horizontalWordPartial = horizontalWordPartialAnalysis
        return newGrid;
    }
    return grid;
}
