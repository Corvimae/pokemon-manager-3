import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookSkill extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}