import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  profileId: string;
  
  @Column
  displayName: string;

  @Column
  email: string;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}