function GameBoard() {
  const board = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => "")
  );

  const getBoard = () => board;

  const placeMark = (row, col, mark) => {
    if (board[row][col] !== "") return false;
    board[row][col] = mark;
    return true;
  };

  const reset = () => {
    board.forEach(row => row.fill(""));
  };

  return { getBoard, placeMark, reset };
}

function Player(name, mark) {
  return { name, mark };
}

function GameController() {
  const board = GameBoard();
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const b = board.getBoard();
    const winPatterns = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
    ];

    return winPatterns.some(pattern =>
      pattern.every(([r, c]) => b[r][c] === currentPlayer.mark)
    );
  };

  const isDraw = () => {
    return board.getBoard().flat().every(cell => cell !== "");
  };

  const playRound = (row, col) => {
    if (gameOver) return null;

    if (board.placeMark(row, col, currentPlayer.mark)) {
      if (checkWinner()) {
        gameOver = true;
        return `${currentPlayer.name} wins!`;
      }

      if (isDraw()) {
        gameOver = true;
        return "Draw!";
      }

      switchPlayer();
    }

    return null;
  };

  const resetGame = () => {
    board.reset();
    currentPlayer = player1;
    gameOver = false;
  };

  return {
    playRound,
    getBoard: board.getBoard,
    resetGame,
    getCurrentPlayer: () => currentPlayer
  };
}

const game = GameController();
const boardElement = document.querySelector(".board");
const statusText = document.querySelector(".status");
const resetBtn = document.querySelector(".reset");

function render() {
  boardElement.innerHTML = "";
  const board = game.getBoard();

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;

      if (cell === "X") cellDiv.classList.add("X");
      if (cell === "O") cellDiv.classList.add("O");

      cellDiv.addEventListener("click", () => handleClick(rowIndex, colIndex));
      boardElement.appendChild(cellDiv);
    });
  });
}

function handleClick(row, col) {
  const result = game.playRound(row, col);
  render();

  if (result) {
    statusText.textContent = result;
    statusText.classList.remove("alert-secondary");
    statusText.classList.add("alert-info");
  } else {
    statusText.textContent = `${game.getCurrentPlayer().name}'s turn`;
  }
}

resetBtn.addEventListener("click", () => {
  game.resetGame();
  statusText.textContent = "Player 1's turn";
  statusText.classList.remove("alert-info");
  statusText.classList.add("alert-secondary");
  render();
});

render();