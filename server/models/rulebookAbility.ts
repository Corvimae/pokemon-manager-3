import { AllowNull, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookAbility extends Model {
  @Column
  name: string;

  @Column
  actionType: string;

  @Column
  frequency: string;

  @AllowNull
  @Column
  trigger: string;

  @Column(DataType.TEXT)
  effect: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}