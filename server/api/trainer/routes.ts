import express from 'express';
import { Trainer } from '../../models/trainer';
import { handleAsyncRoute } from '../../utils/routeHelpers';
import { createNewTrainer, deleteTrainer, getTrainerData, setTrainerCampaign, setTrainerName } from './handlers';

export const router = express.Router();

router.use(express.json());

router.route('/')
  .get(handleAsyncRoute(getTrainerData))
  .post(handleAsyncRoute(createNewTrainer));

// Authenticated routes
router.use('/:id/*', async (req, res, next) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);

    if (!trainer) {
    return res.status(400).json({
        error: 'No trainer with that ID exists.',
      });
    }

    if (trainer.userId !== req.user.id) {
      return res.status(401).json({
        error: 'Trainer does not belong to user.',
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

router.delete('/:id', handleAsyncRoute(deleteTrainer));


router.post('/:id/campaign', handleAsyncRoute(setTrainerCampaign));
router.post('/:id/name', handleAsyncRoute(setTrainerName));
