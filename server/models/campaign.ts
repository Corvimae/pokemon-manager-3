import { Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Campaign extends Model {
  @ForeignKey(() => User)
  @Column
  name: string;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}