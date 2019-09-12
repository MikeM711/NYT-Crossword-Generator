let _ = require("lodash");

let wordHash = require("./dictionary/dictionaryHash").dictionary_hash;
let wordDictionary = require("./dictionary/dictionary").dictionary_english;

function HorizontalPartialWordValidity(validity, numMinWords, minWordsFromPartial) {
    this.validity = validity;
    // the below property indicates the the most minimum combination of words that could fit in a partial word we have anlayzed
    // GOOD: The idea is to never have the below property = 0
    // BETTER: I would say a more flexible "word section" gives us around ~5 words or so at minimum?
    this.numMinWordCombinations = numMinWords;
    this.minWordsArr = minWordsFromPartial;
}

// The below function analyzes the WHOLE grid horizontally for partial words only
// Full words are skipped
// We traverse from left to right at the top row, going down
// Therefore, traversal ends when it reaches the bottom boundary
isGridPartialWordValidHorizontally = function (grid, smallestAllowedWordCombinations = 1) {
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;
    let colPointer = 0;
    let rowPointer = 0;
    let validity = true;

    // the below variable the most mininum word combinations for all "partial word" combinations
    // this serves as our "validity"
    // if minWordCombinations = 0, validity is immediately false no matter what
    let minWordCombinations = Number.MAX_VALUE; 

    // the below variable holds an array of the valid words that could be made from the partial word with the most mininum combinations
    let minWordsFromPartial;

    // if a user gives a smallestAllowedWordCombinations input, minWordCombinatons should ALWAYS be bigger than that 
    // this input allows our crossword to be flexible with more RNG words
    // The higher the input number, the more flexible the words are in the grid for creating more words
    while (minWordCombinations > smallestAllowedWordCombinations && rowPointer < gridHeight) {
        // get all "partial words" on a row
        let hash = {}; // this hash keeps track of our exact "partial word" characters + locations
        let hashSize = 0;
        while (colPointer < gridWidth && minWordCombinations > smallestAllowedWordCombinations) {
            if (grid[rowPointer][colPointer] == null) {
                // If we hit a "null", that can indicate 2 things:
                // 1. This is the "block" boundary of the end of a word
                // 2. This is "dead space" - where the last element was null or a grid boundary
                colPointer++;

                // do we have characters that are not 1 in our hash?
                // we only need to compute for this if the hash is not empty
                let charFound = false;

                // execution enters the following "if" providing that the hash has both a "1" and is not empty
                // this is where full words (hashes with no 1's) will be filtered out
                if (_.isEmpty(hash) !== true && _.includes(hash, 1) === true) {
                    _.forEach(hash, function (value, key) {
                        // if we have a value that is not 1 in our hash, that means we have at least 1 character
                        if (value !== 1) {
                            // Having at least 1 existing character makes this a "partial word" that we MUST analyze
                            charFound = true;
                        }
                    });
                }

                // we always enter the below "if" as long as charFound === true
                // the extra conditions simply help for readability
                if (_.isEmpty(hash) !== true && _.includes(hash, 1) === true && charFound === true) {
                    // if execution is here, we have analyzed a "partial" word that we need to check
                    let numWordsFromPartial = 0;
                    let arrWordsFromPartial = [];
                    for (let i = 0; i < wordDictionary.length; i++) {
                        // only analyze a word from the dictionary IF it is the size of our FULL "partial word"
                        if (wordDictionary[i].length === hashSize) {
                            // a word from the dictionary is the same size as the word we have hashed
                            for (let j = 0; j < wordDictionary[i].length; j++) {
                                // if the hashed value is NOT 1 at a particular location, we must analyze it against the word AT THAT PARTICULAR LOCATION from the word dictionary

                                // if the hashed value (char) is not 1, and the value (char) is NOT at the same location as the word from the dictionary - discard this word as a possible word made from this "partial word"
                                if (hash[j] !== 1 && hash[j] !== wordDictionary[i][j]) {
                                    break;
                                }
                                if (j === wordDictionary[i].length - 1) {
                                    // if we have exhausted the for loop, this word is a possibile answer for our "partial word"
                                    arrWordsFromPartial.push(wordDictionary[i]);
                                    numWordsFromPartial++;
                                }
                            }
                        }
                    }
                    // we have right now analyzed the full dictionary

                    // if we hit a minimum, let's see the words we can make from this minimum
                    if (numWordsFromPartial < minWordCombinations) {
                        minWordsFromPartial = arrWordsFromPartial;
                    }

                    // check and update the minWordCombinations variable if we hit a "more minimum" number of combinations
                    minWordCombinations = Math.min(minWordCombinations, numWordsFromPartial);

                    // delete everything from the hash and prepare to examine in the next partial word
                    hash = {};
                    hashSize = 0;
                }
                // else:
                // congratulations, there are no partial words to analyze
                // analyze the next partial word in this row
                hash = {};
            }
            else {
                // we are on a character of a word
                // it is neither 1, null or undefined
                hash[hashSize] = grid[rowPointer][colPointer];
                hashSize++;
                colPointer++;
            }
        }

        // execution is here if we have fully analyzed an entire row

        // Case: we have a word that ends on the boundary of the grid: colPointer = gridWidth
        // Test to see if we have a "partial word"

        // do we have characters that are not 1 in our hash?
        let charFound = false;

        _.forEach(hash, function (value, key) {
            // if we have a value that is not 1 in our hash, that means we have at least 1 character
            if (value !== 1) {
                // Having at least 1 existing character makes this a "partial word" that we MUST analyze
                charFound = true;
            }
        });

        if (_.isEmpty(hash) !== true && _.includes(hash, 1) === true && charFound === true) {
            // check to see how many words we can form from this partial word

            let numWordsFromPartial = 0;
            let arrWordsFromPartial = [];
            for (let i = 0; i < wordDictionary.length; i++) {

                // only analyze a word from the dictionary IF it is the size as our FULL "partial word"
                if (wordDictionary[i].length === hashSize) {
                    // a word from the dictionary is the same size as the word we have hashed
                    for (let j = 0; j < wordDictionary[i].length; j++) {
                        // if the hashed value is a NOT 1 at a particular location, we must analyze it against the word AT THAT PARTICULAR LOCATION from the word dictionary
                        if (hash[j] !== 1 && hash[j] !== wordDictionary[i][j]) {
                            break;
                        }
                        if (j === wordDictionary[i].length - 1) {
                            // if we have exhausted the for loop, this word is a possibile answer for our "partial word"
                            arrWordsFromPartial.push(wordDictionary[i]);
                            numWordsFromPartial++;
                        }
                    }
                }
            }

            // we have right now analyzed the full dictionary

            // if we hit a minimum, let's see the words we can make from this minimum
            if (numWordsFromPartial < minWordCombinations) {
                minWordsFromPartial = arrWordsFromPartial;
            }

            // check and update the minWordCombinations variable if needed
            minWordCombinations = Math.min(minWordCombinations, numWordsFromPartial);
        }
        // if execution breaks out of the while loop with a "false" validity, break out of this loop as well
        if (minWordCombinations < smallestAllowedWordCombinations) {
            validity = false;
            break;
        }

        // If execution is here and validity is true, that means our row we have analyzed (and rows before that) is valid
        // set ourselves up for testing words in the next row
        rowPointer++; // moving to the next row
        colPointer = 0; // starting from the left column
    }
    // If execution is here we have either
    // 1: exhausted the while loop: rowPointer == gridHeight, meaning we found no validity discrepencies
    // 2: validity became false

    // make sure validity becomes false if we find a partial word with less combinations than we allow it (given as a function argument)
    if (minWordCombinations < smallestAllowedWordCombinations) {
        validity = false;
    }
    // return horizontal validity result
    return new HorizontalPartialWordValidity(validity, minWordCombinations, minWordsFromPartial);
};


