import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookSkill } from './rulebookSkill';

@Table
export class PokemonSkill extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookSkill)
  @Column
  skillId: number

  @Column
  level: number;

  @Column
  bonus: number;

  @Column
  sortOrder: number;
}