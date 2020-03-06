import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faFeatherAlt, faSkull, faGhost, faEye, faWater, faSnowflake, faDragon, faMoon, faGem, faMountain, faFistRaised, faBug, faCog, faFire, faLeaf, faBahai, faQuestion, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useTypedSelector } from '../store/store';

export const TYPE_COLORS = {
  none: '#ccc',
  normal: '#A8A878',
  flying: '#A890F0',
  poison: '#A040A0',
  ghost: '#705898',
  psychic: '#F85888',
  water: '#6890F0',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#7d7874',
  rock: '#B8A038',
  electric: '#dcbb38',
  ground: '#E0C068',
  fighting: '#C03028',
  bug: '#A8B820',
  steel: '#B8B8D0',
  fire: '#F08030',
  grass: '#78C850',
  fairy: '#EE99AC',
};

export const TYPE_ICONS = {
  none: faQuestion,
  normal: faCircle,
  flying: faFeatherAlt,
  poison: faSkull,
  ghost: faGhost,
  psychic: faEye,
  water: faWater,
  ice: faSnowflake,
  dragon: faDragon,
  dark: faMoon,
  rock: faGem,
  electric: faBolt,
  ground: faMountain,
  fighting: faFistRaised,
  bug: faBug,
  steel: faCog,
  fire: faFire,
  grass: faLeaf,
  fairy: faBahai,
};

export type TypeName = keyof typeof TYPE_COLORS;

export const typeNames: TypeName[] = Object.keys(TYPE_COLORS) as TypeName[];

interface TypeEffectivenessDefinition {
  double: TypeName[];
  half: TypeName[];
  immune: TypeName[];
}

const typeChart: Record<TypeName, TypeEffectivenessDefinition> = {
  none: {
    double: [],
    half: [],
    immune: [],
  },
  normal: {
    double: [],
    half: ['rock', 'steel'],
    immune: ['ghost']
  },
  fighting: {
    double: ['normal', 'rock', 'steel', 'ice', 'dark'],
    half: ['flying', 'poison', 'bug', 'psychic', 'fairy'],
    immune: ['ghost']
  },
  flying: {
    double: ['fighting', 'bug', 'grass'],
    half: ['rock', 'steel', 'electric'],
    immune: []
  },
  poison: {
    double: ['grass', 'fairy'],
    half: ['poison', 'ground', 'rock', 'ghost'],
    immune: ['steel']
  },
  ground: {
    double: ['poison', 'rock', 'steel', 'fire', 'electric'],
    half: ['bug', 'grass'],
    immune: ['flying']
  },
  rock: {
    double: ['flying', 'bug', 'fire', 'ice'],
    half: ['fighting', 'ground', 'steel'],
    immune: []
  },
  bug: {
    double: ['grass', 'psychic', 'dark'],
    half: ['fighting', 'flying', 'poison', 'ghost', 'steel', 'fire'],
    immune: []
  },
  ghost: {
    double: ['ghost', 'psychic'],
    half: ['dark'],
    immune: ['normal']
  },
  steel: {
    double: ['rock', 'ice', 'fairy'],
    half: ['steel', 'fire', 'water', 'electric'],
    immune: []
  },
  fire: {
    double: ['bug', 'steel', 'grass'],
    half: ['rock', 'fire', 'water', 'dragon'],
    immune: []
  },
  water: {
    double: ['ground', 'rock', 'fire'],
    half: ['water', 'grass', 'dragon'],
    immune: []
  },
  grass: {
    double: ['ground', 'rock', 'water'],
    half: ['flying', 'poison', 'bug', 'steel', 'fire', 'grass', 'dragon'],
    immune: []
  },
  electric: {
    double: ['flying', 'water'],
    half: ['grass', 'electric', 'dragon'],
    immune: ['ground']
  },
  psychic: {
    double: ['fighting', 'poison'],
    half: ['steel', 'psychic'],
    immune: ['dark']
  },
  ice: {
    double: ['flying', 'ground', 'grass', 'dragon'],
    half: ['steel', 'fire', 'water', 'ice'],
    immune: []
  },
  dragon: {
    double: ['dragon'],
    half: ['steel'],
    immune: ['fairy']
  },
  dark: {
    double: ['ghost', 'psychic'],
    half: ['fighting', 'dark', 'fairy'],
    immune: []
  },
  fairy: {
    double: ['fighting', 'dragon', 'dark'],
    half: ['poison', 'steel', 'fire'],
    immune: []
  },
};

