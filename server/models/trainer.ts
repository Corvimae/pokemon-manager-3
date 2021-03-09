import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Campaign } from './campaign';
import { Pokemon } from './pokemon';
import { User } from './user';

@Table
export class Trainer extends Model {
  @Column
  name: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @AllowNull
  @ForeignKey(() => Campaign)
  @Column
  campaignId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Campaign)
  campaign: Campaign;
  
  @HasMany(() => Pokemon)
  pokemon: Pokemon[];
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}