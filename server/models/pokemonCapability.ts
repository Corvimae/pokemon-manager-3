import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookCapability } from './rulebookCapability';

@Table
export class PokemonCapability extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookCapability)
  @Column
  capabilityId: number

  @Column
  value: number;

  @Column
  sortOrder: number;
}