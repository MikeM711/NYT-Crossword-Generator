// Below dictionary has 370,099 words - deleted "null" and "undefined"
let wordDictionary = require("./dictionary/dictionary").dictionary_english;

randomWordGenerator = function () {
    // ceil is used because the first element is a placeholder: so the valid elements are from 1 to 370099
    return wordDictionary[Math.ceil(Math.random() * 370099)];
};

printGrid = function (grid) {
    for (let i = 0; i < grid.length; i++) {
        var rowChars = "";
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== null) {
                rowChars += "   " + grid[i][j] + "  ";
            } else {
                rowChars += " " + grid[i][j] + " ";
            }
        }
        console.log(rowChars);
    }
};

module.exports = {
    randomWordGenerator: randomWordGenerator,
    printGrid: printGrid
};
