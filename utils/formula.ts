import { useTypedSelector } from "../store/store";
import { calculateLevel } from "./level";
import { PokemonData, MoveData } from "./types";

const MOVE_FREQUENCIES = ['At-Will', 'EOT', 'Battle', 'Center'];

function useFormula(formula: string, pokemon: PokemonData): number {
  const combatStages = useTypedSelector(state => state.combatStages);
  const totalAttack = useCalculatedAttackStat();
  const totalDefense = useCalculatedDefenseStat();
  const totalSpecialAttack = useCalculatedSpecialAttackStat();
  const totalSpecialDefense = useCalculatedSpecialDefenseStat();
  const totalSpeed = useCalculatedSpeedStat();

  const replacementValues = {
    level: calculateLevel(pokemon.experience),
    base_hp: pokemon.stats.base.hp,
    base_attack: pokemon.stats.base.attack,
    base_defense: pokemon.stats.base.defense,
    base_spattack: pokemon.stats.base.spattack,
    base_spdefense: pokemon.stats.base.spdefense,
    base_speed: pokemon.stats.base.speed,
    add_hp: pokemon.stats.added.hp,
    add_attack: pokemon.stats.added.attack,
    add_defense: pokemon.stats.added.defense,
    add_spattack: pokemon.stats.added.spattack,
    add_spdefense: pokemon.stats.added.spdefense,
    add_speed: pokemon.stats.added.speed,
    total_hp: pokemon.stats.base.hp + pokemon.stats.added.hp,
    total_attack: totalAttack,
    total_defense: totalDefense,
    total_spattack: totalSpecialAttack,
    total_spdefense: totalSpecialDefense,
    total_speed: totalSpeed,
    attack_stages: combatStages.attack,
    defense_stages: combatStages.defense,
    spattack_stages: combatStages.spattack,
    spdefense_stages: combatStages.spdefense,
    speed_stages: combatStages.speed,
  };

  const commands = {
    min: 'Math.min',
    max: 'Math.max',
    floor: 'Math.floor',
    ceil: 'Math.ceil',
  }

  const templateRegex = /{(\w*)}/g
  
  const templateReplaced = formula.replace(templateRegex, (_match, p1) => replacementValues[p1] ?? 9999);

  return eval(Object.entries(commands).reduce((acc, [from, to]) => acc.split(from).join(to), templateReplaced));
}

export function useTotalHP() {
  const pokemon = useTypedSelector(state => state.pokemon);

  return useFormula(pokemon.campaign.healthFormula, pokemon);
}

export function usePhysicalEvasions() {
  const pokemon = useTypedSelector(state => state.pokemon);

  return useFormula(pokemon.campaign.physicalEvasionFormula, pokemon);
}

export function useSpecialEvasions() {
  const pokemon = useTypedSelector(state => state.pokemon);

  return useFormula(pokemon.campaign.specialEvasionFormula, pokemon);
}

export function useSpeedEvasions() {
  const pokemon = useTypedSelector(state => state.pokemon);

  return useFormula(pokemon.campaign.speedEvasionFormula, pokemon);
}

function calculateCombatStageModifiedStat(total: number, stage: number) {
  return stage === 0 ? total : stage < 0 ? Math.ceil(total * (1 - (Math.abs(stage) * 0.125))) : Math.floor(total * (1 + (stage * 0.25)));
}

export function useCalculatedAttackStat() {
  const stats = useTypedSelector(state => state.pokemon.stats);
  const attackCombatStages = useTypedSelector(state => state.combatStages.attack);

  return calculateCombatStageModifiedStat(stats.base.attack + stats.added.attack, attackCombatStages);
}

export function useCalculatedDefenseStat() {
  const stats = useTypedSelector(state => state.pokemon.stats);
  const defenseCombatStages = useTypedSelector(state => state.combatStages.defense);

  return calculateCombatStageModifiedStat(stats.base.defense + stats.added.defense, defenseCombatStages);
}


export function useCalculatedSpecialAttackStat() {
  const stats = useTypedSelector(state => state.pokemon.stats);
  const specialAttackCombatStages = useTypedSelector(state => state.combatStages.spattack);

  return calculateCombatStageModifiedStat(stats.base.spattack + stats.added.spattack, specialAttackCombatStages);
}


export function useCalculatedSpecialDefenseStat() {
  const stats = useTypedSelector(state => state.pokemon.stats);
  const specialDefenseCombatStages = useTypedSelector(state => state.combatStages.spdefense);

  return calculateCombatStageModifiedStat(stats.base.spdefense + stats.added.spdefense, specialDefenseCombatStages);
}

export function useCalculatedSpeedStat() {
  const stats = useTypedSelector(state => state.pokemon.stats);
  const speedCombatStages = useTypedSelector(state => state.combatStages.speed);

  return calculateCombatStageModifiedStat(stats.base.speed + stats.added.speed, speedCombatStages);
}


export function getMoveFrequency(move: MoveData) {
  return MOVE_FREQUENCIES[Math.max(0, MOVE_FREQUENCIES.indexOf(move.definition.frequency) - (move.ppUp ? 1 : 0))];
}