var board, game = new Chess();
    let gameMode= ' ' ;
    var positionCount;
    let whiteScore = 0;
    let blackScore = 0;
    let whiteDeadPieces = 0;
    let blackDeadPieces = 0;
    let checkCount = 0;
    let timer;
    let seconds = 0;
    let isGameActive = false;
    const GameState = {
        NOT_STARTED: 0,
        ACTIVE: 1,
        ENDED: 2
        // Add more states as necessary
    };
    let startTimestamp = '';
    let formattedEndTimestamp = '';
    let currentGameState = GameState.NOT_STARTED;

    let userName = 'suhi'; // Replace with actual dynamic user name
let isPlaying = false;  // Set this to true when the player starts playing a game

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
window.onload = function() {
    initializeGame();  // Initialize the game settings on load
};

// Function to initialize the game details based on the mode and players
function initializeGame() {
    const player1 = getQueryParam('player1');  // Current user (White)
    const player2 = getQueryParam('player2');  // Invited user (Black)
    gameMode = getQueryParam('gameMode');  // Set gameMode globally

    // Log the value of gameMode for debugging
    console.log("Game Mode inside initializeGame:", gameMode);

    // Check if it's two-player mode (not computer mode)
    if (gameMode !== 'computer' && player1 && player2) {
        // Set the current player as White
        document.getElementById('white-username').textContent = player1;
        // Set the invited player as Black
        document.getElementById('black-username').textContent = player2;
    } else if (gameMode === 'computer') {
        // If it's computer mode, we can set default usernames
        document.getElementById('white-username').textContent = player1;  // Set white player as player1
        document.getElementById('black-username').textContent = player2; // Set black player as 'Computer'
    } else {
        // Fallback if player1 or player2 is missing, show defaults
        document.getElementById('white-username').textContent = 'Player 1 (White)';
        document.getElementById('black-username').textContent = 'Player 2 (Black)';
    }
}



// Function to update availability status
function setAvailability(status) {
    console.log('Updating availability to:', status);
    fetch('/update_availability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, availability: status })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Availability updated:', data);
    })
    .catch(error => {
        console.error('Error updating availability:', error);
    });
}

// Track page visibility and update availability accordingly
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Player has left the website
        setAvailability(0); // Update availability to 0 when leaving the site
    } else {
        // Player is on the website
        if (isPlaying) {
            setAvailability(0); // Player is playing, set availability to 0
        } else {
            setAvailability(1); // Player is not playing, set availability to 1
        }
    }
});

// Track when the player starts or stops playing the game
function startGame() {
    isPlaying = true;
    setAvailability(0); // Player is now playing a game, set availability to 0
}

function stopGame() {
    isPlaying = false;
    if (document.visibilityState === 'visible') {
        setAvailability(1); // Player stopped playing, and is on the website, set availability to 1
    }
}

