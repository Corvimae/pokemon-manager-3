import { AllowNull, Column, CreatedAt, DataType, Default, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookSpecies extends Model {
  @Column
  name: string;

  @Column
  dexNumber: number;

  @AllowNull
  @Column(DataType.TEXT)
  sprite: string;

  @AllowNull
  @Column(DataType.TEXT)
  animatedSprite: string;

  @Default(false)
  @Column
  isMega: boolean;

  @Default(false)
  @Column
  isGenderDimorphic: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}