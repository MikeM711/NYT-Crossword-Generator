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