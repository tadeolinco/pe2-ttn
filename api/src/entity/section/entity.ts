import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Instructor from '../instructor/entity';
import Student from '../student/entity';
import Team from '../team/entity';

@Entity()
export default class Section {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(type => Instructor, instructor => instructor.sections, {
    onDelete: 'SET NULL',
  })
  instructor: Instructor;

  @OneToMany(type => Student, student => student.section)
  students: Student[];

  @OneToMany(type => Team, team => team.section)
  teams: Team[];
}
