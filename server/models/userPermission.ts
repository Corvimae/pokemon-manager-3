import { Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserPermission extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  type: string;
  
  @Column
  value: number;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}