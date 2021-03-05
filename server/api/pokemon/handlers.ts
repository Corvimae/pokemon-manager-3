import { Request, Response } from 'express';
import { Pokemon } from '../../models/pokemon';
import { RulebookAbility } from '../../models/rulebookAbility';
import { RulebookCapability } from '../../models/rulebookCapability';
import { RulebookEdge } from '../../models/rulebookEdge';
import { RulebookHeldItem } from '../../models/rulebookHeldItem';
import { RulebookMove } from '../../models/rulebookMove';
import { RulebookNature } from '../../models/rulebookNature';
import { RulebookSkill } from '../../models/rulebookSkill';
import { RulebookSpecies } from '../../models/rulebookSpecies';
import { Trainer } from '../../models/trainer';

function isValidType(type: string): boolean {
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

async function fetchPokemon(req: Request, options = {}): Promise<Pokemon> {
  return await Pokemon.findByPk(req.params.id, options);
}

async function updatePokemon(req: Request, field: keyof Pokemon, value: any): Promise<Pokemon> {
  const pokemon = await fetchPokemon(req);

  return await pokemon.update({
    [field]: value,
  });
}

export async function createNewPokemon(req: Request<{ trainerId: number }>, res: Response): Promise<void> {
  if (Number.isNaN(req.body.trainerId)) {
    return res.status(400).json({
      error: 'Invalid value for trainerId.',
    });
  }

  const trainer = await Trainer.findByPk(req.body.trainerId, {
    include: [Pokemon],
  });

  if (!trainer) {
    return res.status(400).json({
      error: 'Trainer not found.',
    });
  }

  if (trainer.userId !== req.user[0].id) {
    return res.status(401).json({
      error: 'Trainer does not belong to user.',
    });
  }

  const pokemon = await Pokemon.create({
    name: 'New Pokemon',
    trainerId: trainer.id,
    nature: (await RulebookNature.findOne({
      where: {
        name: 'Cuddly',
      },
    })).id,
    speciesId: (await RulebookSpecies.findOne({ 
      where: {
        name: 'Bulbasaur'
      },
    })).id,
    sortOrder: trainer.pokemon.length,
  });

  pokemon.setDataValue('species', await pokemon.$get('species'))

  res.json(pokemon);
}

export async function getPokemonData(req: Request, res: Response): Promise<void> {
  const pokemon = await fetchPokemon(req, {
    include: [
      RulebookSpecies,
      RulebookNature,
      RulebookAbility,
      RulebookCapability,
      RulebookEdge,
      RulebookHeldItem,
      RulebookMove,
      RulebookSkill,
      Trainer,
    ],
  });
  
  if (pokemon) {
    res.json({
      isUserOwner: pokemon.trainer.userId === req.user[0].id, 
      pokemon,
    });
  }
}

export async function setPokemonName(req: Request, res: Response): Promise<void> {
  res.json(await updatePokemon(req, 'name', req.body.name));
}

export async function setPokemonGender(req: Request, res: Response): Promise<void> {
  if (['male', 'female', 'neutral'].indexOf(req.body.gender) === -1) {
    return res.status(400).json({
      error: 'Invalid value for gender.',
    });
  }

  res.json(await updatePokemon(req, 'gender', req.body.gender));
}

export async function setPokemonSpecies(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.speciesId)) {
    return res.status(400).json({
      error: 'Invalid value for speciesId.',
    });
  }

  const pokemon = await fetchPokemon(req);
  const species = await RulebookSpecies.findByPk(req.body.speciesId);

  if (!species) {
    return res.status(400).json({
      error: 'Species not found.',
    });
  }

  const updated = await pokemon.update({
    speciesId: species.id,
  });

  updated.setDataValue('species', species);

  res.json(updated);
}

export async function setPokemonTypes(req: Request, res: Response): Promise<void> {
  if (!isValidType(req.body.type1)) {
    return res.status(400).json({
      error: 'Invalid value for type1.',
    });
  }

  if (!isValidType(req.body.type2)) {
    return res.status(400).json({
      error: 'Invalid value for type2.',
    });
  }

  const pokemon = await fetchPokemon(req);

  const updated = await pokemon.update({
    type1: req.body.type1,
    type2: req.body.type2,
  });

  res.json(updated);
}

export async function setPokemonExperience(req: Request, res: Response): Promise<void> {
  res.json(await updatePokemon(req, 'experience', req.body.experience));
}

export async function setPokemonNotes(req: Request, res: Response): Promise<void> {
  res.json(await updatePokemon(req, 'notes', req.body.notes));
}

export async function setPokemonHealth(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.health)) {
    return res.status(400).json({
      error: 'Invalid value for health.',
    });
  }

  res.json(await updatePokemon(req, 'currentHealth', req.body.health));
}

