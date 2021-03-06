import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookHeldItem extends Model {
  @Column
  name: string;

  @Column(DataType.TEXT)
  effect: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}