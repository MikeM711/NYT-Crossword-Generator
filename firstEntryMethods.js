const { randomWordGenerator } = require("./helperMethods");

function ValidRowStartEnd(start, end, row) {
    this.startLeft = start;
    this.endRight = end;
    this.row = row;
}

/*
The below function gives you the start and end location of a horizontal entry
We make use of the ValidRowStartEnd constructor

If the row/col combination provided starts as a "null" we will iterate until we find a "white cell", label that as start, and keep going until we have a "block", label that as end
*/
exports.insertFirstHorizontalEntry = function (grid, row) {
    let bottomRowPointer = 0;
    let pointerValue = grid[row][bottomRowPointer];

    // iterate the pointer to the right until we find a non-null (valid) white cell
    while (pointerValue === null) {
        bottomRowPointer++;
        pointerValue = grid[row][bottomRowPointer];
    }

    let start = bottomRowPointer;

    // iterate the pointer to the right until we hit either a null or undefined
    // this indicates the area of ONE word
    while (pointerValue === 1 && bottomRowPointer !== undefined) {
        bottomRowPointer++;
        pointerValue = grid[row][bottomRowPointer];
    }
    end = bottomRowPointer - 1;

    // return an object indicating where to place a word
    // By nature, we can infer the word length we need too
    return new ValidRowStartEnd(start, end, row);
};

exports.insertFirstHorizontalWord = function(grid, horizontalEntry, dictionary) {
    // the length of the white horizontal entries we want to fill with a word
    let entryLength = horizontalEntry.endRight - horizontalEntry.startLeft + 1;

    // search for a word that has the same length as the entry length
    let randomWord = null;
    while (randomWord === null) {
        randomWord = randomWordGenerator(dictionary);
        if (randomWord.length === entryLength) {
            console.log("Random word: ", randomWord);
            break;
        } else {
            // the RNG word does not have the length we are looking for, keep searching
            randomWord = null;
        }
    }

    // If execution is here, we found a word to insert in the bottom left corner

    // insert the randomWord in the proper location of the grid (where the entry starts)
    for (let i = 0; i < entryLength; i++) {
        grid[horizontalEntry.row][i + horizontalEntry.startLeft] = randomWord[i];
    }

    // return the grid with that one word entry
    return grid;
}