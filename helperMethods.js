exports.randomWordGenerator = function (dictionary) {
    // dictionary has 370,099 words - deleted "null" and "undefined"
    // floor is used because so we can get the first element: the valid elements are from 0 to 370099
    return dictionary[Math.floor(Math.random() * dictionary.length)];
};

exports.randomNumberGenerator = function (max) {
    return Math.ceil(Math.random() * max - 1);
};

exports.printGrid = function (grid) {
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
