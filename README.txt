Hello, and welcome to "hiptactoe" (like, how "hipmunk" is a hip chipmunk, "hip tac toe" is hip tic tac toe :P )

It's a simple web-based tic tac toe game, where you can play a friend, a computer, or you can have two computers play against each other (hint: this is kind of boring after a while). 
There's really not much to say about how to use it. It follows the rule that X always goes first in tic tac toe. The README is mostly notes and designs that I wrote while building this page.

I wrote all of this from scratch (all the html, javascript, and css). I used some fonts from the web to get that nice chalk-boardy effect. Thanks, David Kerkhoff! <http://www.fontspace.com/david-kerkhoff>

Please message me on github if you have any questions!
~ Alex

--------
Algorithms
--------
****AI, and how the computer plays optimally****
This is a method that is meant to be called recursively, so that the computer can "play out" a game in its "imagination" in order to find the best move.
getOptimalMove function (input = current state of board, symbol for which to find an optimal move)
	keep track of a stalemate move and a losing move.
	check if square is empty. if so,
		play my symbol in that square.
		check if game is over. if so,
			did I win? if so, return this move as "won"
			is it a stalemate? if so, save this move to return later, if I don't return a winning move first. (after all, a stalemate is better than losing)
		if not,
			create a copy of the board
			call getOptimalMove on that board as my opponent
			interpret results:
				if this call returns a winning move, then my opponent won and I lost. however, this might be the *only* blank space, so save it for later.
				if this call returns a loss, then I can win by playing on this blank space! return this move as "won"
				if this call returns a stalemate, then save this move to return later, if I don't return a winning move first.
	if there's a stalemate move, return it now.
	otherwise, return the losing move.

****Game play, and putting a symbol on the board****
attemptMove function (input = square)
	check if square is empty. if so,
		write the symbol of the 'current player'
		draw the "undo" button
		check if game is over. if so, 
			name winner (could be stalemate)
			give person option to start over
		if not,
			toggle "current player" value
	if not,
		say something like "you can't play there!"

--------
Architecture requirements
--------
Need to keep track of a current player
Need a way to reset or re-start game at any given time
Need a way to notify user of a "winner" (either X, O, or no one)
Need a way of displaying messages like "You can't do that!" or "X is the winner!"
Need a "virtual board" that talks to the graphical (html) board (so I don't have to iterate over the DOM every time I want to check if a move is valid or if the game is over)
Would be nice if the AI had a "thinking..." timer, so that it didn't play instantaneously

--------
Methods
--------
checkGameOver: looks at board, returns bool of true or false

--------
To-do's
--------
- Make sure CSS is pretty even when window gets narrow (right now when it goes below 450px wide, things start overlapping weirdly...)
- Have a javascript expert look at code and give advice on best practices
- Publish it on a real server!

--------
Known bugs
--------
- SVG image doesn't render in IE11 :(

--------
Gold plating
--------
- Draw a line over the winning row/column/diagonal when someone wins (use canvas over top of table?)
- Have the "getOptimalMove" method start at random rows and columns to make game non-deterministic
- arrow pointing at player who's turn it is (or maybe a border or something)
- randomly generated images of humans or computers to display in PlayerPanels whenever the player type is changed
- Play a sound (like a "bonk") when the person clicks on a space that's already taken
- A cool Easter egg would be to have a button that says "i give up" and show a message like "the only winning move is not to play" alluding to that 80's movie with nuclear program AIs...


		