function HorizontalValidity(validity, words) {
    this.validity = validity;
    this.horizontalWords = words; // used to observe results
}

// The below function analyzes the WHOLE grid horizontally 
// We traverse from left to right at the top row, going down
// Therefore, it ends when it reaches the bottom boundary
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
        while (colPointer < gridWidth) {
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
        rowPointer++; // moving to the next row
        colPointer = 0; // starting from the left column
    }
    // If execution is here we have either
    // 1: exhausted the while loop: rowPointer == gridHeight, meaning we found no validity discrepencies
    // 2: validity became false

    // return horizontal validity result
    return new HorizontalValidity(validity, horizontalWords);
};


function VerticalValidity(validity, words) {
    this.validity = validity;
    this.verticalWords = words; // used to observe results
}

// The below function analyzes the WHOLE grid vertically 
// We traverse from top to bottom at the most left column, checking each column to the right
// Therefore, it ends when it reaches the far right boundary
isGridValidVertically = function (grid) {
    let gridHeight = grid.length;
    let gridWidth = grid[0].length;
    let colPointer = 0;
    let rowPointer = 0;
    let validity = true;
    let verticalWords = []; // used to observe results

    while (validity === true && colPointer < gridWidth) {
        // get all words on a column from top to bottom
        let wordResult = "";
        while (rowPointer < gridHeight) {

            if (grid[rowPointer][colPointer] == null) {
                // If we hit a "null", that can indicate 2 things:
                // 1. This is the "block" boundary of the end of a word
                // 2. This is "dead space" - where the last element was null or a grid boundary
                rowPointer++;
                if (wordResult.length > 0) {
                    // if execution is here, we have created a word that we need to check
                    // having words in our variable indicates that the previous element was making a word
                    if (wordHash[wordResult] !== undefined) {
                        // if exeuction is here, congratulations the word exists - it is found in our hash
                        verticalWords.push(wordResult);
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
                // therefore, iterate up the rowPointer (grid-wise, we are going down in rows) until we hit a null (to start a new word) or an undefined
                while (grid[rowPointer] !== undefined && grid[rowPointer][colPointer] !== null) {
                    rowPointer++;
                }
            } else {
                // we are on a character of a word that we want to know is valid - it is neither 1, null or undefined
                // Theory: if any point we spot a 1, we will instantly iterate up to a null (grid-wise, iterate down in rows), as that word is known to be partially built
                // Theory: if we hit no 1's, but we hit a null or undefined boundary - we have a full valid word that we will analyze in the "null"
                wordResult += grid[rowPointer][colPointer];
                rowPointer++;
            }
        }

        // Case: we have a word that ends on the boundary (the bottom) of the grid: rowPointer = gridHeight
        // test to see if, when the while loop has ended, that wordResult is found in our dictionary
        if (wordResult !== "") {
            if (wordHash[wordResult] !== undefined) {
                // there is a word next to the boundary
                verticalWords.push(wordResult);
                // console.log('word found!, It is: ', wordResult)
                wordResult = "";
            } else {
                // if execution is here, the word does not exist, re-do the section
                // console.log('word not found')
                validity = false;
                break;
            }
        }

        // If execution is here and validity is true, that means our column we have analyzed (and colums before that) is valid
        // set ourselves up for testing words in the next column
        colPointer++; // moving to the next column
        rowPointer = 0; // starting from the top row
    }
    // If execution is here we have either
    // 1: exhausted the while loop: colPointer == gridWidth, meaning we found no validity discrpencies
    // 2: validity became false

    // return horizontal validity result
    return new VerticalValidity(validity, verticalWords);
};

module.exports = {
    isGridValidHorizontally: isGridValidHorizontally,
    isGridValidVertically: isGridValidVertically,
    isGridPartialWordValidHorizontally: isGridPartialWordValidHorizontally
};
