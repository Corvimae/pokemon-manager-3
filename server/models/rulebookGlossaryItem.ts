import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookGlossaryItem extends Model {
  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}