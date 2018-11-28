import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

//changed type Symbol = 'x' | 'o' with type Color = '#4286f4' | '#fcf953' | '#ce792f'
export type Color = '#4286f4' | '#fcf953' | '#ce792f'
// export type Row = [ Symbol | null, Symbol | null, Symbol | null ]
export type PickCode = [ Color | null, Color | null, Color | null ]
export type Palette = Array<Color>

type Status = 'pending' | 'started' | 'finished'

// const secretCode: Row = []
export const palette = ['#4286f4', '#fcf953', '#ce792f']
const emptyPickCodeRow: PickCode = [null, null, null]


@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json')
  secretCode: Array<Color>

  @Column('json', {default: emptyPickCodeRow})
  //the turn
  playerInput: PickCode

  @Column('json', {default: palette})
  palette: Array<Color>

  @Column('char', {length:1, default: 'x'})
  turn: Symbol

  @Column('char', {length:1, nullable: true})
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

  @Column('char', {length: 1})
  symbol: Symbol
}
