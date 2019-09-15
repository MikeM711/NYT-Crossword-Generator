const { insertFirstHorizontalEntry, insertFirstHorizontalWord } = require("../firstEntrySectionMethods");

function ValidRowStartEnd(start, end, row) {
    this.startLeft = start;
    this.endRight = end;
    this.row = row;
}

// Insert First Horizontal Entry: Test #1
test('Insert first horizontal entry - full row', () => {
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        [1, 1, 1, 1, 1, 1]
    ];
    const row = grid.length - 1
    const test = insertFirstHorizontalEntry(grid, row)
    // we expect to have an object telling us the location:
    // start on col idx 0
    // end on col idx 5 
    // This is all happening on row idx 3
    const expectedResult = new ValidRowStartEnd(0,5,3)
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Entry: Test #2
test('Insert first horizontal entry - beginning placement', () => {
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        [1, 1, 1, null, 1, 1]
    ];
    const row = grid.length - 1
    const test = insertFirstHorizontalEntry(grid, row)
    const expectedResult = new ValidRowStartEnd(0,2,3)
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Entry: Test #3
test('Insert first horizontal entry - middle placement', () => {
    const grid = [
        [null, 1, 1, 1], 
        [null, 1, 1, 1], 
        [null, 1, 1, null]
    ];
    const row = grid.length - 1
    const test = insertFirstHorizontalEntry(grid, row)
    const expectedResult = new ValidRowStartEnd(1,2,2)
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Entry: Test #4
test('Insert first horizontal entry - ending placement', () => {
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1]
    ];
    const row = grid.length - 1
    const test = insertFirstHorizontalEntry(grid, row)
    const expectedResult = new ValidRowStartEnd(1,3,2)
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Word: Test #1
// Based on: Insert First Horizontal Entry: Test #1
test('Insert first horizontal word - full row', () => {
    let dictionary = []
    for (let i = 1; i < 30; i++ ) {
        dictionary.push('a'.repeat(i))
    }
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        [1, 1, 1, 1, 1, 1]
    ];
    const gridResult = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        ['a', 'a', 'a', 'a', 'a', 'a']
    ];
    const row = grid.length - 1
    const horizontalEntry = insertFirstHorizontalEntry(grid, row)
    const test = insertFirstHorizontalWord(grid, horizontalEntry, dictionary)
    const expectedResult = gridResult
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Word: Test #2
// Based on: Insert First Horizontal Entry: Test #2
test('Insert first horizontal word - beginning placement', () => {
    let dictionary = []
    for (let i = 1; i < 30; i++ ) {
        dictionary.push('a'.repeat(i))
    }
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        [1, 1, 1, null, 1, 1]
    ];
    const gridResult = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, null, 1],
        ['a', 'a', 'a', null, 1, 1]
    ];
    const row = grid.length - 1
    const horizontalEntry = insertFirstHorizontalEntry(grid, row)
    const test = insertFirstHorizontalWord(grid, horizontalEntry, dictionary)
    const expectedResult = gridResult
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Word: Test #3
// Based on: Insert First Horizontal Entry: Test #3
test('Insert first horizontal word - middle placement', () => {
    let dictionary = []
    for (let i = 1; i < 30; i++ ) {
        dictionary.push('a'.repeat(i))
    }
    const grid = [
        [null, 1, 1, 1], 
        [null, 1, 1, 1], 
        [null, 1, 1, null]
    ];
    const gridResult = [
        [null, 1, 1, 1], 
        [null, 1, 1, 1], 
        [null, 'a', 'a', null]
    ];
    const row = grid.length - 1
    const horizontalEntry = insertFirstHorizontalEntry(grid, row)
    const test = insertFirstHorizontalWord(grid, horizontalEntry, dictionary)
    const expectedResult = gridResult
    expect(test).toMatchObject(expectedResult);
})

// Insert First Horizontal Word: Test #4
// Based on: Insert First Horizontal Entry: Test #4
test('Insert first horizontal word - ending placement', () => {
    let dictionary = []
    for (let i = 1; i < 30; i++ ) {
        dictionary.push('a'.repeat(i))
    }
    const grid = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 1, 1, 1, 1, 1]
    ];
    const gridResult = [
        [null, 1, 1, 1, 1, null], 
        [null, 1, 1, 1, null, 1],
        [null, 'a', 'a', 'a', 'a', 'a']
    ];
    const row = grid.length - 1
    const horizontalEntry = insertFirstHorizontalEntry(grid, row)
    const test = insertFirstHorizontalWord(grid, horizontalEntry, dictionary)
    const expectedResult = gridResult
    expect(test).toMatchObject(expectedResult);
})