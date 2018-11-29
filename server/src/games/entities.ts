import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Color = '#4286f4' | '#fcf953' | '#ce792f'
export type Guess = [ Color | null, Color | null, Color | null ]
export type Palette = Array<Color>

type Status = 'pending' | 'started' | 'finished'

export const palette: Array<Color> = ['#4286f4', '#fcf953', '#ce792f']
const emptyPickCodeRow: Guess = [null, null, null]


@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json')
  secretCode: Array<Color>

  //turn
  @Column('boolean', {default: true})
  playerOneTurn: Boolean

  @Column('json', {default: palette})
  palette: Array<Color>

  
  // @Column('char', {length:1, nullable: true})
  // winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]
}

@Entity()
@Index(['game', 'user'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', {default: emptyPickCodeRow})
  playerGuess: Guess

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  // @Column()
  // userId: number
}
