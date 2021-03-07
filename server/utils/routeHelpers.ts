import { Request } from 'express';
import { Pokemon } from '../models/pokemon';

export function isValidType(type: string): boolean {
  return typeof type === 'string' && [
    'none',
    'normal',
    'flying',
    'poison',
    'ghost',
    'psychic',
    'water',
    'ice',
    'dragon',
    'dark',
    'rock',
    'electric',
    'ground',
    'fighting',
    'bug',
    'steel',
    'fire',
    'grass',
    'fairy',
  ].indexOf(type) !== -1;
}

export async function fetchPokemon(req: Request, options = {}): Promise<Pokemon> {
  return await Pokemon.findByPk(req.params.id, options);
}

export async function updatePokemon(req: Request, field: keyof Pokemon, value: any): Promise<Pokemon> {
  const pokemon = await fetchPokemon(req);

  return await pokemon.update({
    [field]: value,
  });
}