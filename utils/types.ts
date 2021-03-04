export type MobileMode = 'data' | 'stats' | 'moves' | 'notes' | 'allies';

export type Frequency = 'At-Will' | 'EOT' | 'Battle' | 'Center';

export type Gender = 'neutral' | 'male' | 'female';
  
export interface AlliedPokemon {
  id: number;
  name: string;
  icon: string;
  experience: number;
  species: string;
}

export interface TypeData {
  id: number;
  name: string;
};

export interface TrainerClassData {
  id: number;
  name: string;
}

export interface StatBlock {
  hp: number;
  attack: number;
  defense: number;
  spattack: number;
  spdefense: number;
  speed: number;
}

export interface SpeciesData {
  id: number;
  name: string;
  spriteURL: string;
};

export type CombatStages = Omit<StatBlock, 'hp'>;

export interface MoveData {
  id: number;
  definition: {
    id: number;
    name: string;
    frequency: Frequency;
    attackType: 0 | 1 | 2;
    damage: string;
    accuracy: number;
  };
  type: TypeData;
  ppUp: boolean;
  isTutor: boolean;
}

export interface AbilityData {
  id: number;
  definition: {
    id: number;
    name: string;
  };
}

export interface CapabilityData {
  id: number;
  definition: {
    id: number;
    name: string;
  };
  value: number;
}

export interface PokemonData {
  id: number;
  name: string;
  isUserGM: boolean;
  experience: number;
  gender: Gender;
  nature: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    name: string;
    classes: TrainerClassData[];
  };
  types: TypeData[];
  stats: {
    base: StatBlock;
    added: StatBlock;
    combatStages: CombatStages;
  };
  species: SpeciesData;
  heldItem: {
    id: number;
    name: string;
  };
  loyalty: number | null;
  notes: string | null;
  gmNotes: string | null;
  moves: MoveData[];
  abilities: AbilityData[];
  capabilities: CapabilityData[];
  isActive: boolean;
  isHidden: boolean;
  campaign: {
    id: number;
    name: string;
    healthFormula: string;
    physicalEvasionFormula: string;
    specialEvasionFormula: string;
    speedEvasionFormula: string;
  }
}

export type PokemonDataResponse = PokemonData & { currentHealth: number };

export interface MoveDefinition {
  id: number;
  name: string;
  type: TypeData;
  damage: string;
  frequency: string;
  ac: number;
  attack_type: 0 | 1 | 2;
  attack_range: string;
  effects: string;
}

export interface AbilityDefinition {
  id: number;
  name: string;
  frequency: string;
  description: string;
}

export interface CapabilityDefinition {
 id: number;
 name: string;
 description: string; 
}

export interface HeldItemDefinition {
  id: number;
  name: string;
  description: string; 
}

export interface MoveDefinitionResponse {
  base: MoveDefinition,
}