// Ensure availability is set when the page is about to unload
window.addEventListener('beforeunload', function() {
    setAvailability(0); // Ensure availability is set to 0 when leaving the page
});
    function generateGameId(username) {
    const uuid = crypto.randomUUID(); 
    return `game-${uuid}`; 
}

    
    
    function sendGameData(whiteUserName, blackUserName, whiteScore, blackScore, gameId, startTimestamp, endTimestamp, whiteUserPosition, blackUserPosition) {
        const data = {
            whiteUserName: whiteUserName,   // White player's username
            blackUserName: blackUserName,   // Black player's username
            whiteScore: whiteScore,         // White player's score
            blackScore: blackScore,         // Black player's score
            userPositionWhite: whiteUserPosition,  // White player position
            userPositionBlack: blackUserPosition,  // Black player position
            gameId: gameId,                // Game ID
            startTime: startTimestamp,      // Start timestamp (IST)
            endTime: endTimestamp,
            gameMode: gameMode          // End timestamp (IST)
        };
    
        fetch('/submit_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    

    

    function preloadImages() {
        const pieceImages = [
            '/static/pieces/wP.png',
            '/static/pieces/bP.png',
            '/static/pieces/wR.png',
            '/static/pieces/bR.png',
            '/static/pieces/wN.png',
            '/static/pieces/bN.png',
            '/static/pieces/wB.png',
            '/static/pieces/bB.png',
            '/static/pieces/wK.png',
            '/static/pieces/bK.png',
            '/static/pieces/wQ.png',
            '/static/pieces/bQ.png'
        ];
    
        return Promise.all(pieceImages.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        }));
    }
    
    /*function initializeGame() {
        currentGameId = generateGameId(); // Generate a new game ID at initialization
        preloadImages().then(() => {
            // Initialize the board after images are loaded
            initializeBoard();
            // Update the displayed game ID
            document.getElementById('gameIdDisplay').textContent = currentGameId;
        }).catch(err => {
            console.error("Image preload failed:", err);
        });
    }*/
    
   /* window.onload = function() {
        initializeGame();
        const urlParams = new URLSearchParams(window.location.search);
        gameMode = urlParams.get('mode');
        console.log("Game mode:", gameMode);
    };*/
    
    // Initialize the Chessboard
    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        pieceTheme: 'static/pieces/{piece}.png',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoverSquare: highlightLegalMoves,
        onMouseoutSquare: removeHighlights
    });


   function onDrop(source, target) {
        console.log("Dropping piece from:", source, "to:", target);
    
        if (currentGameState === GameState.NOT_STARTED) {
            // Generate game ID when the first move is made or the game starts
            currentGameId = generateGameId(); // Generate a new game ID
            startTimer();
            
            // Get the current date and time in UTC
            const utcDate = new Date();
            
            // Adjust the time to IST (UTC + 5:30)
            const istOffset = 5.5 * 60; // IST is 5 hours 30 minutes ahead of UTC
            const istTimestamp = new Date(utcDate.getTime() + istOffset * 60 * 1000).toISOString();
            
            // Extract the time portion in IST (toISOString includes the date, so we can modify it as needed)
            startTimestamp = istTimestamp.replace('T', ' ').slice(0, 19); // Remove milliseconds and format
            
            currentGameState = GameState.ACTIVE; // Mark the game as active
            console.log("Game has started with ID:", currentGameId, "at", startTimestamp);
            
            // Update the displayed game ID and start time in IST
            document.getElementById('gameIdDisplay').textContent = `${currentGameId}`;

        }
        // Your other code for handling the drop event...
    
        
        
        // Clear highlights before making the move
        removeHighlights();
    
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q' // Always promote to a queen for simplicity
        });
    
        // Illegal move
        if (move === null) {
            console.log("Illegal move from " + source + " to " + target);
            return 'snapback'; // This will revert the piece to its original position
        }
    
        // Update the score after the move
        updateScore(move);
        displayScore();
    
        console.log("Move made from " + source + " to " + target);
        updateCheckCount();
        displayCheckCount();
    
        // Use requestAnimationFrame for updating the board
        requestAnimationFrame(() => {
            const newFen = game.fen();
            if (board.position() !== newFen) {
                board.position(newFen, false); // Avoid unnecessary redraw
            }
            updateGameState();
        });
        board.position(game.fen()); // Ensure board updates after the move
        updateGameState();
          if (gameMode === 'computer') {
              window.setTimeout(makeBestMove, 150);
          }
        if (game.game_over()) {
            alert('Game over');
            console.log('Game over condition met, sending game data...');
            const whiteUserName = document.getElementById('white-username').textContent;
    const blackUserName = document.getElementById('black-username').textContent;

    // Get the scores (you'll need to define how to get these)
    const whiteScore = getWhiteScore();   // Assuming you have a function to get the white score
    const blackScore = getBlackScore();   // Assuming you have a function to get the black score

    let whiteUserPosition = 1;  // Default position for white
    let blackUserPosition = 0;  // Default position for black

    if (blackScore > whiteScore) {
        whiteUserPosition = 0;   // If black has a higher score, flip positions
        blackUserPosition = 1;
    }

    if (blackScore === whiteScore) {
        whiteUserPosition = 0.5;   // If black has a higher score, flip positions
        blackUserPosition = 0.5;
    }

    // Send game data along with the start timestamp and the end timestamp
    console.log(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp);
    sendGameData(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp, whiteUserPosition, blackUserPosition);
  }
        // AI Move
      
    }

    // Add the event listener for the 'End Game' button
