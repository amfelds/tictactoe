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
	
	var getOptimalMove = function(board, symbol) {
		// 1. for each blank space (e.g. possible move)
		var bestMove = {result: 'none', moveRow: -1, moveCol: -1};
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				if (board[i][j].symbol === 'none') {
					// 	1.a. copy the input board, make move
					boardCopy = copyBoard(board);
					boardCopy[i][j].symbol = symbol;
					boardCopy.isBlank = 'false';
					moveResult = checkForWinner(boardCopy);
					// 	1.a.i if input symbol won, return "won!" + move
					if (moveResult === symbol) {
						bestMove.result = 'won';
						bestMove.moveRow = i;
						bestMove.moveCol = j;
						break;
					}
					//	1.a.ii if board is at a stalemate, return "stalemate" + move
					else if (moveResult === 'none') {
						bestMove.result = "stalemate";
						bestMove.moveRow = i;
						bestMove.moveCol = j;
						break;
					}
					else if (moveResult === 'not over') {
					//	1.a.iv if game is not over, recursively call "makeOptimalMove" with current copy of board and opposite symbol; return "lost" if it returns "won" or "stalemate" + move if it returns "stalemate"
						var opponentSymbol;
						if (symbol === 'X') opponentSymbol = 'O';
						else opponentSymbol = 'X';
						
						var opponentOptimalMove = getOptimalMove(boardCopy, opponentSymbol);
						if (opponentOptimalMove.result === 'lost') {
							bestMove.result = 'won';
							bestMove.moveRow = i;
							bestMove.moveCol = j;
							break;
						}
						else if (opponentOptimalMove.result === 'stalemate') {
							bestMove.result = 'stalemate';
							bestMove.moveRow = i;
							bestMove.moveCol = j;
							break;
						}
						else {
							bestMove.result = 'lost';
							bestMove.moveRow = i;
							bestMove.moveCol = j;
						}
					}
					else {
						bestMove.result = 'lost';
						bestMove.moveRow = i;
						bestMove.moveCol = j;
					}
				}
			}
		}
		return bestMove;
	}
	
	var toggleCurrentPlayer = function() {
		// TODO for now, all players are not AI
		if (currPlayer === player1) {
			currPlayer = player2;
		}
		else {
			currPlayer = player1;
		}
		
		if (currPlayer.isAI === 'true') {
			AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
			attemptMove(AImove.moveRow, AImove.moveCol);
		}
	}
	
	var attemptMove = function (row, col) {
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
				    alert("Winner is " + winner);
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