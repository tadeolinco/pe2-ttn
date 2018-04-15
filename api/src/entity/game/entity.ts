import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Student from '../student/entity';
import Team from '../team/entity';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn() id: number;

  @Column() score: number;

  @Column() opponentScore: number;

  @ManyToOne(type => Student, student => student.games, {
    cascadeAll: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  student: Student;

  @ManyToOne(type => Team, team => team.games, {
    cascadeAll: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  team: Team;
}
