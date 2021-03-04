import express from 'express';
import { Trainer } from '../models/trainer';
import { Pokemon } from '../models/pokemon';
import { RulebookSpecies } from '../models/rulebookSpecies';
import { router as pokemonApiRouter } from './pokemon/routes';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('*', (req, res, next) => {
  if (!req.user) {
    res.status(401).send('No active user.');

    return;
  }

  next();
});

apiRouter.use('/pokemon', pokemonApiRouter);

apiRouter.route('/trainer')
  .get(async (req, res) => {
    const trainers = await Trainer.findAll({
      where: {
        userId: req.user[0].id,
      },
      include: [{
        model: Pokemon,
        include: [RulebookSpecies],
      }],
    });

    res.json(trainers);
  })
  .post(async (req, res) => {
    const trainer = await Trainer.create({
      userId: req.user[0].id,
      name: req.body.name,
    });

    res.json(trainer);
  });