import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookHeldItem } from './rulebookHeldItem';

@Table
export class PokemonHeldItem extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookHeldItem)
  @Column
  heldItemId: number
}