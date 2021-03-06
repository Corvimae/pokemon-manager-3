import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class RulebookCapability extends Model {
  @Column
  name: string;

  @Column
  isMovementCapability: boolean;
  
  @Column(DataType.TEXT)
  effect: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}