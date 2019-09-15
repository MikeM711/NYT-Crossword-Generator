# NYT-Crossword-Generator
WIP: A crossword generator that creates crosswords to NYT criteria

## Current progress

Algorithm works as planned. However, despite my optimizations to avoid "getting stuck" when creating words, this is a very tricky issue to overcome.

My average results so far: https://github.com/MikeM711/NYT-Crossword-Generator/blob/master/results/results_grid.png

All results given from this algorithm are grids that have valid words going horizontally and vertically. To add on to that, all results' "partial words" (non-complete words) can become 4 or more possible words. 

As stated earlier, when laying down more words, it is very easy to "get stuck" if you don't have the right word(s) with the right configuration of white cells and black blocks.

Going forward for the future:
1) Maybe I should drop the "predetermined boards" and allow the RNG of words create its own 180° symmetric board?
