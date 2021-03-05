export type MobileMode = 'data' | 'stats' | 'moves' | 'notes' | 'allies';

export type Frequency = 'At-Will' | 'EOT' | 'Battle' | 'Center';

export type Gender = 'neutral' | 'male' | 'female';
  
export type CombatStage = 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';

export type Stat = CombatStage | 'hp';