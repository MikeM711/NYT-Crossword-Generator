const _ = require("lodash");

const { randomWordGenerator, randomNumberGenerator, printGrid } = require("./helperMethods");
const { insertFirstHorizontalEntry, insertFirstHorizontalWord } = require("./firstEntrySectionMethods");
const { insertHorizontalWordFromPartial, insertVerticalEntry } = require("./laterEntryMethods")
const { isGridValidHorizontally, 
    isGridValidVertically, 
    isGridPartialWordValidHorizontally, 
    isGridPartialWordValidVertically, 
    isGridComplete } = require("./validityMethods");
const { wordHash } = require("./dictionary/dictionaryHash");
const { dictionary} = require("./dictionary/dictionary")
const { blankGrid } = require("./getPreDeterminedGrid");

let grid
let gridHistory = []
gridHistory.push(blankGrid)
let NYTcrossword = createNYTcrossword(grid,blankGrid, gridHistory)
printGrid(NYTcrossword)

function createNYTcrossword(grid, blankGrid) {
    let firstGridSectionComplete = false;
    let count = 0
    
    // Do not modify the blankGrid coming in
    grid = _.cloneDeep(blankGrid)

    // First, place the first word on the bottom-left of the grid
    // Find the first white cell on the last row, as far bottom/left as possible
    // we receive an object that has the properties of where to start the word on the left, end on the right, and what row
    const firstEntry = insertFirstHorizontalEntry(grid, grid.length - 1);

    // the returned grid of the below function gives us a random valid word on the bottom left of the grid
    grid = insertFirstHorizontalWord(grid, firstEntry, dictionary);

    // The below while loop will initialize the first valid section of our crossword
    // The valid section will include vertical words "growing" from the horizontal word we put down
    // Not only that, but these vertical words are VALID for the contraints of a crossword
    while (firstGridSectionComplete === false) {
        // Below variable will count the amount of times we check to see if our new vertical words are valid with the rest of the board
        count++ 

        if(count === 3000) {
            // if we wait ~10s to lay down a section (the rng word is difficult to use), lets try a new word instead
            grid = _.cloneDeep(blankGrid)
            console.log("let's generate a new word")
            grid = insertFirstHorizontalWord(grid, firstEntry, dictionary);
            // set the counter back to zero, if we get a new word that is also difficult, we will arrive at this if statement again for another word
            count = 0
        }

        // insert vertical words from the horizontal word we have just laid down
        // below method will always return a valid grid - whether it is an updated grid or the initial grid we passed in
        // we will say that the minimum acceptable number of words that can be created by a partial word is: 4
        let newGrid = createInitialValidSection(grid, firstEntry, dictionary, 4);

        // Did the grid change, compared to the one we passed in?
        if (_.isEqual(grid, newGrid) === false) {
            // this grid has changed, meaning we have made valid progress
            grid = newGrid;
            firstGridSectionComplete = true;
            printGrid(grid);
        }
        // else: continue the loop with a blank grid
    }
    // If execution is here, we have a valid horizontal word on the bottom left of our crossword
    // We also have vertical words "growing" from the horizontal word we put down
    // The crossword is valid horizontally and vertically
    // The crossword is ALSO has partial words that are valid horizontally
    gridHistory.push(grid)

    // the below while loop is responsible for filling out the rest of the board
    let isCrosswordComplete = false;
    while( isCrosswordComplete === false ) {
        // Note: Handle case of "islands" of white cells in the future
        grid = createValidSectionBacktracking(grid, gridHistory);
        isCrosswordComplete = isGridComplete(grid);
        // break; // break for testing, won't be here for production
    }

    // If execution is here, the grid is fully complete
    
    console.log("we have created the new grid");
    printGrid(grid);
    // when I print out the grid, I hope to have "horizontal words" as a property for me to look at
    console.log("end");
    return grid;
}

