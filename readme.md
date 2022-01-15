# FGSFDS

This is a simple sequencing game I came up with. It's simple and can be played on paper, or in chat. There's no board or field, just a sequence of letters players expand. 

## Rules

### Basics

The game is for two players. 

Game uses several symbols agreed upon by players, by default it's letters S, D, F and G. 

The main object of the game is sequence of letters (by default it's FGSFDS). Subsequences that start and end with same letter are called "loops". SFDS is an example of a loop. Players take turns adding symbols to the sequence and avoiding creating a duplicate loop. If a player creates a loop that's already present in the sequence, they lose the game.

### Win condition

Opponent loses the game or has no turns that don't make them lose game. 

In paper, winning player has to point out duplicate sequence finished by opponent to win.

### Lose conditions

After player's turn, sequence ends with a loop (subsequence starting and ending with the same letter) lso present elsewhere in sequence.

## Examples

Given FGSFDSFD, player can't add D as it's duplicate of last symbol, and adding S makes them lose the game because now SFDS is already present in the sequence. F and G are the options that don't make them lose.

Given FGSFDSFGFDFGDSDFGSDFG, every move player can make is a losing move - new letter would create one of the loops FGF, DFGD and SDFGS, all of which are already present. Thus, that player has lost.

## Implementation specifics

Game has two modes: 
- "Classic", closest to paper version, but with automated lose detection.
- "Strategic", where you can't make losing turn, and lose when you don't have any moves left.

