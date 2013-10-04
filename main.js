window.onload = function () {
	/*
	 * INSTANTIATE the global(ish) variables
	 */

	var player1 = {symbol: 'X', isAI: false}
	var player2 = {symbol: 'O', isAI: false}
	var currPlayer = player1;
	
	var isGameOver = false;
	var isHumanTurn = true;
	
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

	    //clear canvas elements
		var c = document.getElementById("chalkcanvas");
		var ctx = c.getContext("2d");
		ctx.clearRect(0, 0, 300, 300);

        // reset game info
		currPlayer = player1;
		document.getElementById("turnLabel").innerHTML = "X goes first";
		document.getElementById("gameOverButton").className = "hidden";
		isGameOver = false;
		
        // let the games begin!
		if (currPlayer.isAI) {
		    isHumanTurn = false;
		    AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
		    attemptMove(AImove.row, AImove.col);
		}
		else {
		    isHumanTurn = true;
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
		
		if (currPlayer.isAI) {
		    isHumanTurn = false;
			moveToMake = getOptimalMove(virtualBoard, currPlayer.symbol);
			setTimeout(function () {
			    attemptMove(moveToMake.row, moveToMake.col);
			}, 900);
		}
	}
	
	var startNewGame = function() {
		// clear virtual and graphical boards
		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				// instantiate a "smart square" on the virtual board
				virtualBoard[i][j] = {isblank: 'true', symbol: 'none'}
			}
		}
		drawBoard();
	}

	var chalkStroke = function (x1, y1, x2, y2) {
	    var c = document.getElementById("chalkcanvas");
	    var ctx = c.getContext("2d");
	    ctx.moveTo(x1, y1);
	    ctx.lineTo(x2, y2);
	    ctx.stroke();
	}
	
    // TODO factor the stroke drawing out into a helper function that takes an x,y start and stop coord
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
			    // raw line across row
			    var c = document.getElementById("chalkcanvas");
			    var ctx = c.getContext("2d");
			    var strokeX = (row * 100) + 50;
			    ctx.moveTo(0, strokeX);
			    ctx.lineTo(300, strokeX);
			    ctx.stroke();
			}
		}
		for (var col=0; col<3; col++) {
			if (boardToCheck[0][col].symbol === boardToCheck[1][col].symbol &&
				boardToCheck[1][col].symbol === boardToCheck[2][col].symbol &&
				boardToCheck[0][col].symbol !== 'none') {
			    winner = boardToCheck[0][col].symbol;
			    // draw line down column
			    var c = document.getElementById("chalkcanvas");
			    var ctx = c.getContext("2d");
			    var strokeY = (col * 100) + 50;
			    ctx.moveTo(strokeY, 0);
			    ctx.lineTo(strokeY, 300);
			    ctx.stroke();
			}
		}
		if (boardToCheck[0][0].symbol === boardToCheck[1][1].symbol &&		
			boardToCheck[1][1].symbol === boardToCheck[2][2].symbol &&	
			boardToCheck[0][0].symbol !== 'none') {
		    winner = boardToCheck[0][0].symbol;
		    // draw diagonal
		    var c = document.getElementById("chalkcanvas");
		    var ctx = c.getContext("2d");
		    ctx.moveTo(1, 10);
		    ctx.lineTo(289, 299);
		    ctx.stroke();
		}
		else if (boardToCheck[0][2].symbol === boardToCheck[1][1].symbol &&		
			boardToCheck[1][1].symbol === boardToCheck[2][0].symbol &&	
			boardToCheck[0][2].symbol !== 'none') {
		    winner = boardToCheck[0][2].symbol;
		    // draw diagonal
		    var c = document.getElementById("chalkcanvas");
		    var ctx = c.getContext("2d");
		    ctx.moveTo(299, 1);
		    ctx.lineTo(1, 299);
		    ctx.stroke();
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
		}

		if (currPlayer.isAI) {
		    isHumanTurn = false;
		}
		else {
		    isHumanTurn = true;
		}
		
		document.getElementById("turnLabel").innerHTML = currPlayer.symbol + "'s turn";
		
		if (currPlayer.isAI) {
			AImove = getOptimalMove(virtualBoard, currPlayer.symbol);
			setTimeout(function () {
			    attemptMove(AImove.row, AImove.col);
			}, 900);
		}
	}
	
	var attemptMove = function (row, col) {
		if (!isGameOver) {
			if (virtualBoard[row][col].isblank === "true") {
				// 1. Make the move
				virtualBoard[row][col].isblank = "false";
				virtualBoard[row][col].symbol = currPlayer.symbol;
				
				drawBoard();
			
				// 2. Evaluate game state 
				var winner = checkForWinner(virtualBoard);
				if (winner === "not over") {
					isGameOver = false;
					toggleCurrentPlayer();
				}
				else if (winner === 'none') {
					isGameOver = true;
					document.getElementById("turnLabel").innerHTML =  "Stalemate!";
					document.getElementById("gameOverButton").innerHTML = "Play again?";
					document.getElementById("gameOverButton").className = "visible";
				}
				else {
				    isGameOver = true;
				    document.getElementById("turnLabel").innerHTML =  "Winner is " + winner;
				    document.getElementById("gameOverButton").innerHTML = "Rematch?";
				    document.getElementById("gameOverButton").className = "visible";
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
				return function () {
				    if (isHumanTurn) {
				        attemptMove(row, col);
				    }
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