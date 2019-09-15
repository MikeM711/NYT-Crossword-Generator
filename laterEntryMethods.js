const { randomWordGenerator} = require("./helperMethods");
const _ = require("lodash");

exports.insertHorizontalWordFromPartial = function(grid, horizontalWord) {

    let wordLocation = grid.horizontalWordPartial
    let col = wordLocation.minWordsColLocation
    let row = wordLocation.minWordsRowLocation
    for (let i = 0; i < horizontalWord.length; i++) {
        grid[row][col] = horizontalWord[i]
        col++
    }

    return grid
}

/* 
The following function takes some cell location in the grid
From that cell location, it travels as far up and as far down as possible to find:
1. Where to start the vertical word
2. How big the vertical word must be

Extra Notes:
This function also has the ability to NOT OVERWRITE OTHER WORDS
*/
exports.insertVerticalEntry = function(grid, row, col, dictionary) {
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

    // if we do not have any 1's in our charsInclude hash, that means that this particular word is NOT a partial, it is filled out
    // If this is the case, stop the function and return the un-touched grid
    if(_.includes(charsInclude, 1) !== true) {
        return grid
    }

    // insert a valid word from rowStart to rowEnd down vertically
    // Valid includes: 1) proper height, 2) does not destroy other words (adheres to charsInclude hash)
    let wordHeight = rowEnd - rowStart + 1;

    // Find a random word that satisisfies the criteria of letters and their locations, found inside the hash
    let randomWord = null;
    while (randomWord === null) {
        // first, find a word of the same length as wordHeight
        while (randomWord === null) {
            let testvariable = 1 // NOTE: execution seems to get stuck on the above while loop 1/20-ish times
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