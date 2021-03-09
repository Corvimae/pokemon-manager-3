import { Request, Response, NextFunction } from 'express';
import { Pokemon } from '../models/pokemon';
import { Trainer } from '../models/trainer';
import { User } from '../models/user';
import { UserPermission } from '../models/userPermission';

export async function isUserAuthorized(user: User | null): Promise<boolean> {
  if (!user) return false;

  return user && await user.isAuthorized();
}

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

export async function fetchTrainer(req: Request, options = {}): Promise<Trainer> {
  return await Trainer.findByPk(req.params.id, options);
}

export async function updateTrainer(req: Request, field: keyof Trainer, value: any): Promise<Trainer> {
  const trainer = await fetchTrainer(req);

  return await trainer.update({
    [field]: value,
  });
}

export function handleAsyncRoute(
  handler: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res)).catch((err) => {
      console.error(err);
      next(err)
    });
  };
}

export function getUserObject(req: Request): Promise<User> {
  return User.findByPk(req.user.id, { include: [UserPermission] });
}