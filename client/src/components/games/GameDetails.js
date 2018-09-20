import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame1, updateGame2} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import Menu from './Menu'
import './GameDetails.css'

class GameDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      theRow: -1,
      theCell: -1,
      gameId: 0,
      board: '',
      showMenu: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu = function() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
    if(!this.props.game) console.log("noo")
    if(this.props.game) console.log("see")
  }
  
  // createUnits() {
  //   game.board.map((row) => {
  //     row.map((cell) => {
  //       if(cell == 'red') {
  //         this.setState({red: [...this.state.red, cell]})
  //       }
  //       if(cell == 'blue') {
  //         this.setState({blue: [...this.state.blue, cell]})
  //       }
  //     })
  //   })
  // }

  joinGame = () => this.props.joinGame(this.props.game.id)
  
  // Select a unit
  selectUnit = (toRow, toCell) => {
    const {game} = this.props
    if (game.board[toRow][toCell] === null) {
      return 
    } else if (game.board[toRow][toCell].team !== game.turn) {
      return
    } else if (game.board[toRow][toCell].team === game.turn) {
      return this.setState({
        theRow: toRow, 
        theCell: toCell
      })
    }
  }

  check = (toRow, toCell) => {
    const {game} = this.props
    if (    // Check X co-ordinate right
            (game.board[toRow][toCell+1] !== null && game.board[toRow][toCell+1] !== game.board[toRow][toCell] && game.board[toRow][toCell+1] !== undefined)
            // Check X co-ordinate left
        || (game.board[toRow][toCell-1] !== null && game.board[toRow][toCell-1] !== game.board[toRow][toCell] && game.board[toRow][toCell-1] !== undefined)
        )
        {
          console.log('Enemy next to you')
          this.toggleMenu()
          this.setState({
              gameId: game.id,
              board: game.board
            })
          }
            // Check Y co-ordinates
      else if (toRow === 0) {
        if  (
          (game.board[toRow+1][toCell] !== null && game.board[toRow+1][toCell] !== game.turn)
          ) 
          {
            // Toggle display the menu and set the state of the gameId and board
            // The state is passed on as a prop to <Menu/> so that it can update the game after the turn is ended
            this.toggleMenu()
            this.setState({
              gameId: game.id,
              board: game.board
            })
            console.log('row below you has an enemy')
          } 
        else {
          console.log('No enemy in the vicinity', this.state)
          }
        } 

      else if (toRow === 5) {
        if (
          (game.board[toRow-1][toCell] !== null && game.board[toRow-1][toCell] !== game.turn) 
        ) 
        {
          this.toggleMenu()
          this.setState({
            gameId: game.id,
            board: game.board
          })
          console.log('row above you has an enemy')
        } 
        else {
          console.log('No enemy in the vicinity', this.state)
        }
      }
      
      else if (toRow !== 5 && toRow !== 0) {
        if (
          (game.board[toRow-1][toCell] !== null && game.board[toRow-1][toCell] !== game.turn) 
        || (game.board[toRow+1][toCell] !== null && game.board[toRow+1][toCell] !== game.turn) 
        ) 
        {
          this.toggleMenu()
          this.setState({
            gameId: game.id,
            board: game.board
          })
          console.log('row above or below you has an enemy')
        } else {
          return console.log('No enemy in the vicinity', this.state)
        }
      }
    }

  // Make a move with the indexes from 'selectUnit()'
  makeMove = (toRow, toCell) => {
    const {game, updateGame1} = this.props

    if (game.board[toRow][toCell] === null) {
    const board = game.board.map(
      (row, rowIndex) => row.map((cell, cellIndex) => {
        if (rowIndex === toRow && cellIndex === toCell) return game.board[this.state.theRow][this.state.theCell]
        else if (rowIndex === this.state.theRow 
          && cellIndex === this.state.theCell) return null
        else return cell
      })
      )
      // Do a 'soft' update of the game, not ending the turn
    updateGame1(game.id, board)
    this.setState({
      theRow: -1, 
      theCell: -1
    }), setTimeout(() => {
      this.check(toRow, toCell)
    }, 300) 
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
      <Menu showMenu={this.state.showMenu} board={this.state.board} gameId={this.state.gameId} endTurn={this.props.updateGame2} toggleMenu={this.toggleMenu}/>

      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&
        <div>
          It's your turn!
        </div>
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
  getGames, getUsers, joinGame, updateGame1, updateGame2
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)


