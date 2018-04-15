import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Section from '../section/entity';

@Entity()
export default class Instructor {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  username: string;

  @Column() password: string;

  @OneToMany(type => Section, section => section.instructor)
  sections: Section[];
}
