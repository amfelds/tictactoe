window.onload = function () {
	/*
	 * INSTANTIATE the global(ish) variables
	 */

	var player1 = {symbol: 'X', isAI: false}
	var player2 = {symbol: 'O', isAI: false}
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
				divId = "" + i + j;
				var tempdiv = document.getElementById(divId);
				if (tempSymbol !== 'none') {
					tempdiv.innerHTML = tempSymbol;
				}
				else if (virtualBoard[i][j].isblank) {
					tempdiv.innerHTML = "";
				}
			}
		}
	}
	
	var resetGame = function() {
		// clear virtual and graphical boards
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				// instantiate a "smart square" on the virtual board
				virtualBoard[i][j] = {isblank: 'true', symbol: 'none'}
			}
		}
		drawBoard();
		currPlayer = player1;
		document.getElementById("turnLabel").innerHTML = "X goes first";
		document.getElementById("gameOverButton").className = "hidden";
		isGameOver = false;
		
		if (currPlayer.isAI) {
			AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
			attemptMove(AImove.row, AImove.col);
		}
	}
	
	var togglePlayerType = function(player) {
		player.isAI = !(player.isAI);

		if (player.isAI) {
			document.getElementById(player.symbol + "AI").innerHTML = "COMPOOTER";
			document.getElementById(player.symbol + "AI").className = "down";
		}
		else {
			document.getElementById(player.symbol + "AI").innerHTML = "HOOMIN";
			document.getElementById(player.symbol + "AI").className = "up";
		}
		
		console.log("player1 AI: " + player1.isAI);
		console.log("player2 AI: " + player2.isAI);
		
		if (currPlayer.isAI) {
			moveToMake = getOptimalMove(virtualBoard, currPlayer.symbol);
			attemptMove(moveToMake.row, moveToMake.col);
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
	
    // Takes in a virtual board and the symbol (X or O) for which to find the best move.
    // Returns an object "bestMove" with three fields:
    // 1. result = 'won | lost | stalemate'
    // 2. row
    // 3. col
    // For debugging purposes, it takes in a symbol that is set to true only if it's a recursive call
	var getOptimalMove = function(board, symbol) {
	    // 1. for each blank space (e.g. possible move)
	    var bestMove = { result: 'none', row: -1, col: -1 };
	    var worstMove = { result: 'none', row: -1, col: -1};

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
						bestMove.row = i;
						bestMove.col = j;
						return bestMove;
					}
					//	1.a.ii if board is at a stalemate, return "stalemate" + move
					else if (moveResult === 'none') {
						bestMove.result = "stalemate";
						bestMove.row = i;
						bestMove.col = j;
					}
					else if (moveResult === 'not over') {
					//	1.a.iv if game is not over, recursively call "makeOptimalMove" with current copy of board and opposite symbol; return "lost" if it returns "won" or "stalemate" + move if it returns "stalemate"
						var opponentSymbol;
						if (symbol === 'X') opponentSymbol = 'O';
						else opponentSymbol = 'X';
						
						var opponentOptimalMove = getOptimalMove(boardCopy, opponentSymbol, true);
						if (opponentOptimalMove.result === 'lost') {
							bestMove.result = 'won';
							bestMove.row = i;
							bestMove.col = j;
							return bestMove;
						}
						else if (opponentOptimalMove.result === 'stalemate') {
							bestMove.result = 'stalemate';
							bestMove.row = i;
							bestMove.col = j;
						}
						else {
						    worstMove.result = 'lost';
						    worstMove.row = i;
						    worstMove.col = j;
						}
					}
					else {
					    worstMove.result = 'lost';
					    worstMove.row = i;
					    worstMove.col = j;
					}
				}
			}
		}

		if (bestMove.result === 'none') {
		    bestMove.result = worstMove.result;
		    bestMove.row = worstMove.row;
		    bestMove.col = worstMove.col;
		}

		return bestMove;
	}
	
	var toggleCurrentPlayer = function() {
		if (currPlayer === player1) {
			currPlayer = player2;
		}
		else {
			currPlayer = player1;
			console.log("currPlayer: " + currPlayer.symbol + ", " + currPlayer.isAI);
		}
		
		document.getElementById("turnLabel").innerHTML = currPlayer.symbol + "'s turn";
		
		if (currPlayer.isAI) {
			AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
			attemptMove(AImove.row, AImove.col);
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
					isGameOver = true;
					document.getElementById("turnLabel").innerHTML =  "Wah-wah. Stalemate!";
					document.getElementById("gameOverButton").innerHTML = "Play again?";
					document.getElementById("gameOverButton").className = "visible";
					// TODO: something hidden becomes unhidden to offer rematch
				}
				else {
				    isGameOver = true;
				    document.getElementById("turnLabel").innerHTML =  "Winner is " + winner;
				    document.getElementById("gameOverButton").innerHTML = "Rematch?";
				    document.getElementById("gameOverButton").className = "visible";
				    // TODO: something hidden becomes unhidden to offer rematch
				}
			}
			else {
				// TODO: play a sound?
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
	
	document.getElementById("XAI").onclick = function() {
		togglePlayerType(player1);
	};
	document.getElementById("OAI").onclick = function() {
		togglePlayerType(player2);
	};
	
	document.getElementById("resetButton").onclick = function() {
		return resetGame();
	};
	document.getElementById("gameOverButton").onclick = function() {
		return resetGame();
	};
	
	/*
	 * START the flow of control
	 */
	
	startNewGame();

};