function createValidSectionBacktracking(grid, gridHistory) {
    let count = 0
    // At this point, we have a perfectly valid section of words in the bottom-left corner of the crossword
    // we have a horizontal word at the bottom left, with words "growing" vertically from that word
    // All words are valid horizontally and vertically
    // All partial words going horizontally are able to form words (vertial has no partials by nature of the algorithm so far)

    // All incoming "grids" have the properties:
    // horizontalWordPartial & verticalWordPartial
    // - minWordsArr (type of array)
    // - minWordsColLocation
    // - minWordsRowLocation
    // - numMinWordCombinations
    // - validity
    // horizontalWords
    // - horizontalWords
    // - validity
    // verticalWords
    // - verticalWords
    // - validity

    // gridComplete should be when there are no partials left (we have completed an entire connected white-cell section)
    let gridConnectedSectionComplete = false
    while (gridConnectedSectionComplete === false) {
        count++
        let minValidPartialWords
        if(gridHistory.length == 2) {
            // In the beginning, a crossword board is not valid if we can only make 4 words or less from a partial word
            minValidPartialWords = 4
        } else {
            // later, the validity will be 1 or less
            minValidPartialWords = 1
        }

        // if some computation is taking too long, go back one result and do that section again
        if(gridHistory.length === 3 && count === 4000) {
            console.log('go back one result')
            gridHistory.pop()
            grid = gridHistory[gridHistory.length - 1]
            printGrid(grid)
            count = 0
        }
        

        // we create a deep clone of the incoming grid, which allows us to backtrack if our newGrid is invalid
        let dummyGrid = _.cloneDeep(grid);
        dummyGrid.horizontalWordPartial = grid.horizontalWordPartial
        dummyGrid.horizontalWords = grid.horizontalWords
        dummyGrid.verticalWordPartial = grid.verticalWordPartial
        dummyGrid.verticalWords = grid.verticalWords

        let minVerticalPartial = grid.verticalWordPartial
        let minHorizontalPartial = grid.horizontalWordPartial

        // The first word we lay down targets the partial word that can form the least amount of words
        // If the smallest number of words that we can lay down comes from a partial word going vertically, focus on filling in that horizontal partial word
        if(minVerticalPartial.numMinWordCombinations < minHorizontalPartial.numMinWordCombinations ) {
            // put code here
            break;
        } else {
            // Else: if the smallest number of words that we can lay down comes from a partial word going horizontally, focus on filling in that horizontal partial word
            // insert a horizontal word on a "horizontal partial word" entry that has the least amount of possible words
            // FUTURE: I will need to test to make sure that the inserted word IS VALID WITH PARTIAL WORDS
            // Step #1: RNG a valid word from the list of "least amount of possible words" horizontally- minWordsArr property
            let leastNumberWordsList = minHorizontalPartial.minWordsArr
            let rngHorizontalWordIdx = randomNumberGenerator(leastNumberWordsList.length)
            let horizontalWordForPartial = leastNumberWordsList[rngHorizontalWordIdx]
            dummyGrid = insertHorizontalWordFromPartial(dummyGrid, horizontalWordForPartial)
            // console.log(horizontalWordForPartial)
            // printGrid(dummyGrid)

            // Next we will insert vertical words as follows:
            // we will insert words from entry.startLeft to entry.endRight for entry.row
            let partialWordBegin = minHorizontalPartial.minWordsColLocation
            let partialWordEnd = partialWordBegin + minHorizontalPartial.minWordsArr[0].length
            let partialWordRow = minHorizontalPartial.minWordsRowLocation
            for (let i = partialWordBegin; i < partialWordEnd; i++) {
                dummyGrid = insertVerticalEntry(dummyGrid, partialWordRow, i, dictionary);
            }
            dummyGrid.horizontalWords; // not really needed
            // printGrid(dummyGrid)

            // if the grid is valid, return the new grid
            // if the grid is not valid, return the old grid we put in, and do another "dice roll"
            // printGrid(dummyGrid)
            let horizontalAnalysis = isGridValidHorizontally(dummyGrid);
            let horizontalWordPartialAnalysis = isGridPartialWordValidHorizontally(dummyGrid, minValidPartialWords)
            let verticalAnalysis = isGridValidVertically(dummyGrid)
            // below should always be true if this is our first section, we are using it for safety
            let verticalWordPartialAnalysis = isGridPartialWordValidVertically(dummyGrid, minValidPartialWords)
        
            if (horizontalAnalysis.validity === true && verticalAnalysis.validity === true && horizontalWordPartialAnalysis.validity === true && verticalWordPartialAnalysis.validity === true) {
                dummyGrid.horizontalWords = horizontalAnalysis;
                dummyGrid.verticalWords = verticalAnalysis
                dummyGrid.horizontalWordPartial = horizontalWordPartialAnalysis
                dummyGrid.verticalWordPartial = verticalWordPartialAnalysis

                // Now that this "dummyGrid" is proved to be valid, we will set is as "grid" - because it is valid
                grid = dummyGrid
                gridHistory.push(grid)
                count = 0
                console.log('**hit**')
                printGrid(grid)
                // have we completed the entire connected white-cell section?
                // If a horizontal or partial word analysis yields MAX_VALUE as the number of "minimum word combinations", there are no partial words to be found
                gridConnectedSectionComplete = grid.verticalWordPartial.numMinWordCombinations === Number.MAX_VALUE && grid.horizontalWordPartial.numMinWordCombinations === Number.MAX_VALUE ? true : false
            }
            // Else: The dummyGrid is not valid, therefore we will now revert back to the previous "grid"
        }     
    }
}

