let wordHash = require("./dictionary/dictionaryHash").dictionary_hash;
let helperMethods = require("./helperMethods");

function HorizontalValidity(validity, words) {
    this.validity = validity;
    this.horizontalWords = words; // used to observe results - not needed for production
}

// The below function analyzes the WHOLE grid from top to bottom, left to right
isGridValidHorizontally = function (grid) {
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;
    let colPointer = 0;
    let rowPointer = 0;
    let validity = true;
    let horizontalWords = []; // used to observe results
    while (validity === true && rowPointer < gridHeight) {
        // get all words on a row
        let wordResult = "";
        while (colPointer <= gridWidth) {
            if (grid[rowPointer][colPointer] == null) {
                // If we hit a "null", that can indicate 2 things:
                // 1. This is the "block" boundary of the end of a word
                // 2. This is "dead space" - where the last element was null or a grid boundary
                colPointer++;
                if (wordResult.length > 0) {
                    // if execution is here, we have created a word that we need to check
                    // having words in our variable indicates that the previous element was making a word
                    if (wordHash[wordResult] !== undefined) {
                        // if exeuction is here, congratulations the word exists - it is found in our hash
                        horizontalWords.push(wordResult);
                        // *** create an empty variable for more checks
                        wordResult = "";
                        // above handles the case for multiple words on one row
                    } else {
                        // if execution is here, the word does not exist
                        // we will need to delete the section you are working on and try to build this section again
                        validity = false;
                        break;
                    }
                }
            } else if (grid[rowPointer][colPointer] == 1) {
                // if we hit a "1" we have no idea if the word will be valid or not
                // this is not a good word to test, since it is a "partial" word
                wordResult = "";
                // therefore, iterate up the colPointer until we hit a null (to start a new word) or an undefined
                while (
                    grid[rowPointer][colPointer] !== null &&
                    grid[rowPointer][colPointer] !== undefined
                ) {
                    colPointer++;
                }
            } else {
                // we are on a character of a word that we want to know is valid - it is neither 1, null or undefined
                // Theory: if any point we spot a 1, we will instantly iterate up to a null, as that word is known to be partially built
                // Theory: if we hit no 1's, but we hit a null or undefined boundary - we have a full valid word that we will analyze in the "null"
                wordResult += grid[rowPointer][colPointer];
                colPointer++;
            }
        }

        // Case: we have a word that ends on the boundary of the grid: colPointer = gridWidth
        // test to see if, when the while loop has ended, that wordResult is found in our dictionary
        if (wordResult !== "") {
            if (wordHash[wordResult] !== undefined) {
                // there is a word next to the boundary
                horizontalWords.push(wordResult);
                // console.log('word found!, It is: ', wordResult)
                wordResult = "";
            } else {
                // if execution is here, the word does not exist, re-do the section
                // console.log('word not found')
                validity = false;
                break;
            }
        }

        // If execution is here and validity is true, that means our row we have analyzed (and rows before that) is valid
        // set ourselves up for testing words in the next row
        colPointer = 0;
        rowPointer++;
    }
    // If execution is here we have either
    // 1: exhausted the while loop: rowPointer == gridHeight, meaning we found no validity discrpencies
    // 2: validity became false

    // return horizontal validity result
    return new HorizontalValidity(validity, horizontalWords);
};

module.exports = { isGridValidHorizontally: isGridValidHorizontally };
