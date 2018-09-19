import {JOIN_GAME_SUCCESS} from '../actions/games'
/*
The state will contain the games in an object with the game ID as key
*/

export default (state = null, {type, payload}) => {
  switch (type) {
    case JOIN_GAME_SUCCESS:
      return {
        ...state, ...payload
      }

    default:
      return state
  }
}
