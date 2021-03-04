import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookAbility } from './rulebookAbility';

@Table
export class PokemonAbility extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookAbility)
  @Column
  abilityId: number
}