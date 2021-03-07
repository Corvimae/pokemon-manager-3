import express from 'express';
import { Trainer } from '../../models/trainer';
import { Pokemon } from '../../models/pokemon';
import { getPokemonData, createNewPokemon, setPokemonName, setPokemonGender, setPokemonSpecies, setPokemonTypes, setPokemonNature, setPokemonLoyalty, setPokemonExperience, addPokemonAbility, removePokemonAbility, addPokemonHeldItem, removePokemonHeldItem, setPokemonActive, setPokemonStat, setPokemonCombatStage, setPokemonHealth, setPokemonNotes, setPokemonTempHealth, setPokemonBonusTutorPoints, setPokemonSpentTutorPoints, setPokemonInjuries } from './handlers/handlers';
import { edgeRouter } from './handlers/edges';
import { capabilityRouter } from './handlers/capabilities';
import { skillRouter } from './handlers/skills';
import { moveRouter } from './handlers/moves';

export const router = express.Router();

router.use(express.json());

// Unauthenticated routes

router.post('/', createNewPokemon)

router.get('/:id', getPokemonData);

// Authenticated routes

router.use('/:id/*', async (req, res, next) => {
  const pokemon = await Pokemon.findByPk(req.params.id, {
    include: [Trainer],
  });

  if (!pokemon) {
   return res.status(400).json({
      error: 'No Pokemon with that ID exists.',
    });
  }

  if (pokemon.trainer.userId !== req.user[0].id) {
    return res.status(401).json({
      error: 'Pokemon does not belong to user.',
    });
  }

  next();
});

router.post('/:id/name', setPokemonName);
router.post('/:id/gender', setPokemonGender);
router.post('/:id/species', setPokemonSpecies);
router.post('/:id/types', setPokemonTypes);
router.post('/:id/experience', setPokemonExperience);
router.post('/:id/loyalty', setPokemonLoyalty);
router.post('/:id/health', setPokemonHealth);
router.post('/:id/tempHealth', setPokemonTempHealth);
router.post('/:id/injuries', setPokemonInjuries);
router.post('/:id/bonusTutorPoints', setPokemonBonusTutorPoints);
router.post('/:id/spentTutorPoints', setPokemonSpentTutorPoints);
router.post('/:id/active', setPokemonActive);
router.post('/:id/nature', setPokemonNature);
router.post('/:id/notes', setPokemonNotes);
router.post('/:id/stat', setPokemonStat);
router.post('/:id/combatStage', setPokemonCombatStage);

router.route('/:id/ability')
  .post(addPokemonAbility)
  .delete(removePokemonAbility);

router.route('/:id/heldItem')
  .post(addPokemonHeldItem)
  .delete(removePokemonHeldItem);

router.use('/:id/move', moveRouter);
router.use('/:id/capability', capabilityRouter);
router.use('/:id/skill', skillRouter);
router.use('/:id/edge', edgeRouter);