export async function setPokemonLoyalty(req: Request, res: Response): Promise<void> {
  // TODO: This should be GM-restricted
  if (Number.isNaN(req.body.loyalty)) {
    return res.status(400).json({
      error: 'Invalid value for loyalty.',
    });
  }

  res.json(await updatePokemon(req, 'loyalty', req.body.loyalty));
}

export async function setPokemonActive(req: Request, res: Response): Promise<void> {
  if (typeof req.body.active !== 'boolean') {
    return res.status(400).json({
      error: 'Invalid value for active.',
    });
  }

  res.json(await updatePokemon(req, 'active', req.body.active));
}

export async function setPokemonNature(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.natureId)) {
    return res.status(400).json({
      error: 'Invalid value for natureId.',
    });
  }

  const pokemon = await fetchPokemon(req);
  const nature = await RulebookNature.findByPk(req.body.natureId);

  if (!nature) {
    return res.status(400).json({
      error: 'Nature not found.',
    });
  }

  const updated = await pokemon.update({
    natureId: nature.id,
  });

  updated.setDataValue('nature', nature);

  res.json(updated);
}

export async function addPokemonAbility(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.abilityId)) {
    return res.status(400).json({
      error: 'Invalid value for abilityId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookAbility] });
  const ability = await RulebookAbility.findByPk(req.body.abilityId);

  if (!ability) {
    return res.status(400).json({
      error: 'Ability not found.',
    });
  }

  if (pokemon.abilities.find(item => item.id === ability.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this ability.',
    });
  }

  await pokemon.$add('abilities', ability);
  
  pokemon.setDataValue('abilities', await pokemon.$get('abilities'));

  res.json(pokemon);
}

export async function removePokemonAbility(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.abilityId)) {
    return res.status(400).json({
      error: 'Invalid value for abilityId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookAbility] });
  const ability = await RulebookAbility.findByPk(req.body.abilityId);

  if (!ability) {
    return res.status(400).json({
      error: 'Ability not found.',
    });
  }

  if (!pokemon.abilities.find(item => item.id === ability.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this ability.',
    });
  }

  pokemon.$remove('abilities', ability);
  
  pokemon.setDataValue('abilities', await pokemon.$get('abilities'));

  res.json(pokemon);
}

export async function addPokemonHeldItem(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.heldItemId)) {
    return res.status(400).json({
      error: 'Invalid value for heldItemId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookHeldItem] });
  const heldItem = await RulebookHeldItem.findByPk(req.body.heldItemId);

  if (!heldItem) {
    return res.status(400).json({
      error: 'Held item not found.',
    });
  }

  if (pokemon.heldItems.find(item => item.id === heldItem.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this held item.',
    });
  }

  await pokemon.$add('heldItems', heldItem);
  
  pokemon.setDataValue('heldItems', await pokemon.$get('heldItems'));

  res.json(pokemon);
}

export async function removePokemonHeldItem(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.heldItemId)) {
    return res.status(400).json({
      error: 'Invalid value for heldItemId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookHeldItem] });
  const heldItem = await RulebookHeldItem.findByPk(req.body.heldItemId);

  if (!heldItem) {
    return res.status(400).json({
      error: 'Held item not found.',
    });
  }

  if (!pokemon.heldItems.find(item => item.id === heldItem.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this held item.',
    });
  }

  pokemon.$remove('heldItems', heldItem);
  
  pokemon.setDataValue('heldItems', await pokemon.$get('heldItems'));

  res.json(pokemon);
}

export async function setPokemonStat(req: Request, res: Response): Promise<void> {
  const stat = req.body.stat;
  
  if (['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'].indexOf(stat) === -1) {
    return res.status(400).json({
      error: `${stat} is not a valid stat name.`,
    });
  }

  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }

  const prefix = req.body.isBase ? 'base' : 'added';
  const suffix = stat === 'hp' ? 'HP' : stat[0].toUpperCase() + stat.substring(1);

  res.json(await updatePokemon(req, `${prefix}${suffix}` as keyof Pokemon, req.body.value));
}

export async function setPokemonCombatStage(req: Request, res: Response): Promise<void> {
  const stat = req.body.stat;
  
  if (['attack', 'defense', 'spAttack', 'spDefense', 'speed'].indexOf(stat) === -1) {
    return res.status(400).json({
      error: `${stat} is not a valid combat stage name.`,
    });
  }

  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }

  res.json(await updatePokemon(req, `${stat}CombatStages` as keyof Pokemon, req.body.value));
}

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

  await pokemon.$add('moves', move);
  
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

export async function addPokemonCapability(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.capability)) {
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