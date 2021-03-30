import { Request, Response } from 'express';
import { Trainer } from '../../models/trainer';
import { Pokemon } from '../../models/pokemon';
import { RulebookSpecies } from '../../models/rulebookSpecies';
import { updateTrainer } from '../../utils/routeHelpers';
import { Campaign } from '../../models/campaign';

export async function getTrainerData(req: Request, res: Response): Promise<void> {
  const trainers = await Trainer.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Pokemon,
        include: [RulebookSpecies],
      },
      Campaign
    ],
  });

  res.json(trainers);
}

export async function createNewTrainer(req: Request, res: Response): Promise<void> {
  const trainer = await Trainer.create({
    userId: req.user.id,
    name: req.body.name,
  });

  trainer.setDataValue('pokemon', await trainer.$get('pokemon'));

  res.json(trainer);
}


export async function deleteTrainer(req: Request, res: Response): Promise<void> {
  const trainer = await Trainer.findByPk(req.params.id);

  await trainer.destroy();

  res.json({ id: trainer.id, success: true });
}


export async function setTrainerCampaign(req: Request, res: Response): Promise<void> {
  res.json(await updateTrainer(req, 'campaignId', req.body.campaignId));
}

export async function setTrainerName(req: Request, res: Response): Promise<void> {
  res.json(await updateTrainer(req, 'name', req.body.name));
}
