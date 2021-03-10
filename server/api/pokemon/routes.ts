import express from 'express';
import { Trainer } from '../../models/trainer';
import { Pokemon } from '../../models/pokemon';
import { getPokemonData, createNewPokemon, setPokemonName, setPokemonGender, setPokemonSpecies, setPokemonTypes, setPokemonNature, setPokemonLoyalty, setPokemonExperience, addPokemonAbility, removePokemonAbility, addPokemonHeldItem, removePokemonHeldItem, setPokemonActive, setPokemonStat, setPokemonCombatStage, setPokemonHealth, setPokemonNotes, setPokemonTempHealth, setPokemonBonusTutorPoints, setPokemonSpentTutorPoints, setPokemonInjuries, setPokemonGMNotes, setPokemonTrainer, getBulkPokemonData } from './handlers/handlers';
import { edgeRouter } from './handlers/edges';
import { capabilityRouter } from './handlers/capabilities';
import { skillRouter } from './handlers/skills';
import { moveRouter } from './handlers/moves';
import { handleAsyncRoute } from '../../utils/routeHelpers';

export const router = express.Router();

router.use(express.json());

// Unauthenticated routes

router.route('/')
  .get(handleAsyncRoute(getBulkPokemonData))
  .post(handleAsyncRoute(createNewPokemon))

router.get('/:id', handleAsyncRoute(getPokemonData));

// Authenticated routes

router.use('/:id/*', async (req, res, next) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id, {
      include: [Trainer],
    });

    if (!pokemon) {
    return res.status(400).json({
        error: 'No Pokemon with that ID exists.',
      });
    }

    if (pokemon.trainer.userId !== req.user.id) {
      return res.status(401).json({
        error: 'Pokemon does not belong to user.',
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'An unexpected error occurred.',
    });
  }

  next();
});

router.post('/:id/name', handleAsyncRoute(setPokemonName));
router.post('/:id/trainer', handleAsyncRoute(setPokemonTrainer));
router.post('/:id/gender', handleAsyncRoute(setPokemonGender));
router.post('/:id/species', handleAsyncRoute(setPokemonSpecies));
router.post('/:id/types', handleAsyncRoute(setPokemonTypes));
router.post('/:id/experience', handleAsyncRoute(setPokemonExperience));
router.post('/:id/loyalty', handleAsyncRoute(setPokemonLoyalty));
router.post('/:id/health', handleAsyncRoute(setPokemonHealth));
router.post('/:id/tempHealth', handleAsyncRoute(setPokemonTempHealth));
router.post('/:id/injuries', handleAsyncRoute(setPokemonInjuries));
router.post('/:id/bonusTutorPoints', handleAsyncRoute(setPokemonBonusTutorPoints));
router.post('/:id/spentTutorPoints', handleAsyncRoute(setPokemonSpentTutorPoints));
router.post('/:id/active', handleAsyncRoute(setPokemonActive));
router.post('/:id/nature', handleAsyncRoute(setPokemonNature));
router.post('/:id/notes', handleAsyncRoute(setPokemonNotes));
router.post('/:id/gmNotes', handleAsyncRoute(setPokemonGMNotes));
router.post('/:id/stat', handleAsyncRoute(setPokemonStat));
router.post('/:id/combatStage', handleAsyncRoute(setPokemonCombatStage));

router.route('/:id/ability')
  .post(handleAsyncRoute(addPokemonAbility))
  .delete(handleAsyncRoute(removePokemonAbility));

router.route('/:id/heldItem')
  .post(handleAsyncRoute(addPokemonHeldItem))
  .delete(handleAsyncRoute(removePokemonHeldItem));

router.use('/:id/move', moveRouter);
router.use('/:id/capability', capabilityRouter);
router.use('/:id/skill', skillRouter);
router.use('/:id/edge', edgeRouter);
