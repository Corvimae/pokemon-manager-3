import express, { Request, Response } from 'express';
import { RulebookSkill } from '../../../models/rulebookSkill';
import { determineSortAdjustedPositions } from '../../../utils/sortHelper';
import { fetchPokemon } from '../../../utils/routeHelpers';

export const skillRouter = express.Router({ mergeParams: true });

skillRouter.route('/')
  .post(addPokemonSkill)
  .delete(removePokemonSkill);

skillRouter.post('/:skillId/level', setPokemonSkillLevel)
skillRouter.post('/:skillId/bonus', setPokemonSkillBonus)
skillRouter.post('/:skillId/order', setPokemonSkillOrder)

export async function addPokemonSkill(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.skillId)) {
    return res.status(400).json({
      error: 'Invalid value for skillId.',
    });
  }

  if (Number.isNaN(req.body.level)) {
    return res.status(400).json({
      error: 'Invalid value for level.',
    });
  }

  if (Number.isNaN(req.body.bonus)) {
    return res.status(400).json({
      error: 'Invalid value for bonus.',
    });
  }
  
  const pokemon = await fetchPokemon(req, { include: [RulebookSkill] });
  const skill = await RulebookSkill.findByPk(req.body.skillId);

  if (!skill) {
    return res.status(400).json({
      error: 'Skill not found.',
    });
  }

  if (pokemon.skills.find(item => item.id === skill.id)) {
    return res.status(400).json({
      error: 'The Pokemon already has this skill.',
    });
  }

  await pokemon.$add('skills', skill, {
    through: {
      level: req.body.level,
      bonus: req.body.bonus,
      sortOrder: pokemon.skills.length,
    },
  });
  
  pokemon.setDataValue('skills', await pokemon.$get('skills'));

  res.json(pokemon);
}

export async function removePokemonSkill(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.skillId)) {
    return res.status(400).json({
      error: 'Invalid value for skillId.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookSkill] });
  const skill = await RulebookSkill.findByPk(req.body.skillId);

  if (!skill) {
    return res.status(400).json({
      error: 'Skill not found.',
    });
  }

  if (!pokemon.skills.find(item => item.id === skill.id)) {
    return res.status(400).json({
      error: 'The Pokemon does not have this skill.',
    });
  }

  pokemon.$remove('skills', skill);
  
  pokemon.setDataValue('skills', await pokemon.$get('skills'));

  res.json(pokemon);
}

export async function setPokemonSkillLevel(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.skillId)) {
    return res.status(400).json({
      error: 'Invalid value for skillId.',
    });
  }

  if (Number.isNaN(req.body.level)) {
    return res.status(400).json({
      error: 'Invalid value for level.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookSkill] });
  const skill = pokemon.skills.find(item => item.id === Number(req.params.skillId));

  if (!skill) {
    return res.status(400).json({
      error: `Skill instance not found on ${pokemon.name}.`,
    });
  }

  await skill.PokemonSkill.update({
    level: req.body.level
  });
  
  pokemon.setDataValue('skills', await pokemon.$get('skills'));

  res.json(pokemon);
}

export async function setPokemonSkillBonus(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.body.skillId)) {
    return res.status(400).json({
      error: 'Invalid value for skillId.',
    });
  }

  if (Number.isNaN(req.body.bonus)) {
    return res.status(400).json({
      error: 'Invalid value for bonus.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookSkill] });
  const skill = pokemon.skills.find(item => item.id === Number(req.params.skillId));

  if (!skill) {
    return res.status(400).json({
      error: `Skill instance not found on ${pokemon.name}.`,
    });
  }

  await skill.PokemonSkill.update({
    bonus: req.body.bonus
  });
  
  pokemon.setDataValue('skills', await pokemon.$get('skills'));

  res.json(pokemon);
}

export async function setPokemonSkillOrder(req: Request, res: Response): Promise<void> {
  if (Number.isNaN(req.query.skillId)) {
    return res.status(400).json({
      error: 'Invalid value for skillId.',
    });
  }

  if (Number.isNaN(req.body.position)) {
    return res.status(400).json({
      error: 'Invalid value for position.',
    });
  }

  const pokemon = await fetchPokemon(req, { include: [RulebookSkill] });

  const skill = pokemon.skills.find(item => item.id === Number(req.params.skillId));

  if (!skill) {
    return res.status(400).json({
      error: `Skill instance not found on ${pokemon.name}.`,
    });
  }

  const adjustments = determineSortAdjustedPositions(
    skill.PokemonSkill.sortOrder ?? 0,
    req.body.position,
    pokemon.skills,
    item => item.PokemonSkill.sortOrder,
  );

  await Promise.all(adjustments.map(([item, position]) => (
    item.PokemonSkill.update({
      sortOrder: position,
    })
  )));

  await skill.PokemonSkill.update({
    sortOrder: req.body.position,
  });
  
  pokemon.setDataValue('skills', await pokemon.$get('skills'));

  res.json(pokemon);
}