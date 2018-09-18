import React from 'react'
import './Board.css'


const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn, theState, makeMove3) => {
  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => {
        if (theState.theRow < 1){
        return makeMove(rowIndex, cellIndex) } else {
        return makeMove3(rowIndex, cellIndex)
        }
      }
      } 
      key={`${rowIndex}-${cellIndex}`}
    >{symbol || '-'}</button>
  )
}

export default ({board, makeMove, theState, makeMove3}) => board.map((cells, rowIndex) =>
  <div key={rowIndex}>
    {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,false, theState, makeMove3))}
  </div>
)
