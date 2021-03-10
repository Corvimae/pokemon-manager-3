import { Column, CreatedAt, Default, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class PokemonStats extends Model {
  @Default(0)
  @Column
  hp: number;

  @Default(0)
  @Column
  attack: number;

  @Default(0)
  @Column
  defense: number;

  @Default(0)
  @Column
  spAttack: number;

  @Default(0)
  @Column
  spDefense: number;

  @Default(0)
  @Column
  speed: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}