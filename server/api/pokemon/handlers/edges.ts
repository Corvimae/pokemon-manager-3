import express, { Request, Response } from 'express';
import { determineSortAdjustedPositions } from '../../../utils/sortHelper';
import { fetchPokemon } from '../../../utils/routeHelpers';
import { RulebookEdge } from '../../../models/rulebookEdge';

export const edgeRouter = express.Router({ mergeParams: true });

edgeRouter.route('/')
  .post(addPokemonEdge)
  .delete(removePokemonEdge);

edgeRouter.post('/:edgeId/ranks', setPokemonEdgeRanks)
edgeRouter.post('/:edgeId/order', setPokemonEdgeOrder)

export async function addPokemonEdge(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.edgeId)) {
    return res.status(400).json({
      error: 'Invalid value for edgeId.',
    });
  }

  if (Number.isNaN(req.body.ranks)) {
    return res.status(400).json({
      error: 'Invalid value for ranks.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookEdge] });
  const edge = await RulebookEdge.findByPk(req.body.edgeId);

  if (!edge) {
    return res.status(400).json({
      error: 'Edge not found.',
    });
  }

  if (pokemon.edges.find(item => item.id === edge.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this edge.',
    });
  }

  await pokemon.$add('edges', edge, {
    through: {
      ranks: req.body.ranks || 1,
      sortOrder: pokemon.edges.length,
    },
  });
  
  pokemon.setDataValue('edges', await pokemon.$get('edges'));

  res.json(pokemon);
}

export async function removePokemonEdge(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.edgeId)) {
    return res.status(400).json({
      error: 'Invalid value for edgeId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookEdge] });
  const edge = await RulebookEdge.findByPk(req.body.edgeId);

  if (!edge) {
    return res.status(400).json({
      error: 'Edge not found.',
    });
  }

  if (!pokemon.edges.find(item => item.id === edge.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this edge.',
    });
  }

  pokemon.$remove('edges', edge);
  
  pokemon.setDataValue('edges', await pokemon.$get('edges'));

  res.json(pokemon);
}

export async function setPokemonEdgeRanks(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.edgeId)) {
    return res.status(400).json({
      error: 'Invalid value for edgeId.',
    });
  }

  if (Number.isNaN(req.body.ranks)) {
    return res.status(400).json({
      error: 'Invalid value for ranks.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookEdge] });
  const edge = pokemon.edges.find(item => item.id === Number(req.params.edgeId));

  if (!edge) {
    return res.status(400).json({
      error: `Edge instance not found on ${pokemon.name}.`,
    });
  }

  await edge.PokemonEdge.update({
    ranks: req.body.ranks
  });
  
  pokemon.setDataValue('edges', await pokemon.$get('edges'));

  res.json(pokemon);
}

export async function setPokemonEdgeOrder(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.query.edgeId)) {
    return res.status(400).json({
      error: 'Invalid value for edgeId.',
    });
  }

  if (Number.isNaN(req.body.position)) {
    return res.status(400).json({
      error: 'Invalid value for position.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookEdge] });

  const edge = pokemon.edges.find(item => item.id === Number(req.params.edgeId));

  if (!edge) {
    return res.status(400).json({
      error: `Edge instance not found on ${pokemon.name}.`,
    });
  }

  const adjustments = determineSortAdjustedPositions(
    edge.PokemonEdge.sortOrder ?? 0,
    req.body.position,
    pokemon.edges,
    item => item.PokemonEdge.sortOrder,
  );

  await Promise.all(adjustments.map(([item, position]) => (
    item.PokemonEdge.update({
      sortOrder: position,
    })
  )));

  await edge.PokemonEdge.update({
    sortOrder: req.body.position,
  });
  
  pokemon.setDataValue('edges', await pokemon.$get('edges'));

  res.json(pokemon);
}