document.getElementById('endGameButton').addEventListener('click', function() {
    endGame();
});
/*function onDrop(source, target) {
    console.log("Dropping piece from:", source, "to:", target);

    // Check if gameMode is correctly set
    console.log("Current gameMode:", gameMode);

    if (currentGameState === GameState.NOT_STARTED) {
        // Generate game ID when the first move is made or the game starts
        currentGameId = generateGameId(); // Generate a new game ID
        startTimer();
        
        // Get the current date and time in UTC
        const utcDate = new Date();
        
        // Adjust the time to IST (UTC + 5:30)
        const istOffset = 5.5 * 60; // IST is 5 hours 30 minutes ahead of UTC
        const istTimestamp = new Date(utcDate.getTime() + istOffset * 60 * 1000).toISOString();
        
        // Extract the time portion in IST (toISOString includes the date, so we can modify it as needed)
        startTimestamp = istTimestamp.replace('T', ' ').slice(0, 19); // Remove milliseconds and format
        
        currentGameState = GameState.ACTIVE; // Mark the game as active
        console.log("Game has started with ID:", currentGameId, "at", startTimestamp);
        
        // Update the displayed game ID and start time in IST
        document.getElementById('gameIdDisplay').textContent = `${currentGameId}`;
    }

    // Clear highlights before making the move
    removeHighlights();

    // Make the move on the board
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });

    // If move is illegal, revert the piece
    if (move === null) {
        console.log("Illegal move from " + source + " to " + target);
        return 'snapback'; // This will revert the piece to its original position
    }

    // Update the score after the move
    updateScore(move);
    displayScore();

    console.log("Move made from " + source + " to " + target);
    updateCheckCount();
    displayCheckCount();

    // Use requestAnimationFrame for updating the board
    requestAnimationFrame(() => {
        const newFen = game.fen();
        if (board.position() !== newFen) {
            board.position(newFen, false); // Avoid unnecessary redraw
        }
        updateGameState();
    });

    // If the game is over, handle it (send game data)
    if (game.game_over()) {
        alert('Game over');
        console.log('Game over condition met, sending game data...');

        // Send game data along with start timestamp and end timestamp
        const whiteUserName = document.getElementById('white-username').textContent;
        const blackUserName = document.getElementById('black-username').textContent;

        // Get the scores (assuming you have functions to get the scores)
        const whiteScore = getWhiteScore();
        const blackScore = getBlackScore();

        let whiteUserPosition = 1;
        let blackUserPosition = 0;

        if (blackScore > whiteScore) {
            whiteUserPosition = 0;
            blackUserPosition = 1;
        }

        if (blackScore === whiteScore) {
            whiteUserPosition = 0.5;
            blackUserPosition = 0.5;
        }

        console.log(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp);
        sendGameData(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp, whiteUserPosition, blackUserPosition);
    }

    // If gameMode is computer, trigger AI move after human move
    console.log("Before AI check: gameMode === 'computer' is", gameMode === 'computer'); // Add a debug here
    if (gameMode === 'computer' && !game.game_over()) {
        console.log("AI's turn to move");
        window.setTimeout(makeBestMove, 150);  // Delay AI move slightly to ensure smooth gameplay
    }
}*/


