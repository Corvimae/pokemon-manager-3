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

export async function createNewPokemon(req: Request<{ trainerId: number }>, res: Response): Promise<void> {
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
  const pokemon = await Pokemon.findByPk(req.params.id, {
    include: [
      RulebookSpecies,
      RulebookNature,
      RulebookAbility,
      RulebookCapability,
      RulebookEdge,
      RulebookHeldItem,
      RulebookMove,
      RulebookSkill
    ],
  });

  if (!pokemon) {
    return res.status(400).json({
      error: 'No pokemon with that ID exists.',
    });
  }
  
  res.json(pokemon);
}