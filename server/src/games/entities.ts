import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'red' | 'blue'
export type Base = 'HQ'

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
//   team: 'r',
//   Health: 10,
//   type: 'infantry'
// }

export type Row = [ Symbol | Base | null, Symbol | Base | null, Symbol | Base | null, 
                  Symbol | Base | null, Symbol | Base | null, Symbol | Base | null ]
export type Board = [ Row, Row, Row, Row, Row, Row]

type Status = 'pending' | 'started' | 'finished'

const emptyRow: Row = [null, null, null, null, null, null]
const row1: Row = ['red', null, null, null, null, 'blue']
const row2: Row = ['HQ', 'red', null, null, 'blue', 'HQ']
const emptyBoard: Board = [ emptyRow, row1, row2, row1, emptyRow, emptyRow ]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyBoard})
  board: Board

  @Column('text', {default: 'red'})
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

  @Column('text')
  symbol: Symbol
}
