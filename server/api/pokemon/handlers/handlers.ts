import { Request, Response } from 'express';
import { Campaign } from '../../../models/campaign';
import { Pokemon } from '../../../models/pokemon';
import { RulebookAbility } from '../../../models/rulebookAbility';
import { RulebookCapability } from '../../../models/rulebookCapability';
import { RulebookEdge } from '../../../models/rulebookEdge';
import { RulebookHeldItem } from '../../../models/rulebookHeldItem';
import { RulebookMove } from '../../../models/rulebookMove';
import { RulebookNature } from '../../../models/rulebookNature';
import { RulebookSkill } from '../../../models/rulebookSkill';
import { RulebookSpecies } from '../../../models/rulebookSpecies';
import { Trainer } from '../../../models/trainer';
import { User } from '../../../models/user';
import { getUserObject, fetchPokemon, isValidType, updatePokemon } from '../../../utils/routeHelpers';

async function getFullPokemonData(id: number, user: User): Promise<Pokemon | null> {
  const pokemon = await Pokemon.findByPk(id, {
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
    pokemon.loyalty = await pokemon.canViewLoyalty(user) ? pokemon.loyalty : null;

    return pokemon;
  }

  return null;
}

async function restrictToGM(req: Request, res: Response): Promise<boolean> {
  const user = await getUserObject(req);

  const pokemon = await fetchPokemon(req, { include: [Trainer] });

  if (pokemon.trainer.campaignId === null) {
    res.status(400).json({
      error: 'The trainer of this Pokemon is not assigned to a campaign.',
    });

    return false;
  }

  if (!user.isGM(pokemon.trainer.campaignId) === null) {
    res.status(401).json({
      error: 'This action is restricted to GMs.',
    });

    return false;
  }

  return true;
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

  if (trainer.userId !== req.user.id) {
    return res.status(401).json({
      error: 'Trainer does not belong to user.',
    });
  }

  const pokemon = await Pokemon.create({
    name: 'New Pokemon',
    trainerId: trainer.id,
    natureId: (await RulebookNature.findOne({
      where: {
        name: 'Composed',
      },
    })).id,
    speciesId: (await RulebookSpecies.findOne({ 
      where: {
        name: 'Bulbasaur'
      },
    })).id,
    sortOrder: trainer.pokemon.length,
  });

  pokemon.loyalty = await pokemon.canViewLoyalty(await getUserObject(req)) ? pokemon.loyalty : null;

  pokemon.setDataValue('species', await pokemon.$get('species'))

  res.json(pokemon);
}

export async function getPokemonData(req: Request, res: Response): Promise<void> {
  const user = await getUserObject(req);
  const pokemon = await getFullPokemonData(req.query.id, user);

  if (pokemon) {    
    res.json({
      isUserOwner: pokemon.trainer.userId === req.user?.id, 
      isUserGM: pokemon.trainer.campaignId !== null && user?.isGM(pokemon.trainer.campaignId),
      pokemon,
      allies: (await pokemon.trainer.$get('pokemon', { include: [RulebookSpecies] }))
        .filter(item => item.active && item.id !== pokemon.id),
    });
  } else {
    res.status(401).json({
      error: 'Pokemon not found.',
    });
  }
}

export async function getBulkPokemonData(req: Request, res: Response): Promise<void> {
  const ids = (req.query.query ?? '').split(/,/g).map(item => Number(item)).filter(item => !Number.isNaN(item));
  const user = await getUserObject(req);

  return res.json((await Promise.all(ids.map(id => getFullPokemonData(id, user)))).filter(item => item !== null));
}

export async function setPokemonName(req: Request, res: Response): Promise<void> {
  res.json(await updatePokemon(req, 'name', req.body.name));
}

export async function setPokemonTrainer(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.trainerId)) {
    return res.status(400).json({
      error: 'Invalid value for trainerId.',
    });
  }
  
  if (await restrictToGM(req, res)) {
    const pokemon = await fetchPokemon(req);
    const trainer = await Trainer.findByPk(req.body.trainerId, { include: [Campaign] });

    if (!trainer) {
      return res.status(400).json({
        error: 'Trainer not found.',
      });
    }

    const updated = await pokemon.update({
      trainerId: trainer.id,
    });

    updated.setDataValue('trainer', trainer);

    res.json(updated);
}
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


export async function setPokemonGMNotes(req: Request, res: Response): Promise<void> {
  if (await restrictToGM(req, res)) {
    res.json(await updatePokemon(req, 'gmNotes', req.body.gmNotes));
  }
}

export async function setPokemonHealth(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.health)) {
    return res.status(400).json({
      error: 'Invalid value for health.',
    });
  }

  res.json(await updatePokemon(req, 'currentHealth', req.body.health));
}

export async function setPokemonTempHealth(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.health)) {
    return res.status(400).json({
      error: 'Invalid value for health.',
    });
  }

  res.json(await updatePokemon(req, 'tempHealth', req.body.health));
}

export async function setPokemonInjuries(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.injuries)) {
    return res.status(400).json({
      error: 'Invalid value for injuries.',
    });
  }

  res.json(await updatePokemon(req, 'injuries', req.body.injuries));
}

export async function setPokemonBonusTutorPoints(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }

  res.json(await updatePokemon(req, 'bonusTutorPoints', req.body.value));
}

export async function setPokemonSpentTutorPoints(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.value)) {
    return res.status(400).json({
      error: 'Invalid value for value.',
    });
  }

  res.json(await updatePokemon(req, 'spentTutorPoints', req.body.value));
}

export async function setPokemonLoyalty(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.loyalty)) {
    return res.status(400).json({
      error: 'Invalid value for loyalty.',
    });
  }
  
  if (await restrictToGM(req, res)) {
    res.json(await updatePokemon(req, 'loyalty', req.body.loyalty));
  }
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

  if(['base', 'added', 'vitamin', 'bonus'].indexOf(req.body.type) === -1) {
    return res.status(400).json({
      error: `${stat} is not a valid type.`,
    });
  }

  const suffix = stat === 'hp' ? 'HP' : stat[0].toUpperCase() + stat.substring(1);

  res.json(await updatePokemon(req, `${req.body.type}${suffix}` as keyof Pokemon, req.body.value));
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

