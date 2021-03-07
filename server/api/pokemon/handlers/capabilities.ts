import express, { Request, Response } from 'express';
import { RulebookCapability } from '../../../models/rulebookCapability';
import { determineSortAdjustedPositions } from '../../../utils/sortHelper';
import { fetchPokemon } from '../../../utils/routeHelpers';

export const capabilityRouter = express.Router({ mergeParams: true });

capabilityRouter.route('/')
  .post(addPokemonCapability)
  .delete(removePokemonCapability);

capabilityRouter.post('/:capabilityId/value', setPokemonCapabilityValue)
capabilityRouter.post('/:capabilityId/order', setPokemonCapabilityOrder)

export async function addPokemonCapability(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.capabilityId)) {
    return res.status(400).json({
      error: 'Invalid value for capabilityId.',
    });
  }

  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }
  
  const pokemon = await fetchPokemon(req, { include: [RulebookCapability] });
  const capability = await RulebookCapability.findByPk(req.body.capabilityId);

  if (!capability) {
    return res.status(400).json({
      error: 'Capability not found.',
    });
  }

  if (pokemon.capabilities.find(item => item.id === capability.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this capability.',
    });
  }

  await pokemon.$add('capabilities', capability, {
    through: {
      value: req.body.value,
      sortOrder: pokemon.capabilities.length,
    },
  });
  
  pokemon.setDataValue('capabilities', await pokemon.$get('capabilities'));

  res.json(pokemon);
}

export async function removePokemonCapability(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.capabilityId)) {
    return res.status(400).json({
      error: 'Invalid value for capabilityId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookCapability] });
  const capability = await RulebookCapability.findByPk(req.body.capabilityId);

  if (!capability) {
    return res.status(400).json({
      error: 'Capability not found.',
    });
  }

  if (!pokemon.capabilities.find(item => item.id === capability.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this capability.',
    });
  }

  pokemon.$remove('capabilities', capability);
  
  pokemon.setDataValue('capabilities', await pokemon.$get('capabilities'));

  res.json(pokemon);
}

export async function setPokemonCapabilityValue(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.query.capabilityId)) {
    return res.status(400).json({
      error: 'Invalid value for capabilityId.',
    });
  }

  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookCapability] });
  const capability = pokemon.capabilities.find(item => item.id === Number(req.params.capabilityId));

  if (!capability) {
    return res.status(400).json({
      error: `Capability instance not found on ${pokemon.name}.`,
    });
  }

  await capability.PokemonCapability.update({
    value: req.body.value
  });
  
  pokemon.setDataValue('capabilities', await pokemon.$get('capabilities'));

  res.json(pokemon);
}

export async function setPokemonCapabilityOrder(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.query.capabilityId)) {
    return res.status(400).json({
      error: 'Invalid value for capabilityId.',
    });
  }

  if (Number.isNaN(req.body.position)) {
    return res.status(400).json({
      error: 'Invalid value for position.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookCapability] });

  const capability = pokemon.capabilities.find(item => item.id === Number(req.params.capabilityId));

  if (!capability) {
    return res.status(400).json({
      error: `Capability instance not found on ${pokemon.name}.`,
    });
  }

  const adjustments = determineSortAdjustedPositions(
    capability.PokemonCapability.sortOrder ?? 0,
    req.body.position,
    pokemon.capabilities,
    item => item.PokemonCapability.sortOrder,
  );

  await Promise.all(adjustments.map(([item, position]) => (
    item.PokemonCapability.update({
      sortOrder: position,
    })
  )));

  await capability.PokemonCapability.update({
    sortOrder: req.body.position,
  });
  
  pokemon.setDataValue('capabilities', await pokemon.$get('capabilities'));

  res.json(pokemon);
}