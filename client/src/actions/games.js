import * as request from 'superagent'
import {baseUrl} from '../constants'

export const ADD_GAME = 'ADD_GAME'
export const UPDATE_GAME = 'UPDATE_GAME'
export const UPDATE_GAMES = 'UPDATE_GAMES'
export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS'
export const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS'

export const getGames = () => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .get(`${baseUrl}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => {
      dispatch({
        type: UPDATE_GAMES,
        payload: result.body
      })
    })
    .catch(err => console.error(err))
}

export const joinGame = (gameId) => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .post(`${baseUrl}/games/${gameId}/players`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => {
      dispatch({
        type: JOIN_GAME_SUCCESS
      })
    })
    .catch(err => console.error(err))
}

export const createGame = () => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .post(`${baseUrl}/games`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => {
      dispatch({
        type: ADD_GAME,
        payload: result.body
      })
    })
    .catch(err => console.error(err))
}

export const updateGame = (gameId, board) => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  request
    .patch(`${baseUrl}/games/${gameId}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({board})
    .then(result => {
      dispatch({
        type: UPDATE_GAME_SUCCESS
      })
    })
    .catch(err => console.error(err))
}
