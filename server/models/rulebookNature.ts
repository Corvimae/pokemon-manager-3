import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookNature extends Model {
  @Column
  name: string;

  @Column
  boostedStat: string;

  @Column
  reducedStat: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}