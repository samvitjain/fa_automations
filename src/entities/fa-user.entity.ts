/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FAUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  asanaId: string;

  @Column()
  telegramChatId: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CST,
  })
  userType: UserType
}
