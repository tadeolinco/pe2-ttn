import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import Game from '../game/entity'
import Section from '../section/entity'
import Team from '../team/entity'

@Entity()
export default class Student {
  @PrimaryGeneratedColumn() id: number

  @Column() firstName: string

  @Column() lastName: string

  @Column({ unique: true })
  studentNumber: string

  @Column() password: string

  @Column() willPlaySingles: boolean

  @Column() willPlayDoubles: boolean

  @ManyToOne(type => Section, section => section.students, {
    cascadeAll: true,
    onDelete: 'SET NULL',
  })
  section: Section

  @ManyToOne(type => Team, team => team.students, {
    cascadeAll: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  team: Team

  @OneToMany(type => Game, game => game.student)
  games: Game[]
}
