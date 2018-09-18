import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import './GameDetails.css'

class GameDetails extends PureComponent {
  state = {
    theRow: 0,
    theCell: 0
  }

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)
  
  selectUnit = (toRow, toCell) => {
    const {game} = this.props
    if (game.board[toRow][toCell] === null) {
      return 
    } else if (game.board[toRow][toCell] != game.turn) {
      return
    } else if (game.board[toRow][toCell] == game.turn)
    return this.setState({
      theRow: toRow, 
      theCell: toCell
    }),
    console.log(this.state)
  }

  makeMove = (toRow, toCell) => {
    const {game, updateGame} = this.props

    if (game.board[toRow][toCell] === null) {
    const board = game.board.map(
      (row, rowIndex) => row.map((cell, cellIndex) => {
        if (rowIndex === toRow && cellIndex === toCell) return game.turn
        else if (rowIndex === this.state.theRow 
          && cellIndex === this.state.theCell) return null
        else return cell
      })
      )
    updateGame(game.id, board)
    this.setState({
      theRow: 0, 
      theCell: 0
    })} else {
      return console.log('Cant move a unit there')
    }
  }


  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>

      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&
        <div>It's your turn!</div>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      {
        winner &&
        <p>Winner: {users[winner].firstName}</p>
      }

      <hr />

      {
        game.status !== 'pending' &&
        <Board board={game.board} selectUnit={this.selectUnit} theState={this.state} makeMove={this.makeMove}/>
      }
    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
