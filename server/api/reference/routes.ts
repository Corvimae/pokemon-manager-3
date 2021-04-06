import express from 'express';
import { Model, Op } from 'sequelize';
import { Campaign } from '../../models/campaign';
import { RulebookAbility } from '../../models/rulebookAbility';
import { RulebookCapability } from '../../models/rulebookCapability';
import { RulebookEdge } from '../../models/rulebookEdge';
import { RulebookGlossaryItem } from '../../models/rulebookGlossaryItem';
import { RulebookHeldItem } from '../../models/rulebookHeldItem';
import { RulebookMove } from '../../models/rulebookMove';
import { RulebookNature } from '../../models/rulebookNature';
import { RulebookSkill } from '../../models/rulebookSkill';
import { RulebookSpecies } from '../../models/rulebookSpecies';
import { Trainer } from '../../models/trainer';
import { handleAsyncRoute } from '../../utils/routeHelpers';

function fetchWithQuerying<T extends Model>(model: new() => T): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return handleAsyncRoute(async (req, res) => {
    let filter = {};
    
    if (req.query.query) {
      filter = {
        where: {
          name: {
            [Op.iLike]: `%${req.query.query}%`,
          },
        },
      };
    }

    res.json(await (model as any).findAll(filter));
  });
}

function fetchById<T extends Model>(model: new() => T): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return handleAsyncRoute(async (req, res) => {
    const match = await (model as any).findByPk(req.params.id);

    if (match) {
      res.json(match);
    } else {
      res.status(400).json({
        error: 'No matching record found.',
      });
    }
  });
}

export const router = express.Router();

router.use(express.json());

router.get('/species', fetchWithQuerying(RulebookSpecies));
router.get('/natures', fetchWithQuerying(RulebookNature));
router.get('/abilities', fetchWithQuerying(RulebookAbility));
router.get('/abilities/:id', fetchById(RulebookAbility));
router.get('/heldItems', fetchWithQuerying(RulebookHeldItem));
router.get('/heldItems/:id', fetchById(RulebookHeldItem));
router.get('/moves', fetchWithQuerying(RulebookMove));
router.get('/moves/:id', fetchById(RulebookMove));
router.get('/capabilities', fetchWithQuerying(RulebookCapability));
router.get('/capabilities/:id', fetchById(RulebookCapability));
router.get('/skills', fetchWithQuerying(RulebookSkill));
router.get('/skills/:id', fetchById(RulebookSkill));
router.get('/edges', fetchWithQuerying(RulebookEdge));
router.get('/glossary', fetchWithQuerying(RulebookGlossaryItem));
router.get('/edges/:id', fetchById(RulebookEdge));
router.get('/campaigns', fetchWithQuerying(Campaign));
router.get('/campaigns/:id/trainers', handleAsyncRoute(async (req, res) => {
  let filter: any = {
    where: {
      campaignId: req.params.id,
    },
  };
  
  if (req.query.query) {
    filter.where.name = {
      [Op.iLike]: `%${req.query.query}%`,
    }
  }

  res.json(await Trainer.findAll(filter));
}));