// Function to end the game manually
function endGame() {
    if (game.game_over()) {
        console.log('Game already over');
        return;
    }

    currentGameState = GameState.ENDED;
    console.log('Game manually ended');

    // Stop the timer and capture the game end time (timestamp)
    stopTimer();

    // Get the current date and time in UTC
    const utcEndDate = new Date();
    
    // Adjust the time to IST (UTC + 5:30)
    const istOffset = 5.5 * 60; // IST is 5 hours 30 minutes ahead of UTC
    const istEndTimestamp = new Date(utcEndDate.getTime() + istOffset * 60 * 1000).toISOString();

    // Format the end timestamp and store it in the global variable
    formattedEndTimestamp = istEndTimestamp.replace('T', ' ').slice(0, 19); 

    // Log the end time to verify it's correct
    console.log("Game ended at:", formattedEndTimestamp);

    // Get the usernames from the DOM (white and black players)
    const whiteUserName = document.getElementById('white-username').textContent;
    const blackUserName = document.getElementById('black-username').textContent;

    // Get the scores (you'll need to define how to get these)
    const whiteScore = getWhiteScore();   // Assuming you have a function to get the white score
    const blackScore = getBlackScore();   // Assuming you have a function to get the black score

    let whiteUserPosition = 1;  // Default position for white
    let blackUserPosition = 0;  // Default position for black

    if (blackScore > whiteScore) {
        whiteUserPosition = 0;   // If black has a higher score, flip positions
        blackUserPosition = 1;
    }

    if (blackScore === whiteScore) {
        whiteUserPosition = 0.5;   // If black has a higher score, flip positions
        blackUserPosition = 0.5;
    }

    // Send game data along with the start timestamp and the end timestamp
    console.log(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp);
    sendGameData(whiteUserName, blackUserName, whiteScore, blackScore, currentGameId, startTimestamp, formattedEndTimestamp, whiteUserPosition, blackUserPosition);

    document.getElementById('gameStatus').textContent = 'Game Over';
    disableBoard();
    board.position(game.fen(), false);

    // Redirect to the user stats page after the game ends
    window.location.href = "/userstats"; // Change this URL if needed
}

  function getWhiteScore(){
    return whiteScore;
  } 
  
  function getBlackScore(){
    return blackScore;
  } 

  function disableBoard() {
    board.destroy(); // Destroys the board and removes event listeners
}


  function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

function startTimer() {
    if (!isGameActive) {
        isGameActive = true;
        timer = setInterval(updateTimer, 1000);
    }
}

function stopTimer() {
    clearInterval(timer);
    isGameActive = false;
}


function pieceValues(pieces) {
  let totalValue = 0;
  const pieceValueMap = {
      'p': 10,  // Pawn
      'r': 50,  // Rook
      'n': 30,  // Knight
      'b': 30,  // Bishop
      'q': 90,  // Queen
      'k': 0   // King (not counted)
  };

  pieces.forEach(piece => {
      // Assuming piece has a type property to determine its value
      totalValue += pieceValueMap[piece.type.toLowerCase()] || 0; 
  });

  return totalValue;
}


    // AI Move
    function makeBestMove() {
        positionCount = 0;
        var depth = 3; // You can adjust the depth
        var bestMove = minimaxRoot(depth, game, true);
        game.move(bestMove);
        board.position(game.fen()); // Ensure board updates after the move
        // Check if the game is over
        if (game.game_over()) {
            alert('Game over');
        }
        updateGameState();
    }

    // Update game state
    function updateGameState() {
      console.log("Updating game state...");
      try {
          displayScore();
      } catch (error) {
          console.error("Error in displayScore:", error);
      }
      try {
          displayDeadPieces();
      } catch (error) {
          console.error("Error in displayDeadPieces:", error);
      }
      try {
          displayNumberOfMoves();
      } catch (error) {
          console.error("Error in displayNumberOfMoves:", error);
      }
      try {
          displayCheckCount();
      } catch (error) {
          console.error("Error in displayCheckCount:", error);
      }
  }
  


// Define piece values for scoring
function pieceValues(capturedPiece) {
    // Example: Define the values for each type
    const values = { p: 10, n: 30, b: 30, r: 50, q: 90 };
    return values[capturedPiece[0].type] || 0;
}

// Function to update the score based on the move
function updateScore(move) {
    if (move.captured) {
        // Get the value of the captured piece
        let capturedPieceValue = pieceValues([{ type: move.captured }]);
        
        // Update score based on which player captured
        if (move.color === 'w') {
            whiteScore += capturedPieceValue;
            blackDeadPieces++;
        } else {
            blackScore += capturedPieceValue;
            whiteDeadPieces++;
        }
    }
    
    // Check for check and checkmate
    if (game.in_checkmate()) {
        if (move.color === 'w') {
            whiteScore += 300; // White checkmates Black
        } else {
            blackScore += 300; // Black checkmates White
        }
    } else if (game.in_check()) {
        if (move.color === 'w') {
            whiteScore += 150; // White checks Black
        } else {
            blackScore += 150; // Black checks White
        }
    }
}

