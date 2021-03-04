import { BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { User } from './user';

@Table
export class Trainer extends Model {
  @Column
  name: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Pokemon)
  pokemon: Pokemon[];
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}