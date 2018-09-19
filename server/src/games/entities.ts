import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'r' | 'b'

// export type Team = 'red' | 'blue'
export type Unit = {
  name: 'x',
  team: 'r',
  Health: 10,
  type: 'infantry' | 'vehicle'
} | {
  name: 'y',
  team: 'b',
  Health: 10,
  type: 'infantry' | 'vehicle'
}

// const baseUnit: Unit = {
//   name: 'x',
//   team: 'red',
//   Health: 10,
//   type: 'infantry'
// }

export type Row = [ Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null ]
export type Board = [ Row, Row, Row, Row, Row, Row]

type Status = 'pending' | 'started' | 'finished'

const emptyRow: Row = [null, null, null, null, null, null]
const row1: Row = [null, 'r', null, null, null, 'b']
const row2: Row = [null, null, 'b', null, 'r', null]
const emptyBoard: Board = [ emptyRow, row1, emptyRow, emptyRow, row2, emptyRow ]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyBoard})
  board: Board

  @Column('char', {default: 'r'})
  turn: Symbol

  @Column('char', {nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column()
  userId: number

  @Column('char')
  symbol: Symbol
}