// Function to display both scores
function displayScore() {
    $('#whiteScore').text(whiteScore);
    $('#blackScore').text(blackScore);
    $('#whiteDeadPieces').text(whiteDeadPieces);
    $('#blackDeadPieces').text(blackDeadPieces);
}


    // Display the number of moves made
    function displayNumberOfMoves() {
      let history = game.history();
      let whiteMoves = 0;
      let blackMoves = 0;
  
      // Count moves for each color
      history.forEach((move, index) => {
          if (index % 2 === 0) {
              whiteMoves++;
          } else {
              blackMoves++;
          }
      });
  
      // Update the UI with separate counts
      $('#whiteMoves').text(whiteMoves);
      $('#blackMoves').text(blackMoves);
  }
  
  // Call displayNumberOfMoves() after each move to update the counts
  

    // Display the number of checks
    


    let checkCountWhite = 0;
    let checkCountBlack = 0;
    
    function updateCheckCount() {
      if (game.in_check()) {
          // Determine which side is in check and update the counter
          if (game.turn() === 'b') { // Black is in check, meaning White caused it
              checkCountWhite++;
              console.log("White puts Black in check. Total checks by White: " + checkCountWhite);
          } else { // White is in check, meaning Black caused it
              checkCountBlack++;
              console.log("Black puts White in check. Total checks by Black: " + checkCountBlack);
          }
      } else {
          console.log("No check detected in the current move.");
      }
  }
  
  // Display function for the check counts
  function displayCheckCount() {
      $('#whiteChecks').text(checkCountWhite);
      $('#blackChecks').text(checkCountBlack);
  }
    

// Call updateCheckCount() and displayCheckCount() after each move

    
    // Call updateCheckCount() and displayCheckCount() after each move
    

// Call updateCheckCount() every time a move is made, and then displayCheckCount() to update the UI

  
    // Minimax Algorithm and other related functions remain unchanged...
    function minimaxRoot(depth, game, isMaximizingPlayer) {
        var newGameMoves = game.moves();  // Get legal moves
        var bestMove = -9999;
        var bestMoveFound;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            var value = minimax(depth - 1, game, !isMaximizingPlayer);
            game.undo();
            if (value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMoves[i];
            }
        }
        return bestMoveFound;
    }

    var minimax = function(depth, game, alpha, beta, isMaximisingPlayer) {
        positionCount++;
        if (depth === 0) {
            return -evaluateBoard(game.board());
        }
        var newGameMoves = game.moves();
        if (isMaximisingPlayer) {
            var bestMove = -9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                game.move(newGameMoves[i]);
                bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
                game.undo();
                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            var bestMove = 9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                game.move(newGameMoves[i]);
                bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
                game.undo();
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    };

    // Board Evaluation
    var evaluateBoard = function(board) {
        var totalEvaluation = 0;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                totalEvaluation += getPieceValue(board[i][j], i, j);
            }
        }
        return totalEvaluation;
    };

    // Piece Values
    var getPieceValue = function(piece, x, y) {
        if (piece === null) return 0;
        var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
        return piece.color === 'w' ? absoluteValue : -absoluteValue;
    };

    var getAbsoluteValue = function(piece, isWhite, x, y) {
        if (piece.type === 'p') {
            return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
        } else if (piece.type === 'r') {
            return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
        } else if (piece.type === 'q') {
            return 90 + evalQueen(piece, x, y);
        } else if (piece.type === 'k') {
            return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    function evalQueen(piece, x, y) {
      if (piece.color === 'w') {
          return queenEvalWhite[y][x]; // For white queen
      } else {
          return queenEvalBlack[y][x]; // For black queen
      }
  }
  

    /* Piece-Specific Evaluation Tables */
  var pawnEvalWhite = [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]];
  var pawnEvalBlack = reverseArray(pawnEvalWhite);
  var knightEval = [[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.0, 2.0, 2.0, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]];
  var bishopEvalWhite = [[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]];
  var bishopEvalBlack = reverseArray(bishopEvalWhite);
  var rookEvalWhite = [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]];
  var rookEvalBlack = reverseArray(rookEvalWhite);
  var kingEvalWhite = [[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -3.0, -3.0, -2.0, -2.0, -1.0],
    [2.0, 3.0, 2.0, 0.0, 0.0, 2.0, 3.0, 2.0],
    [2.0, 3.0, 2.0, 0.0, 0.0, 2.0, 3.0, 2.0]];
  var kingEvalBlack = reverseArray(kingEvalWhite);
  var queenEvalWhite = [[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-0.5, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -0.5],
    [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]];