/*
The following function inserts vertical words from one arbitrary white cell to another
- An example of an "arbitrary white cell" would be our first horizontal cell we lay down in the bottom-left corner
- At each character, we build words going vertical to it

After we insert all vertical words
*/
function createInitialValidSection(grid, entry, dictionary, minValidPartialWords) {
    // we create a deep clone of the incoming grid, which allows us to backtrack if our newGrid is invalid
    // in the above case, we use grid as our return to redo this particular section
    // therefore, we always return valid grids
    // entry is an object with properties of: startLeft, endRight, row

    let newGrid = _.cloneDeep(grid);

    // begin to insert vertical words
    // we will insert words from entry.startLeft to entry.endRight for entry.row
    for (let i = entry.startLeft; i <= entry.endRight; i++) {
        newGrid = insertVerticalEntry(newGrid, entry.row, i, dictionary);
    }

    // if the grid is valid, return the new grid
    // if the grid is not valid, return the old grid we put in, and do another "dice roll"
    // printGrid(newGrid)
    // minValidPartialWords indicates the most minimum acceptable number of words that can be made from each "partial word" going horizontally
    // In that case, if there is 0 words that can be made from partial words, this crossword should be considered invalid even if all horizontal and vertical full words are valid
    let horizontalAnalysis = isGridValidHorizontally(newGrid);
    let horizontalWordPartialAnalysis = isGridPartialWordValidHorizontally(newGrid, minValidPartialWords)
    let verticalAnalysis = isGridValidVertically(newGrid)
    // below should always be true if this is our first section, we are using it for safety
    let verticalWordPartialAnalysis = isGridPartialWordValidVertically(newGrid, minValidPartialWords)

    if (horizontalAnalysis.validity === true && verticalAnalysis.validity === true && horizontalWordPartialAnalysis.validity === true && verticalWordPartialAnalysis.validity === true) {
        newGrid.horizontalWords = horizontalAnalysis;
        newGrid.verticalWords = verticalAnalysis
        newGrid.horizontalWordPartial = horizontalWordPartialAnalysis
        newGrid.verticalWordPartial = verticalWordPartialAnalysis
        return newGrid;
    }
    return grid;
}
