import express from 'express';
import { router as pokemonApiRouter } from './pokemon/routes';
import { router as referenceApiRouter } from './reference/routes';
import { router as trainerApiRouter } from './trainer/routes';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('*', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].indexOf(req.method) !== -1) {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({
        error: 'No active user.',
      });

      return;
    }

    if (!req.user.isAuthorized) {
      res.status(401).json({
        error: 'You do not have access to Pokemon Manager 3; if you beleive this to be a mistake, please DM Corvimae#7777 on Discord.',
      });

      return;
    }
  }

  next();
});

apiRouter.use('/pokemon', pokemonApiRouter);
apiRouter.use('/reference', referenceApiRouter);
apiRouter.use('/trainer', trainerApiRouter);
