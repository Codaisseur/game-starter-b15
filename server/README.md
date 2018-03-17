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
