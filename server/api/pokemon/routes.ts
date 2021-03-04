import express from 'express';
import { Trainer } from '../../models/trainer';
import { Pokemon } from '../../models/pokemon';
import { getPokemonData, createNewPokemon } from './handlers';

export const router = express.Router();

router.use(express.json());

// Unauthenticated routes

router.post('/', createNewPokemon)

router.get('/:id', getPokemonData);

// Authenticated routes

router.use('*', async (req, res, next) => {
  const pokemon = await Pokemon.findByPk(req.query.pokemonId, {
    include: [Trainer],
  });

  if (!pokemon) {
   return res.status(400).json({
      error: 'Pokemon not found.',
    });
  }

  if (pokemon.trainer.userId !== req.user[0].id) {
    return res.status(401).json({
      error: 'Pokemon does not belong to user.',
    });
  }

  next();
});