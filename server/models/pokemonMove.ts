import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Pokemon } from './pokemon';
import { RulebookMove } from './rulebookMove';

@Table
export class PokemonMove extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number

  @ForeignKey(() => RulebookMove)
  @Column
  moveId: number

  @Column
  isTutorMove: boolean;
  
  @Column
  typeOverride: string;

  @Column 
  isPPUpped: boolean;
  
  @Column
  sortOrder: number;
}