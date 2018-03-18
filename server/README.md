# Tic Tac Toe Server

This is a server for playing a multiplayer Tic Tac Toe game. 

It has these endpoints:

* `POST /users`: sign up as new user
* `POST /logins`: log in and receive a JWT
* `POST /games`: create a new game
* `POST /games/:id/players`: join an existing game
* `PATCH /games/:id`: update an existing game
* `GET /games`: list all games
* `GET /users`: list all users

## Running

* You need a working Postgres database that is preferrably empty (drop all the tables) and running 
* Install the dependencies using `yarn install`
* Compile the app (Typescript > Javascript) using `yarn compile` (during development you can use `yarn watch`)
* `yarn start`

You can run the tests with `yarn test`. Currently they only cover the game logic. 
