import * as React from 'react'

// This component renders the menu that shows up after a unit encounters an enemy
// The end turn function returns updateGame2 which updates the games board
// And ends the turn
export default class Menu extends React.Component {
    render() {
        return (
            <div>
                {this.props.showMenu && 
                <div>
                <button>Fire</button>
                <button onClick={() => this.props.endTurn(this.props.gameId, this.props.board)}>End turn</button>
                </div>}
            </div>
        )
    }
}