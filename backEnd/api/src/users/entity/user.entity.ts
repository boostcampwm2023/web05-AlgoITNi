import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum OAUTH {
  GOOGLE = 'google',
  GITHUB = 'github',
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  authServiceID: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: OAUTH,
  })
  oauth: string;
}