var queenEvalBlack = reverseArray(queenEvalWhite);
  
  /* Helper Function to Reverse Arrays */
  function reverseArray(array) {
    return array.slice().reverse();
  }
  let selectedHint = null;

  function generateHints() {
    // Show "Generating hints" message and hide the apply button initially
    $('#hintModal').show();
// Show generating message
    $('#apply-hint').hide(); // Hide apply hint button until hints are ready

    // Ensure the modal is visible while we are generating hints
   // $('#hintModal').show(); // This ensures the modal is visible while generating hints

    const hints = [];
    const legalMoves = game.moves();

    // Perform the hint generation process
    legalMoves.forEach(move => {
        game.move(move);
        const score = minimax(3, game, -Infinity, Infinity, false); // Adjust depth as needed
        game.undo();
        hints.push({ move: move, score: score });
    });

    // Sort hints by score in descending order
    hints.sort((a, b) => b.score - a.score);

    // Get the top hint (slice(0, 1) for top 1, slice(0, 3) for top 3, etc.)
    const topHints = hints.slice(0, 1); // Show the top 1 hint for now

    // Hide "Generating hints" message after the computation is done
    $('#generating-hints-message').hide();
    
    $('#purpop').hide();
    // Display hints in the modal
    const hintList = $('#hint-list');
hintList.empty();  // Clear previous hints

topHints.forEach((hint, index) => {
    // Create a new list item
    const li = $('<li></li>');  // Create a new <li> using jQuery
    
    // Set the data-move attribute
    li.attr('data-move', hint.move);
    
    // Set the text content for the list item
    li.text(`Move: ${hint.move} (Score: ${hint.score})`);
    
    // Append the list item to the hint list
    hintList.append(li);  // Use jQuery's append()
});


    selectedHint = topHints[0].move; // Default to the first hint
    $('#apply-hint').show(); // Show apply button once hints are ready
}
// Apply the selected hint move
$('#apply-hint').click(function() {
    if (selectedHint) {
        game.move(selectedHint);
        board.position(game.fen());
        $('#hintModal').hide(); // Close the modal after applying the hint
        removeHighlights(); // Clean up any highlights
    }
});

// Close the modal
$('.close').click(function() {
    $('#hintModal').hide();
});

// Highlight selected hint and set it as the move to apply
$(document).on('click', '#hint-list li', function() {
    $('#hint-list li').removeClass('selected');
    $(this).addClass('selected');
    selectedHint = $(this).data('move');
});


  /* Highlight legal moves */
  function highlightLegalMoves(square) {
    // If there's no piece on this square, do not highlight legal moves
    if (game.get(square) === null) return;

    var moves = game.moves({
      square: square,
      verbose: true
    });

    // If there are no moves available, do not highlight
    if (moves.length === 0) return;

    for (var i = 0; i < moves.length; i++) {
      highlightSquare(moves[i].to);
    }
  }

  /* Highlight a square */
  function highlightSquare(square) {
    $('#' + square).addClass('highlight');
  }

  /* Remove highlights from squares */
  function removeHighlights() {
    $('#board .square').removeClass('highlight');
  }

  /* Check if a piece can be dragged */
  function onDragStart (source, piece, position, orientation) {
    // Do not allow dragging of pieces that are not of the current player's color
    if ((game.in_check() && piece.search(game.turn()) === -1) || game.game_over()) {
      return false;
    }
  }



  function openwhitedetails() {
    document.getElementById("whitedetails").classList.add('open');
  }
  function closewhitedetails() {
    document.getElementById("whitedetails").classList.remove('open');
}
function openblackdetails() {
  document.getElementById("blackdetails").classList.add('open');
}
function closeblackdetails() {
  document.getElementById("blackdetails").classList.remove('open');
}
document.getElementById('whites').addEventListener('click', function () {
  openwhitedetails();
});
document.getElementById('blacks').addEventListener('click', function () {
  openblackdetails();
});
