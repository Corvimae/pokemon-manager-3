import { AllowNull, Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookMove extends Model {
  @Column
  name: string;

  @Column
  type: string;

  @Column
  frequency: string;

  @AllowNull
  @Column
  ac: number;

  @AllowNull
  @Column
  damageBase: number;

  @Column
  damageType: string;

  @Column
  range: string;

  @Column
  effect: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
