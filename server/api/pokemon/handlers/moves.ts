import express, { Request, Response } from 'express';
import { RulebookMove } from '../../../models/rulebookMove';
import { determineSortAdjustedPositions } from '../../../utils/sortHelper';
import { fetchPokemon, isValidType } from '../../../utils/routeHelpers';

export const moveRouter = express.Router({ mergeParams: true });

moveRouter.route('/')
  .post(addPokemonMove)
  .delete(removePokemonMove);

moveRouter.post('/:moveId/type', setPokemonMoveType)
moveRouter.post('/:moveId/ppup', setPokemonMovePPUp)
moveRouter.post('/:moveId/tutored', setPokemonMoveIsTutored)
moveRouter.post('/:moveId/order', setPokemonMoveOrder)

export async function addPokemonMove(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });
  const move = await RulebookMove.findByPk(req.body.moveId);

  if (!move) {
    return res.status(400).json({
      error: 'Move not found.',
    });
  }

  if (pokemon.moves.find(item => item.id === move.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this move.',
    });
  }

  await pokemon.$add('moves', move, {
    through: {
      sortOrder: pokemon.moves.length,
    }
  });
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}

export async function removePokemonMove(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });
  const move = await RulebookMove.findByPk(req.body.moveId);

  if (!move) {
    return res.status(400).json({
      error: 'Move not found.',
    });
  }

  if (!pokemon.moves.find(item => item.id === move.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this move.',
    });
  }

  pokemon.$remove('moves', move);
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}

export async function setPokemonMoveType(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }
  
  if (!isValidType(req.body.type)) {
    return res.status(400).json({
      error: 'Invalid value for type.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });
  const move = pokemon.moves.find(item => item.id === Number(req.params.moveId));

  if (!move) {
    return res.status(400).json({
      error: `Move instance not found on ${pokemon.name}.`,
    });
  }

  await move.PokemonMove.update({
    typeOverride: req.body.type
  });
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}

export async function setPokemonMovePPUp(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }

  if (typeof req.body.isPPUpped !== 'boolean') {
    return res.status(400).json({
      error: 'Invalid value for isPPUpped.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });
  const move = pokemon.moves.find(item => item.id === Number(req.params.moveId));

  if (!move) {
    return res.status(400).json({
      error: `Move instance not found on ${pokemon.name}.`,
    });
  }

  await move.PokemonMove.update({
    isPPUpped: req.body.isPPUpped
  });
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}

export async function setPokemonMoveIsTutored(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }

  if (typeof req.body.isTutored !== 'boolean') {
    return res.status(400).json({
      error: 'Invalid value for isTutored.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });
  const move = pokemon.moves.find(item => item.id === Number(req.params.moveId));

  if (!move) {
    return res.status(400).json({
      error: `Move instance not found on ${pokemon.name}.`,
    });
  }

  await move.PokemonMove.update({
    isTutorMove: req.body.isTutored
  });
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}

export async function setPokemonMoveOrder(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.query.moveId)) {
    return res.status(400).json({
      error: 'Invalid value for moveId.',
    });
  }

  if (Number.isNaN(req.body.position)) {
    return res.status(400).json({
      error: 'Invalid value for position.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookMove] });

  const move = pokemon.moves.find(item => item.id === Number(req.params.moveId));

  if (!move) {
    return res.status(400).json({
      error: `Move instance not found on ${pokemon.name}.`,
    });
  }

  const adjustments = determineSortAdjustedPositions(
    move.PokemonMove.sortOrder ?? 0,
    req.body.position,
    pokemon.moves,
    item => item.PokemonMove.sortOrder,
  );

  await Promise.all(adjustments.map(([item, position]) => (
    item.PokemonMove.update({
      sortOrder: position,
    })
  )));

  await move.PokemonMove.update({
    sortOrder: req.body.position,
  });
  
  pokemon.setDataValue('moves', await pokemon.$get('moves'));

  res.json(pokemon);
}
