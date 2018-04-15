import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import Game from '../game/entity'
import Section from '../section/entity'
import Student from '../student/entity'

@Entity()
export default class Team {
  @PrimaryGeneratedColumn() id: number

  @ManyToOne(type => Section, section => section.teams, {
    cascadeAll: true,
    onDelete: 'SET NULL',
  })
  section: Section

  @OneToMany(type => Student, student => student.team)
  students: Student[]

  @OneToMany(type => Game, game => game.team)
  games: Game[]
}
