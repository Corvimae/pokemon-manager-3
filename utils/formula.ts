import { JunctionedMove, Pokemon } from "../server/models/pokemon";
import { useTypedSelector } from "../store/rootReducer";
import { calculateLevel } from "./level";
import { Stat, CombatStage } from "./types";

const MOVE_FREQUENCIES = ['At-Will', 'EOT', 'Battle', 'Center'];

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;

  return value;
}

export function useTotalHP() {
  const pokemon = useTypedSelector(state => state.pokemon.data);

  return Math.floor(calculateTotalHP(pokemon) * (1 - 0.1 * Math.min(pokemon.injuries, 9)));
}

export function usePhysicalEvasions() {
  const adjustedDefense = useCalculatedDefenseStat();
  
  return clamp(Math.floor(adjustedDefense / 5), -6, 6);
}

export function useSpecialEvasions() {
  const adjustdSpecialDefense = useCalculatedSpecialDefenseStat();
  
  return clamp(Math.floor(adjustdSpecialDefense / 5), -6, 6);
}

export function useSpeedEvasions() {
  const adjustedSpeed = useCalculatedSpeedStat();

  return clamp(Math.floor(adjustedSpeed / 5), -6, 6);
}

function calculateCombatStageModifiedStat(total: number, stage: number) {
  return stage === 0 ? total : stage < 0 ? Math.ceil(total * (1 - (Math.abs(stage) * 0.1))) : Math.floor(total * (1 + (stage * 0.2)));
}

export function useCalculatedAttackStat() {
  const base = useTypedSelector(state => state.pokemon.data.baseAttack);
  const added = useTypedSelector(state => state.pokemon.data.addedAttack);
  const vitamin = useTypedSelector(state => state.pokemon.data.vitaminAttack);
  const bonus = useTypedSelector(state => state.pokemon.data.bonusAttack);
  const combatStages = useTypedSelector(state => state.pokemon.data.attackCombatStages);
  
  return calculateCombatStageModifiedStat(base + added + vitamin, combatStages) + bonus;
}

export function useCalculatedDefenseStat() {
  const base = useTypedSelector(state => state.pokemon.data.baseDefense);
  const added = useTypedSelector(state => state.pokemon.data.addedDefense);
  const vitamin = useTypedSelector(state => state.pokemon.data.vitaminDefense);
  const bonus = useTypedSelector(state => state.pokemon.data.bonusDefense);
  const combatStages = useTypedSelector(state => state.pokemon.data.defenseCombatStages);
  
  return calculateCombatStageModifiedStat(base + added + vitamin, combatStages) + bonus;
}

export function useCalculatedSpecialAttackStat() {
  const base = useTypedSelector(state => state.pokemon.data.baseSpAttack);
  const added = useTypedSelector(state => state.pokemon.data.addedSpAttack);
  const vitamin = useTypedSelector(state => state.pokemon.data.vitaminSpAttack);
  const bonus = useTypedSelector(state => state.pokemon.data.bonusSpAttack);
  const combatStages = useTypedSelector(state => state.pokemon.data.spAttackCombatStages);
  
  return calculateCombatStageModifiedStat(base + added + vitamin, combatStages) + bonus;
}


export function useCalculatedSpecialDefenseStat() {
  const base = useTypedSelector(state => state.pokemon.data.baseSpDefense);
  const added = useTypedSelector(state => state.pokemon.data.addedSpDefense);
  const vitamin = useTypedSelector(state => state.pokemon.data.vitaminSpDefense);
  const bonus = useTypedSelector(state => state.pokemon.data.bonusSpDefense);
  const combatStages = useTypedSelector(state => state.pokemon.data.spDefenseCombatStages);
  
  return calculateCombatStageModifiedStat(base + added + vitamin, combatStages) + bonus;
}

export function useCalculatedSpeedStat() {
  const base = useTypedSelector(state => state.pokemon.data.baseSpeed);
  const added = useTypedSelector(state => state.pokemon.data.addedSpeed);
  const vitamin = useTypedSelector(state => state.pokemon.data.vitaminSpeed);
  const bonus = useTypedSelector(state => state.pokemon.data.bonusSpeed);
  const combatStages = useTypedSelector(state => state.pokemon.data.speedCombatStages);
  
  return calculateCombatStageModifiedStat(base + added + vitamin, combatStages) + bonus;
}

export function getMoveFrequency(move: JunctionedMove) {
  return MOVE_FREQUENCIES[Math.max(0, MOVE_FREQUENCIES.indexOf(move.frequency) - (move.PokemonMove.isPPUpped ? 1 : 0))];
}

export function calculateTotalHP(pokemon: Pokemon): number {
  return calculateLevel(pokemon.experience) + (pokemon.baseHP + pokemon.addedHP + pokemon.vitaminHP) * 3 + 10 + pokemon.bonusHP;
}

export function calculateHPPercentage(pokemon: Pokemon): number {
  return Math.min(1, pokemon.currentHealth / calculateTotalHP(pokemon));
}

type StatField =
  `base${Capitalize<CombatStage>}` | 
  `added${Capitalize<CombatStage>}` |
  `vitamin${Capitalize<CombatStage>}` | 
  `bonus${Capitalize<CombatStage>}` | 
  'baseHP' | 
  'addedHP' |
  'vitaminHP' | 
  'bonusHP';

type CombatStageField = `${CombatStage}CombatStages`;

export function getBaseStatField(stat: Stat): StatField {
  if (stat === 'hp') return 'baseHP';

  return `base${stat[0].toUpperCase() + stat.substring(1)}` as StatField;
}

export function getAddedStatField(stat: Stat): StatField {
  if (stat === 'hp') return 'addedHP';

  return `added${stat[0].toUpperCase() + stat.substring(1)}` as StatField;
}

export function getVitaminStatField(stat: Stat): StatField {
  if (stat === 'hp') return 'vitaminHP';

  return `vitamin${stat[0].toUpperCase() + stat.substring(1)}` as StatField;
}

export function getBonusStatField(stat: Stat): StatField {
  if (stat === 'hp') return 'bonusHP';

  return `bonus${stat[0].toUpperCase() + stat.substring(1)}` as StatField;
}

export function getCombatStageField(stat: CombatStage): CombatStageField {
  return `${stat}CombatStages` as CombatStageField;
}