import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import { useState } from "react";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYER = {
  X: "Player 1",
  0: "Player 2",
};

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "0";
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((innerArray) => [...innerArray])];
  for (let turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(players, gameBoard) {
  let winner = null;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSymbol = gameBoard[combination[2].row][combination[2].column];

    if (
      firstSymbol &&
      firstSymbol === secondSymbol &&
      firstSymbol === thirdSymbol
    ) {
      winner = players[firstSymbol];
      return winner;
    }
  }
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYER);
  let activePlayer = deriveActivePlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(players, gameBoard);

  const hasDrawn = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    activePlayer = deriveActivePlayer(gameTurns);
    setGameTurns((gameTurns) => {
      let currentPlayer = deriveActivePlayer(gameTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...gameTurns,
      ];

      return updatedTurns;
    });
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((players) => {
      return { ...players, [symbol]: newName };
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  return (
    <menu>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName="Player 2"
            symbol="0"
            isActive={activePlayer === "0"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDrawn) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelect={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </menu>
  );
}

export default App;