const immuneAbilities = {
  'Lightningrod': 'electric',
  'Dry Skin': 'water',
  'Flash Fire': 'fire',
  'Levitate': 'ground',
  'Motor Drive': 'electric',
  'Sap Sipper': 'grass',
  'Storm Drain': 'water',
  'Volt Absorb': 'electric',
  'Water Absorb': 'water',
};

interface TypeEffectivenesses {
  x4: TypeName[];
  x2: TypeName[];
  x0: TypeName[];
  half: TypeName[];
  fourth: TypeName[];
}

export function getOffensiveEffectivenesses(type: TypeName): TypeEffectivenesses {
  const { double, half, immune } = typeChart[type];

  return {
    x4: [],
    x2: double,
    x0: immune,
    half,
    fourth: [],
  };
}

export function getDefensiveEffectivenesses(type: TypeName): TypeEffectivenesses {
  return {
    x4: [],
    x2: Object.entries(typeChart).filter(([key, rules]) => rules.double.indexOf(type) !== -1).map(([key]) => key as TypeName),
    x0: Object.entries(typeChart).filter(([key, rules]) => rules.immune.indexOf(type) !== -1).map(([key]) => key as TypeName),
    half: Object.entries(typeChart).filter(([key, rules]) => rules.half.indexOf(type) !== -1).map(([key]) => key as TypeName),
    fourth: [],
  }
}

function exclusiveOr(a: boolean, b: boolean): boolean {
  return (a && !b) || (b && !a);
}

function is4x(type: TypeName, type1: TypeEffectivenesses, type2: TypeEffectivenesses): boolean {
  return type1.x2.indexOf(type) !== -1 && type2.x2.indexOf(type) !== -1;
}

function is2x(type: TypeName, type1: TypeEffectivenesses, type2: TypeEffectivenesses): boolean {
  return exclusiveOr(type1.x2.indexOf(type) !== -1, type2.x2.indexOf(type) !== -1) &&
    type1.half.indexOf(type) === -1 && type2.half.indexOf(type) === -1;
}

function isHalf(type: TypeName, type1: TypeEffectivenesses, type2: TypeEffectivenesses): boolean {
  return exclusiveOr(type1.half.indexOf(type) !== -1, type2.half.indexOf(type) !== -1) &&
    type1.x2.indexOf(type) === -1 && type2.x2.indexOf(type) === -1;
}

function isFourth(type: TypeName, type1: TypeEffectivenesses, type2: TypeEffectivenesses): boolean {
  return type1.half.indexOf(type) !== -1 && type2.half.indexOf(type) !== -1;
}

export function useCombinedDefensiveEffectivenesses(): TypeEffectivenesses {
  const types = useTypedSelector(state => state.pokemon.types);
  const abilities = useTypedSelector(state => state.pokemon.abilities);

  const immunities = abilities
    .filter(ability => Object.keys(immuneAbilities).indexOf(ability.definition.name) !== -1)
    .map(ability => immuneAbilities[ability.definition.name]);

  const [type1, type2] = types.map(type => getDefensiveEffectivenesses(type.name.toLocaleLowerCase() as TypeName));
  const allImmunities = [...immunities, ...type1.x0, ...type2.x0];

  return {
    x4: typeNames.filter(type => is4x(type, type1, type2) && allImmunities.indexOf(type) === -1),
    x2: typeNames.filter(type => is2x(type, type1, type2) && allImmunities.indexOf(type) === -1),
    x0: typeNames.filter(type => type1.x0.indexOf(type) !== -1 || type2.x0.indexOf(type) !== -1 || allImmunities.indexOf(type) !== -1),
    half: typeNames.filter(type => isHalf(type, type1, type2) && allImmunities.indexOf(type) === -1),
    fourth: typeNames.filter(type => isFourth(type, type1, type2) && allImmunities.indexOf(type) === -1),
  };
}