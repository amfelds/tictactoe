window.onload = function () {
	/*
	 * INSTANTIATE the global(ish) variables
	 */

	var player1 = {symbol: 'X', isAI: 'false'}
	var player2 = {symbol: 'O', isAI: 'true'}
	var currPlayer = player1;
	
	var isGameOver = false;
	
	var virtualBoard = [];
	virtualBoard[0] = [];
	virtualBoard[1] = [];
	virtualBoard[2] = [];
	
	/*
	 * DEFINE the helper functions
	 */
	 
	var drawBoard = function() {
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				tempSymbol = virtualBoard[i][j].symbol;
				if (tempSymbol !== 'none') {
					divId = "" + i + j;
					var tempdiv = document.getElementById(divId);
					tempdiv.innerHTML = tempSymbol;
				}
			}
		}
	}
	
	var startNewGame = function() {
		// 1. clear virtual and graphical boards
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				// instantiate a "smart square" on the virtual board
				virtualBoard[i][j] = {isblank: 'true', symbol: 'none'}
			}
		}
		drawBoard();
		
		// 2. ask person if they want to play x's or o's
	}
	
	// TODO: to do the AI thing, this method should take in a Board as input
	// This function iterates over the rows, columns, and two diagonals.
	// If a player has won, it returns the symbol of the winner ('X' or 'O').
	// If no player has won, but the board is full, it returns 'none' (as in, no winner)
	// If no player has won, and the game is not over, it returns 'not over'
	var checkForWinner = function(boardToCheck) {
		var winner = 'none';
		
		// Check rows, check columns, check diagonals
		for (var row=0; row<3; row++) {
			if (boardToCheck[row][0].symbol === boardToCheck[row][1].symbol &&
				boardToCheck[row][1].symbol === boardToCheck[row][2].symbol &&
				boardToCheck[row][0].symbol !== 'none') {
				winner = boardToCheck[row][0].symbol;
			}
		}
		for (var col=0; col<3; col++) {
			if (boardToCheck[0][col].symbol === boardToCheck[1][col].symbol &&
				boardToCheck[1][col].symbol === boardToCheck[2][col].symbol &&
				boardToCheck[0][col].symbol !== 'none') {
				winner = boardToCheck[0][col].symbol;
			}
		}
		if (boardToCheck[0][0].symbol === boardToCheck[1][1].symbol &&		
			boardToCheck[1][1].symbol === boardToCheck[2][2].symbol &&	
			boardToCheck[0][0].symbol !== 'none') {
			winner = boardToCheck[0][0].symbol;
		}
		else if (boardToCheck[0][2].symbol === boardToCheck[1][1].symbol &&		
			boardToCheck[1][1].symbol === boardToCheck[2][0].symbol &&	
			boardToCheck[0][2].symbol !== 'none') {
			winner = boardToCheck[0][2].symbol;
		}
		
		var stalemate = true; 
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				if (boardToCheck[i][j].symbol === 'none') {
					stalemate = false;
				}
			}
		}
		
		if (winner !== 'none') {
			return winner;
		}
		else if (winner === 'none' && stalemate === true) {
			return 'none';
		}
		else {
			return 'not over';
		}
	}
	
	var copyBoard = function(boardToCopy) {
		var newBoard = [];
		for (var i=0; i<3; i++) {
			newBoard[i] = [];
			for (var j = 0; j < 3; j++) {
			    newBoard[i][j] = {};
			    newBoard[i][j].isblank = boardToCopy[i][j].isblank;
			    newBoard[i][j].symbol = boardToCopy[i][j].symbol;
			}
		}
		return newBoard;
	}
	
    // Takes as input a "board" (virtual board to play imaginary moves on) and the symbol for which it's finding an optimal move. (an X or O)
    // Returns a "bestMove" object, which has three fields: result, row, and col. 
    // The "result" field is either 'win', 'lose', or 'stalemate'
    // The row and col fields are the indices of the space that gets the result for the player of "symbol"
    // (Assumes both players play optimally)
	var getOptimalMove = function(board, symbol) {
	    var bestMove = { result: 'none', row: -1, col: -1 };
	    var stalemates = []; // TODO use this
	    var blankspaces = []; // TODO use this

	    var foundWinningMove = false;
	    var i = 0;
	    var j = 0;
	    while (!foundWinningMove && i < 3 && j < 3) {
	        if (board[i][j].isblank) {
                // TODO: add this to blank spaces list
	            // 1. make a copy of the board
	            var boardCopy = copyBoard(board);
	            // 2. current symbol makes an imaginary move on the copy of the board
	            boardCopy[i][j].isblank = false;
	            boardCopy[i][j].symbol = symbol;
	            // 3. check the state of the game now - is it over?
	            var imaginaryWinner = checkForWinner(boardCopy);
	            //  3.a. if game is not over, "switch" current symbol, and call getOptimalMove from opponnent's perspective
	            if (imaginaryWinner === 'not over') {
	                var opponentSymbol;
	                if (symbol === 'X') { opponentSymbol = 'O'; }
	                else { opponentSymbol = 'X'; }
	                var opponentOptimalMove = getOptimalMove(boardCopy, opponentSymbol);
	                // if the result of that  = win, then my result = lose. keep looking.
	                if (opponentOptimalMove.result = 'win') {
	                    i++;
	                    j++;
	                }
	                // if the result of that  = lose, then my result = win (yay! done looking!)
	                else if (opponentOptimalMove.result === 'lose') {
	                    bestMove.result = 'win';
	                    bestMove.row = i;
	                    bestMove.col = j;
	                    foundWinningMove = true;
	                }
	                // if the result of that  = stalemate, then my result = stalemate. keep looking.
	                else {
                        // TODO: add this move to the stalemate options
	                    i++;
	                    j++;
	                }
	            }
	            else {
	                //  3.b. if game is over, check the result
	                //  is the winning symbol the same as my symbol? if so, yay!
	                if (imaginaryWinner === symbol) {
	                    bestMove.result = 'win';
	                    bestMove.row = i;
	                    bestMove.col = j;
	                    foundWinningMove = true;
	                }
	                // is there no winner? add to stalemate options...
	                else if (imaginaryWinner === 'none') {
	                    // TODO add this move to the stalemate options
	                    i++;
	                    j++;
	                }
	                // is the winning symbol not my symbol? :( keep looking...
	                else {
	                    i++;
	                    j++;
	                }
	            }
	        }
	    }

	    var foundStalemate = false;
	    i = 0;
	    j = 0;
	    if (!foundWinningMove) {
	        while (!foundStalemate && i < 3 && j < 3) {
	            if (board[i][j].isblank) {
	                var boardCopy = copyBoard(board);
	                boardCopy[i][j].isblank = false;
	                boardCopy[i][j].symbol = symbol;
	                var imaginaryWinner = checkForWinner(boardCopy);
	                if (imaginaryWinner === 'not over') {
	                    var opponentSymbol;
	                    if (symbol === 'X') { opponentSymbol = 'O'; }
	                    else { opponentSymbol = 'X'; }
	                    var opponentOptimalMove = getOptimalMove(boardCopy, opponentSymbol);
	                    if (opponentOptimalMove.result = 'win') {
	                        i++;
	                        j++;
	                    }
	                    else if (opponentOptimalMove.result === 'lose') {
	                        bestMove.result = 'win';
	                        bestMove.row = i;
	                        bestMove.col = j;
	                        foundWinningMove = true;
	                        i++;
	                        j++;
	                    }
	                    else {
	                        bestMove.result = 'stalemate';
	                        bestMove.row = i;
	                        bestMove.col = j;
	                        foundStalemate = true;
	                    }
	                }
	                else {
	                    if (imaginaryWinner === symbol) {
	                        bestMove.result = 'win';
	                        bestMove.row = i;
	                        bestMove.col = j;
	                        foundWinningMove = true;
	                    }
	                    else if (imaginaryWinner === 'none') {
	                        bestMove.result = 'stalemate';
	                        bestMove.row = i;
	                        bestMove.col = j;
	                        foundStalemate = true;
	                    }
	                    else {
	                        i++;
	                        j++;
	                    }
	                }
	            }
	        }
	    }

	    var foundMove = false;
	    i = 0;
	    j = 0;
	    if (!foundStalemate) {
	        while (!foundMove && i < 3 && j < 3) {
	            if (board[i][j].isblank) {
	                bestMove.result = 'lose';
	                bestMove.row = i;
	                bestMove.col = j;
	                foundMove = true;
	            }
	        }
	    }

	    return bestMove;
	}
	
	var toggleCurrentPlayer = function() {
	    console.log("Toggle player called.");
		if (currPlayer === player1) {
		    currPlayer = player2;
		    console.log("Current player's AI status: " + currPlayer.isAI);
		}
		else {
		    currPlayer = player1;
		    console.log("Current player's AI status: " + currPlayer.isAI);
		}
		
		if (currPlayer.isAI === 'true') {
			AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
			attemptMove(AImove.moveRow, AImove.moveCol);
		}
	}
	
	var attemptMove = function (row, col) {
	    console.log("Attempt move called!");
		if (!isGameOver) {
			if (virtualBoard[row][col].isblank === "true") {
				// 1. Make the move
				virtualBoard[row][col].isblank = "false";
				virtualBoard[row][col].symbol = currPlayer.symbol;
				
				// TODO: check if currPlayer is AI; if so, set a timer to wait to draw the board (so it feels like the computer is "thinking")
				drawBoard();
			
				// 2. Evaluate game state 
				var winner = checkForWinner(virtualBoard);
				if (winner === "not over") {
					isGameOver = false;
					toggleCurrentPlayer();
				}
				else if (winner === 'none') {
					// TODO: it's a stalemate, alert the player, also disable clicking
					// Also maybe disable game or show button to play again?
					isGameOver = true;
					alert("It's a stalemate, mate.");
				}
				else {
					isGameOver = true;
					// TODO: tell player who the winner is, disable clicking, offer a rematch
				}
			}
			else {
				// TODO: display a message that says "nope, that spot is taken!"
				alert("You can't click there!");
			}
		}
		else {
			// TODO: flash the rematch/start over button?
		}
	}
	
	/*
	 * SET UP html and javascript interaction
	 */
	
	// Iterate through the divs and give them onclick events
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			divId = "" + i + j;
			var tempdiv = document.getElementById(divId);
			tempdiv.onclick = function() {
				var row = i;
				var col = j;
				return function() {
					attemptMove(row, col); 
				}
			}();
		}
	}
	
	/*
	 * START the flow of control
	 */
	
	startNewGame();

};