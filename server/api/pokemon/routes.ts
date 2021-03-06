import express from 'express';
import { Trainer } from '../../models/trainer';
import { Pokemon } from '../../models/pokemon';
import { getPokemonData, createNewPokemon, setPokemonName, setPokemonGender, setPokemonSpecies, setPokemonTypes, setPokemonNature, setPokemonLoyalty, setPokemonExperience, addPokemonAbility, removePokemonAbility, addPokemonHeldItem, removePokemonHeldItem, setPokemonActive, setPokemonStat, addPokemonMove, removePokemonMove, setPokemonMoveType, setPokemonMovePPUp, addPokemonCapability, removePokemonCapability, setPokemonCapabilityValue, setPokemonCombatStage, setPokemonHealth, setPokemonNotes, addPokemonSkill, removePokemonSkill, setPokemonSkillLevel, setPokemonSkillBonus, addPokemonEdge, removePokemonEdge, setPokemonEdgeRanks, setPokemonTempHealth, setPokemonBonusTutorPoints, setPokemonSpentTutorPoints, setPokemonInjuries } from './handlers';

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

router.post('/:id/move/:moveId/type', setPokemonMoveType)
router.post('/:id/move/:moveId/ppup', setPokemonMovePPUp);
router.route('/:id/move')
  .post(addPokemonMove)
  .delete(removePokemonMove);

router.route('/:id/capability')
  .post(addPokemonCapability)
  .delete(removePokemonCapability);

router.post('/:id/capability/:capabilityId/value', setPokemonCapabilityValue)

router.route('/:id/skill')
  .post(addPokemonSkill)
  .delete(removePokemonSkill);

router.post('/:id/skill/:skillId/level', setPokemonSkillLevel)
router.post('/:id/skill/:skillId/bonus', setPokemonSkillBonus)

router.route('/:id/edge')
  .post(addPokemonEdge)
  .delete(removePokemonEdge);

router.post('/:id/edge/:edgeId/ranks', setPokemonEdgeRanks)
