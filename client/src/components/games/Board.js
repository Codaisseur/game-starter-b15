import React from "react";
import "./Board.css";

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
  let cellColor = "white";
  if (symbol === "x") {
    cellColor = "red";
  } else if (symbol === "o") {
    cellColor = "yellow";
  }

  return (
    <div
      className={cellColor}
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >
      {/* {symbol || "-"} */}
    </div>
  );
};

export default ({ board, makeMove }) =>
  board.map((cells, rowIndex) => (
    <div className="boardHolderDiv" key={rowIndex}>
      {cells.map((symbol, cellIndex) =>
        renderCel(makeMove, rowIndex, cellIndex, symbol, false)
      )}
    </div>
  ));
