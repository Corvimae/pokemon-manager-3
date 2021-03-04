import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookEdge } from './rulebookEdge';

@Table
export class PokemonEdge extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookEdge)
  @Column
  edgeId: number
}