import { BelongsTo, BelongsToMany, Column, CreatedAt, Default, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { PokemonAbility } from './pokemonAbility';
import { PokemonCapability } from './pokemonCapability';
import { PokemonEdge } from './pokemonEdge';
import { PokemonHeldItem } from './pokemonHeldItem';
import { PokemonMove } from './pokemonMove';
import { PokemonSkill } from './pokemonSkill';
import { RulebookAbility } from './rulebookAbility';
import { RulebookCapability } from './rulebookCapability';
import { RulebookEdge } from './rulebookEdge';
import { RulebookHeldItem } from './rulebookHeldItem';
import { RulebookMove } from './rulebookMove';
import { RulebookNature } from './rulebookNature';
import { RulebookSkill } from './rulebookSkill';
import { RulebookSpecies } from './rulebookSpecies';
import { Trainer } from './trainer';

export type PokemonGender = 'male' | 'female' | 'neutral';

@Table({ tableName: 'Pokemon' })
export class Pokemon extends Model {
  @Column
  name: string;

  @ForeignKey(() => Trainer)
  @Column
  trainerId: number;

  @ForeignKey(() => RulebookSpecies)
  @Column
  speciesId: number;

  @Default(0)
  @Column
  experience: number;

  @ForeignKey(() => RulebookNature)
  @Column
  natureId: number;

  @Default('male')
  @Column
  gender: PokemonGender;

  @Default('normal')
  @Column
  type1: string;

  @Default('none')
  @Column
  type2: string;

  @Default('')
  @Column
  notes: string;

  @Default('')
  @Column
  gmNotes: string;

  @Default(0)
  @Column
  currentHealth: number;

  @Column
  sortOrder: number;

  @Default(false)
  @Column
  active: boolean;

  @Default(1)
  @Column
  loyalty: number;

  @Default(0)
  @Column
  baseHP: number;

  @Default(0)
  @Column
  baseAttack: number;

  @Default(0)
  @Column
  baseDefense: number;

  @Default(0)
  @Column
  baseSpAttack: number;

  @Default(0)
  @Column
  baseSpDefense: number;

  @Default(0)
  @Column
  baseSpeed: number;

  @Default(0)
  @Column
  addedHP: number;

  @Default(0)
  @Column
  addedAttack: number;

  @Default(0)
  @Column
  addedDefense: number;

  @Default(0)
  @Column
  addedSpAttack: number;

  @Default(0)
  @Column
  addedSpDefense: number;

  @Default(0)
  @Column
  attackCombatStages: number;

  @Default(0)
  @Column
  defenseCombatStages: number;
  
  @Default(0)
  @Column
  spAttackCombatStages: number;
  
  @Default(0)
  @Column
  spDefenseCombatStages: number;
  
  @Default(0)
  @Column
  speedCombatStages: number;

  @Default(0)
  @Column
  addedSpeed: number;

  @Default(0)
  @Column
  bonusTutorPoints: number;

  @Default(0)
  @Column
  spentTutorPoints: number;

  @BelongsTo(() => Trainer)
  trainer: Trainer;

  @BelongsTo(() => RulebookSpecies)
  species: RulebookSpecies;

  @BelongsTo(() => RulebookNature)
  nature: RulebookNature;

  @BelongsToMany(() => RulebookAbility, () => PokemonAbility)
  abilities: RulebookAbility[];

  @BelongsToMany(() => RulebookHeldItem, () => PokemonHeldItem)
  heldItems: RulebookHeldItem[];

  @BelongsToMany(() => RulebookCapability, () => PokemonCapability)
  capabilities: Array<RulebookCapability & { PokemonCapability: PokemonCapability }>;

  @BelongsToMany(() => RulebookMove, () => PokemonMove)
  moves: Array<RulebookMove & { PokemonMove: PokemonMove }>;
  
  @BelongsToMany(() => RulebookSkill, () => PokemonSkill)
  skills: Array<RulebookSkill & { PokemonSkill: PokemonSkill }>;

  @BelongsToMany(() => RulebookEdge, () => PokemonEdge)
  edges: RulebookEdge[];
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}