import React from 'react'
import './Board.css'


const renderCel = (selectUnit, rowIndex, cellIndex, symbol, hasTurn, theState, makeMove) => {
  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => {
        if (theState.theRow < 1){
        return selectUnit(rowIndex, cellIndex) } else {
        return makeMove(rowIndex, cellIndex)
        }
      }
      } 
      key={`${rowIndex}-${cellIndex}`}
    >{symbol || '-'}</button>
  )
}

export default ({board, selectUnit, theState, makeMove}) => board.map((cells, rowIndex) =>
  <div key={rowIndex}>
    {cells.map((symbol, cellIndex) => renderCel(selectUnit, rowIndex, cellIndex,symbol,false, theState, makeMove))}
  </div>
)
