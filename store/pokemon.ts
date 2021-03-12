import { JunctionedCapability, JunctionedEdge, JunctionedMove, JunctionedSkill, Pokemon } from "../server/models/pokemon";
import { PokemonCapability } from "../server/models/pokemonCapability";
import { PokemonEdge } from "../server/models/pokemonEdge";
import { PokemonMove } from "../server/models/pokemonMove";
import { PokemonSkill } from "../server/models/pokemonSkill";
import { RulebookAbility } from "../server/models/rulebookAbility";
import { RulebookCapability } from "../server/models/rulebookCapability";
import { RulebookEdge } from "../server/models/rulebookEdge";
import { RulebookHeldItem } from "../server/models/rulebookHeldItem";
import { RulebookMove } from "../server/models/rulebookMove";
import { RulebookSkill } from "../server/models/rulebookSkill";
import { determineSortAdjustedPositions } from "../server/utils/sortHelper";
import { getAddedStatField, getBaseStatField, getBonusStatField, getVitaminStatField } from "../utils/formula";
import { TypeName } from "../utils/pokemonTypes";
import { CombatStage, Gender, MobileMode, Stat } from "../utils/types";
import { ImmediateUpdateRequestActions, RequestActions } from "./types";

function removeById<T extends { id?: number }>(list: T[], id: number): T[] {
  return list.filter(element => element.id !== id);
}

function updateById<T extends { id?: number }>(list: T[], id: number, transform: (item: T) => T): T[] {
  return list.reduce((acc, element) => [
    ...acc,
    element.id == id ? transform(element) : element,
  ], []);
}

function updateMoveJunction<T extends keyof PokemonMove>(
  move: JunctionedMove,
  field: T,
  value: any
): JunctionedMove {
  return {
    ...move,
    PokemonMove: {
      ...move.PokemonMove,
      [field]: value,
    } as PokemonMove,
  } as JunctionedMove;
}

function updateCapabilityJunction<T extends keyof PokemonCapability>(
  capability: JunctionedCapability,
  field: T,
  value: any
): JunctionedCapability {
  return {
    ...capability,
    PokemonCapability: {
      ...capability.PokemonCapability,
      [field]: value,
    } as PokemonCapability,
  } as JunctionedCapability;
}

function updateSkillJunction<T extends keyof PokemonSkill>(
  skill: JunctionedSkill,
  field: T,
  value: any
): JunctionedSkill {
  return {
    ...skill,
    PokemonSkill: {
      ...skill.PokemonSkill,
      [field]: value,
    } as PokemonSkill,
  } as JunctionedSkill;
}

function updateEdgeJunction<T extends keyof PokemonEdge>(
  edge: JunctionedEdge,
  field: T,
  value: any
): JunctionedEdge {
  return {
    ...edge,
    PokemonEdge: {
      ...edge.PokemonEdge,
      [field]: value,
    } as PokemonEdge,
  } as JunctionedEdge;
}

export const MOVE = 'MOVE';
export const ABILITY = 'ABILITY';
export const CAPABILITY = 'CAPABILITY';
export const SKILL = 'SKILL';
export const EDGE = 'EDGE';
export const HELD_ITEM = 'HELD_ITEM';

const DETAIL_REQUEST_PATHS = {
  MOVE: 'reference/moves',
  ABILITY: 'reference/abilities',
  CAPABILITY: 'reference/capabilities',
  SKILL: 'reference/skills',
  EDGE: 'reference/edges',
  HELD_ITEM: 'reference/heldItems',
};

const SET_MOBILE_MODE = 'SET_MOBILE_MODE';
const LOAD_DATA = 'LOAD_DATA';
const LOAD_DATA_SUCCESS = 'LOAD_DATA_SUCCESS';
const LOAD_DATA_FAIL = 'LOAD_DATA_FAIL';
const SET_COMBAT_STAGE = 'SET_COMBAT_STAGE';
const REQUEST_DETAILS = 'REQUEST_DETAILS';
const REQUEST_DETAILS_SUCCESS = 'REQUEST_DETAILS_SUCCESS';
const SHOW_NOTES = 'SHOW_NOTES';
const CLOSE_DETAILS_PANEL_ACTION = 'CLOSE_DETAILS_PANEL_ACTION';
const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
const SET_HEALTH = 'SET_HEALTH';
const SET_TEMP_HEALTH = 'SET_TEMP_HEALTH';
const SET_INJURIES = 'SET_INJURIES';
const SET_SPENT_TUTOR_POINTS = 'SET_SPENT_TUTOR_POINTS';
const SET_BONUS_TUTOR_POINTS = 'SET_BONUS_TUTOR_POINTS';
const SET_POKEMON_NATURE = 'SET_POKEMON_NATURE';
const SET_POKEMON_NATURE_SUCCESS = 'SET_POKEMON_NATURE_SUCCESS';
const ADD_HELD_ITEM = 'ADD_HELD_ITEM';
const ADD_HELD_ITEM_SUCCESS = 'ADD_HELD_ITEM_SUCCESS';
const REMOVE_HELD_ITEM = 'REMOVE_HELD_ITEM';
const ADD_ABILITY = 'ADD_ABILITY';
const ADD_ABILITY_SUCCESS = 'ADD_ABILITY_SUCCESS';
const REMOVE_ABILITY = 'REMOVE_ABILITY';
const UPDATE_CAPABILITY_VALUE = 'UPDATE_CAPABILITY_VALUE';
const ADD_CAPABILITY = 'ADD_CAPABILITY'
const ADD_CAPABILITY_SUCCESS = 'ADD_CAPABILITY_SUCCESS'
const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';
const ADD_EDGE = 'ADD_EDGE'
const ADD_EDGE_SUCCESS = 'ADD_EDGE_SUCCESS'
const UPDATE_EDGE_RANKS = 'UPDATE_EDGE_RANKS';
const REMOVE_EDGE = 'REMOVE_EDGE';
const ADD_SKILL = 'ADD_SKILL'
const ADD_SKILL_SUCCESS = 'ADD_SKILL_SUCCESS'
const UPDATE_SKILL_LEVEL = 'UPDATE_SKILL_LEVEL';
const UPDATE_SKILL_BONUS = 'UPDATE_SKILL_BONUS';
const REMOVE_SKILL = 'REMOVE_SKILL';
const ADD_MOVE = 'ADD_MOVE'
const ADD_MOVE_SUCCESS = 'ADD_MOVE_SUCCESS'
const REMOVE_MOVE = 'REMOVE_MOVE';
const SET_MOVE_PP_UP = 'SET_MOVE_PP_UP';
const SET_MOVE_TYPE = 'SET_MOVE_TYPE';
const SET_MOVE_IS_TUTORED = 'SET_MOVE_IS_TUTORED';
const SET_POKEMON_TYPE = 'SET_POKEMON_TYPE';
const SET_POKEMON_ACTIVE = 'SET_POKEMON_ACTIVE';
const SET_POKEMON_NAME = 'SET_POKEMON_NAME';
const SET_POKEMON_SPECIES = 'SET_POKEMON_SPECIES';
const SET_POKEMON_SPECIES_SUCCESS = 'SET_POKEMON_SPECIES_SUCCESS';
const SET_POKEMON_EXPERIENCE = 'SET_POKEMON_EXPERIENCE';
const SET_POKEMON_GENDER = 'SET_POKEMON_GENDER';
const SET_POKEMON_LOYALTY = 'SET_POKEMON_LOYALTY';
const SET_POKEMON_TRAINER = 'SET_POKEMON_TRAINER';
const SET_POKEMON_TRAINER_SUCCESS = 'SET_POKEMON_TRAINER_SUCCESS';
const SET_POKEMON_BASE_STAT = 'SET_POKEMON_BASE_STAT';
const SET_POKEMON_ADDED_STAT = 'SET_POKEMON_ADDED_STAT';
const SET_POKEMON_VITAMIN_STAT = 'SET_POKEMON_VITAMIN_STAT';
const SET_POKEMON_BONUS_STAT = 'SET_POKEMON_BONUS_STAT';
const SET_MOVE_ORDER = 'SET_MOVE_ORDER';
const SET_CAPABILITY_ORDER = 'SET_CAPABILITY_ORDER';
const SET_SKILL_ORDER = 'SET_SKILL_ORDER';
const SET_EDGE_ORDER = 'SET_EDGE_ORDER';
const SAVE_NOTES = 'SAVE_NOTES';
const SAVE_GM_NOTES = 'SAVE_GM_NOTES';
const DELETE_POKEMON = 'DELETE_POKEMON';

interface ActiveMove {
  type: typeof MOVE;
  value: RulebookMove | undefined;
}

interface ActiveAbility {
  type: typeof ABILITY;
  value: RulebookAbility | undefined;
}

interface ActiveCapability {
  type: typeof CAPABILITY;
  value: RulebookCapability | undefined;
}

interface ActiveHeldItem {
  type: typeof HELD_ITEM;
  value: RulebookHeldItem | undefined;
}

interface ActiveSkill {
  type: typeof SKILL;
  value: RulebookSkill | undefined;
}

interface ActiveEdge {
  type: typeof EDGE;
  value: RulebookEdge | undefined;
}

export type ActiveDetail = ActiveMove | ActiveAbility | ActiveCapability | ActiveHeldItem | ActiveSkill | ActiveEdge;
export type ActiveDetailValue = RulebookMove | RulebookAbility | RulebookCapability | RulebookHeldItem | RulebookSkill | RulebookEdge;
export type ActiveDetailType = typeof MOVE | typeof ABILITY | typeof CAPABILITY | typeof HELD_ITEM | typeof SKILL | typeof EDGE;

type LoadDataActions = RequestActions<typeof LOAD_DATA, { pokemon: Pokemon; isUserOwner: boolean; isUserGM: boolean; allies: Pokemon[] }>;
type SetCombatStageActions = ImmediateUpdateRequestActions<typeof SET_COMBAT_STAGE, { stat: CombatStage; value: number}>;
type RequestDetailsActions = ImmediateUpdateRequestActions<typeof REQUEST_DETAILS, ActiveDetailValue, ActiveDetailType>;
type SetPokemonNatureActions = RequestActions<typeof SET_POKEMON_NATURE, Pokemon>;
type AddHeldItemActions = RequestActions<typeof ADD_HELD_ITEM, Pokemon>;
type RemoveHeldItemActions = ImmediateUpdateRequestActions<typeof REMOVE_HELD_ITEM, number>;
type AddAbilityActions = RequestActions<typeof ADD_ABILITY, Pokemon>;
type RemoveAbilityActions = ImmediateUpdateRequestActions<typeof REMOVE_ABILITY, number>;
type UpdateCapabilityValueActions = ImmediateUpdateRequestActions<typeof UPDATE_CAPABILITY_VALUE, JunctionedCapability, { capabilityId: number; value: number }>;
type AddCapabilityActions = RequestActions<typeof ADD_CAPABILITY, Pokemon>;
type RemoveCapabilityActions = ImmediateUpdateRequestActions<typeof REMOVE_CAPABILITY, number>;
type AddEdgeActions = RequestActions<typeof ADD_EDGE, Pokemon>;
type UpdateEdgeRanksActions = ImmediateUpdateRequestActions<typeof UPDATE_EDGE_RANKS, JunctionedSkill, { edgeId: number; ranks: number }>;
type RemoveEdgeActions = ImmediateUpdateRequestActions<typeof REMOVE_EDGE, number>;
type AddSkillActions = RequestActions<typeof ADD_SKILL, Pokemon>;
type UpdateSkillLevelActions = ImmediateUpdateRequestActions<typeof UPDATE_SKILL_LEVEL, JunctionedSkill, { skillId: number; level: number }>;
type UpdateSkillBonusActions = ImmediateUpdateRequestActions<typeof UPDATE_SKILL_BONUS, JunctionedSkill, { skillId: number; bonus: number }>;
type RemoveSkillActions = ImmediateUpdateRequestActions<typeof REMOVE_SKILL, number>;
type AddMoveActions = RequestActions<typeof ADD_MOVE, Pokemon>;
type RemoveMoveActions = ImmediateUpdateRequestActions<typeof REMOVE_MOVE, number, number>;
type SetMovePPUpActions = ImmediateUpdateRequestActions<typeof SET_MOVE_PP_UP, JunctionedMove, { moveId: number; enabled: boolean }>;
type SetMoveTypeActions = ImmediateUpdateRequestActions<typeof SET_MOVE_TYPE, JunctionedMove, { moveId: number, type: TypeName }>;
type SetMoveIsTutoredActions = ImmediateUpdateRequestActions<typeof SET_MOVE_IS_TUTORED, JunctionedMove, { moveId: number, isTutored: boolean }>;
type SetPokemonTypeActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_TYPE, [string, string]>;
type SetPokemonActiveActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_ACTIVE, boolean>
type SetPokemonNameActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_NAME, string>
type SetPokemonSpeciesActions = RequestActions<typeof SET_POKEMON_SPECIES, Pokemon>;
type SetPokemonExperienceActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_EXPERIENCE, number>
type SetPokmeonGenderActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_GENDER, Gender>
type SetPokemonLoyaltyActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_LOYALTY, number>
type SetPokemonTrainerActions = RequestActions<typeof SET_POKEMON_TRAINER, Pokemon>;
type SetPokemonBaseStatActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_BASE_STAT, { stat: Stat, value: number }>
type SetPokemonAddedStatActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_ADDED_STAT, { stat: Stat, value: number }>
type SetPokemonVitaminStatActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_VITAMIN_STAT, { stat: Stat, value: number }>
type SetPokemonBonusStatActions = ImmediateUpdateRequestActions<typeof SET_POKEMON_BONUS_STAT, { stat: Stat, value: number }>
type SetHealthActions = ImmediateUpdateRequestActions<typeof SET_HEALTH, number>;
type SetTempHealthActions = ImmediateUpdateRequestActions<typeof SET_TEMP_HEALTH, number>;
type SetInjuriesAction = ImmediateUpdateRequestActions<typeof SET_INJURIES, number>;
type SetSpentTutorPointsActions = ImmediateUpdateRequestActions<typeof SET_SPENT_TUTOR_POINTS, number>;
type SetBonusTutorPointsActions = ImmediateUpdateRequestActions<typeof SET_BONUS_TUTOR_POINTS, number>;
type SetMoveOrderActions = ImmediateUpdateRequestActions<typeof SET_MOVE_ORDER, { moveId: number; position: number }>;
type SetCapabilityOrderActions = ImmediateUpdateRequestActions<typeof SET_CAPABILITY_ORDER, { capabilityId: number; position: number }>;
type SetSkillOrderActions = ImmediateUpdateRequestActions<typeof SET_SKILL_ORDER, { skillId: number; position: number }>;
type SetEdgeOrdersActions = ImmediateUpdateRequestActions<typeof SET_EDGE_ORDER, { edgeId: number; position: number }>;
type SaveNotesActions = ImmediateUpdateRequestActions<typeof SAVE_NOTES, string>;
type SaveGMNotesActions = ImmediateUpdateRequestActions<typeof SAVE_GM_NOTES, string>;
type DeletePokemonActions = RequestActions<typeof DELETE_POKEMON, string>;

type SetMobileModeAction = {
  type: typeof SET_MOBILE_MODE;
  payload: {
    mode: MobileMode;
  };
};

type ShowNotesAction = {
  type: typeof SHOW_NOTES;
};

type CloseDetailsPanelAction = {
  type: typeof CLOSE_DETAILS_PANEL_ACTION;
};

type ToggleEditModeAction = {
  type: typeof TOGGLE_EDIT_MODE;
}

type PokemonReducerAction =
  SetMobileModeAction |
  ShowNotesAction | 
  CloseDetailsPanelAction | 
  ToggleEditModeAction |
  LoadDataActions |
  SetCombatStageActions |
  RequestDetailsActions |
  SetPokemonNatureActions |
  AddHeldItemActions |
  RemoveHeldItemActions |
  RemoveAbilityActions |
  AddAbilityActions |
  UpdateCapabilityValueActions |
  AddCapabilityActions |
  RemoveCapabilityActions |
  AddEdgeActions |
  UpdateEdgeRanksActions |
  RemoveEdgeActions |
  AddSkillActions |
  UpdateSkillLevelActions |
  UpdateSkillBonusActions |
  RemoveSkillActions |
  AddMoveActions |
  RemoveMoveActions |
  SetMovePPUpActions |
  SetMoveTypeActions |
  SetMoveIsTutoredActions |
  SetPokemonTypeActions |
  SetPokemonActiveActions |
  SetPokemonNameActions |
  SetPokemonSpeciesActions |
  SetPokemonExperienceActions |
  SetPokmeonGenderActions |
  SetPokemonLoyaltyActions |
  SetPokemonTrainerActions |
  SetPokemonBaseStatActions |
  SetPokemonAddedStatActions |
  SetPokemonVitaminStatActions |
  SetPokemonBonusStatActions |
  SetHealthActions |
  SetTempHealthActions |
  SetInjuriesAction |
  SetSpentTutorPointsActions |
  SetBonusTutorPointsActions |
  SetMoveOrderActions |
  SetCapabilityOrderActions |
  SetSkillOrderActions | 
  SetEdgeOrdersActions |
  SaveNotesActions |
  SaveGMNotesActions |
  DeletePokemonActions;

interface State {
  mobileMode: MobileMode;
  data: Pokemon | undefined;
  allies: Pokemon[];
  typeIds: Record<string, number>;
  activeDetails: {
    mode: 'none' | 'notes' | 'description';
    details: ActiveDetail | undefined;
  };
  isUserOwner: boolean;
  isUserGM: boolean;
  editMode: boolean;
  loadError: string | undefined;
}

const initialState: State = {
  mobileMode: 'data',
  data: undefined,
  allies: [],
  typeIds: {},
  activeDetails: {
    mode: 'none',
    details: undefined,
  },
  isUserOwner: false,
  isUserGM: false,
  editMode: false,
  loadError: undefined,
};

export function reducer(state: State = initialState, action: PokemonReducerAction): State {
  switch (action.type) {
    case SET_MOBILE_MODE:
      return {
        ...state,
        mobileMode: action.payload.mode,
      };

    case LOAD_DATA:
      return {
        ...state,
        data: undefined,
        loadError: undefined,
      };

    case LOAD_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload.data.pokemon,
        isUserOwner: action.payload.data.isUserOwner,
        isUserGM: action.payload.data.isUserGM,
        allies: action.payload.data.allies,
      };
    case LOAD_DATA_FAIL:
      return {
        ...state,
        loadError: action.error.response.data.error,
      };

    case SET_COMBAT_STAGE:
      return {
        ...state,
        data: {
          ...state.data,
          [`${action.payload.value.stat}CombatStages`]: action.payload.value.value,
        } as Pokemon,
      };

    case REQUEST_DETAILS:
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          mode: 'description',
          details: {
            type: action.payload.value,
            value: undefined,
          }
        },
      };

    case REQUEST_DETAILS_SUCCESS: 
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          details: {
            ...state.activeDetails.details,
            value: action.payload.data,
          } as ActiveDetail,
        },
      };

    case SHOW_NOTES:
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          mode: 'notes',
          details: undefined,
        },
      };

    case CLOSE_DETAILS_PANEL_ACTION:
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          mode: 'none',
        }
      };

    case SET_HEALTH:
      return {
        ...state,
        data: {
          ...state.data,
          currentHealth: action.payload.value,
        } as Pokemon,
      };

    case SET_TEMP_HEALTH:
      return {
        ...state,
        data: {
          ...state.data,
          tempHealth: action.payload.value,
        } as Pokemon,
      };

    case SET_INJURIES:
      return {
        ...state,
        data: {
          ...state.data,
          injuries: action.payload.value,
        } as Pokemon,
      };

    case SET_SPENT_TUTOR_POINTS:
      return {
        ...state,
        data: {
          ...state.data,
          spentTutorPoints: action.payload.value,
        } as Pokemon,
      };

    case SET_BONUS_TUTOR_POINTS:
      return {
        ...state,
        data: {
          ...state.data,
          bonusTutorPoints: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_NATURE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          nature: action.payload.data.nature,
          natureId: action.payload.data.nature.id,
        } as Pokemon,
      };

    case ADD_HELD_ITEM_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          heldItems: action.payload.data.heldItems,
        } as Pokemon,
      };

    case REMOVE_HELD_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          heldItems: removeById(state.data.heldItems, action.payload.value),
        } as Pokemon,
      };

    case ADD_ABILITY_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          abilities: action.payload.data.abilities,
        } as Pokemon,
      };

    case REMOVE_ABILITY:
      return {
        ...state,
        data: {
          ...state.data,
          abilities: removeById(state.data.abilities, action.payload.value),
        } as Pokemon,
      };

    case ADD_CAPABILITY_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          capabilities: action.payload.data.capabilities,
        } as Pokemon,
      };

    case UPDATE_CAPABILITY_VALUE:
      return {
        ...state,
        data: {
          ...state.data,
          capabilities: updateById(
            state.data.capabilities,
            action.payload.value.capabilityId,
            capability => updateCapabilityJunction(capability, 'value', action.payload.value.value),
          ),
        } as Pokemon,
      };

    case REMOVE_CAPABILITY:
      return {
        ...state,
        data: {
          ...state.data,
          capabilities: removeById(state.data.capabilities, action.payload.value),
        } as Pokemon,
      };

    case ADD_EDGE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          edges: action.payload.data.edges,
        } as Pokemon,
      };

    case UPDATE_EDGE_RANKS:
      return {
        ...state,
        data: {
          ...state.data,
          edges: updateById(
            state.data.edges,
            action.payload.value.edgeId,
            edge => updateEdgeJunction(edge, 'ranks', action.payload.value.ranks),
          ),
        } as Pokemon,
      };

    case REMOVE_EDGE:
      return {
        ...state,
        data: {
          ...state.data,
          edges: removeById(state.data.edges, action.payload.value),
        } as Pokemon,
      };

    case ADD_SKILL_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          skills: action.payload.data.skills,
        } as Pokemon,
      };

    case UPDATE_SKILL_LEVEL:
      return {
        ...state,
        data: {
          ...state.data,
          skills: updateById(
            state.data.skills,
            action.payload.value.skillId,
            skill => updateSkillJunction(skill, 'level', action.payload.value.level),
          ),
        } as Pokemon,
      };

    case UPDATE_SKILL_BONUS:
      return {
        ...state,
        data: {
          ...state.data,
          skills: updateById(
            state.data.skills,
            action.payload.value.skillId,
            skill => updateSkillJunction(skill, 'bonus', action.payload.value.bonus),
          ),
        } as Pokemon,
      };

    case REMOVE_SKILL:
      return {
        ...state,
        data: {
          ...state.data,
          skills: removeById(state.data.skills, action.payload.value),
        } as Pokemon,
      };

    case TOGGLE_EDIT_MODE:
      return {
        ...state,
        editMode: !state.editMode,
      };

    case ADD_MOVE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          moves: action.payload.data.moves,
        } as Pokemon,
      };

    case SET_MOVE_TYPE:
      return {
        ...state,
        data: {
          ...state.data,
          moves: updateById(
            state.data.moves,
            action.payload.value.moveId,
            move => updateMoveJunction(move, 'typeOverride', action.payload.value.type)
          ),
        } as Pokemon,
      };

    case SET_MOVE_IS_TUTORED:
      return {
        ...state,
        data: {
          ...state.data,
          moves: updateById(
            state.data.moves,
            action.payload.value.moveId,
            move => updateMoveJunction(move, 'isTutorMove', action.payload.value.isTutored)
          ),
        } as Pokemon,
      };

    case SET_MOVE_PP_UP:
      return {
        ...state,
        data: {
          ...state.data,
          moves: updateById(
            state.data.moves,
            action.payload.value.moveId,
            move => updateMoveJunction(move, 'isPPUpped', action.payload.value.enabled)
          ),
        } as Pokemon,
      };

    case REMOVE_MOVE:
      return {
        ...state,
        data: {
          ...state.data,
          moves: removeById(state.data.moves, action.payload.value),
        } as Pokemon,
      };

    case SET_POKEMON_TYPE:
      return {
        ...state,
        data: {
          ...state.data,
          type1: action.payload.value[0],
          type2: action.payload.value[1],
        } as Pokemon,
      };

    case SET_POKEMON_ACTIVE:
      return {
        ...state,
        data: {
          ...state.data,
          active: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_NAME:
      return {
        ...state,
        data: {
          ...state.data,
          name: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_SPECIES_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          species: action.payload.data.species,
        } as Pokemon,
      };

    case SET_POKEMON_EXPERIENCE:
      return {
        ...state,
        data: {
          ...state.data,
          experience: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_GENDER:
      return {
        ...state,
        data: {
          ...state.data,
          gender: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_LOYALTY:
      return {
        ...state,
        data: {
          ...state.data,
          loyalty: action.payload.value,
        } as Pokemon,
      };

    case SET_POKEMON_TRAINER_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          trainer: action.payload.data.trainer,
          trainerId: action.payload.data.trainerId,
        } as Pokemon,
      };

    case SET_POKEMON_BASE_STAT:
      return {
        ...state,
        data: {
          ...state.data,
          [getBaseStatField(action.payload.value.stat)]: action.payload.value.value,
        } as Pokemon,
      };

    case SET_POKEMON_ADDED_STAT:
      return {
        ...state,
        data: {
          ...state.data,
          [getAddedStatField(action.payload.value.stat)]: action.payload.value.value,
        } as Pokemon,
      };

    case SET_POKEMON_VITAMIN_STAT:
      return {
        ...state,
        data: {
          ...state.data,
          [getVitaminStatField(action.payload.value.stat)]: action.payload.value.value,
        } as Pokemon,
      };

    case SET_POKEMON_BONUS_STAT:
      return {
        ...state,
        data: {
          ...state.data,
          [getBonusStatField(action.payload.value.stat)]: action.payload.value.value,
        } as Pokemon,
      };

    case SET_MOVE_ORDER: {
      const matchingMove = state.data.moves.find(cap => cap.id === action.payload.value.moveId);
      const adjustments = determineSortAdjustedPositions(
        matchingMove.PokemonMove.sortOrder,
        action.payload.value.position,
        state.data.moves,
        item => item.PokemonMove.sortOrder,
      );
            
      return {
        ...state,
        data: {
          ...state.data,
          moves: state.data.moves.map(move => {
            const adjustment = adjustments.find(([item]) => item === move);

            if (adjustment) {
              return {
                ...move,
                PokemonMove: {
                  ...move.PokemonMove,
                  sortOrder: adjustment[1],
                },
              };
            } else if (move.id === action.payload.value.moveId) {
              return {
                ...move,
                PokemonMove: {
                  ...move.PokemonMove,
                  sortOrder: action.payload.value.position,
                },
              };
            }

            return move;
          }),
        } as Pokemon,
      };
    }

    case SET_CAPABILITY_ORDER: {
      const matchingCapability = state.data.capabilities.find(cap => cap.id === action.payload.value.capabilityId);
      const adjustments = determineSortAdjustedPositions(
        matchingCapability.PokemonCapability.sortOrder,
        action.payload.value.position,
        state.data.capabilities,
        item => item.PokemonCapability.sortOrder,
      );
            
      return {
        ...state,
        data: {
          ...state.data,
          capabilities: state.data.capabilities.map(capability => {
            const adjustment = adjustments.find(([item]) => item === capability);

            if (adjustment) {
              return {
                ...capability,
                PokemonCapability: {
                  ...capability.PokemonCapability,
                  sortOrder: adjustment[1],
                },
              };
            } else if (capability.id === action.payload.value.capabilityId) {
              return {
                ...capability,
                PokemonCapability: {
                  ...capability.PokemonCapability,
                  sortOrder: action.payload.value.position,
                },
              };
            }

            return capability;
          }),
        } as Pokemon,
      };
    }

    case SET_SKILL_ORDER: {
      const matchingSkill = state.data.skills.find(cap => cap.id === action.payload.value.skillId);
      const adjustments = determineSortAdjustedPositions(
        matchingSkill.PokemonSkill.sortOrder,
        action.payload.value.position,
        state.data.skills,
        item => item.PokemonSkill.sortOrder,
      );
            
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.map(skill => {
            const adjustment = adjustments.find(([item]) => item === skill);

            if (adjustment) {
              return {
                ...skill,
                PokemonSkill: {
                  ...skill.PokemonSkill,
                  sortOrder: adjustment[1],
                },
              };
            } else if (skill.id === action.payload.value.skillId) {
              return {
                ...skill,
                PokemonSkill: {
                  ...skill.PokemonSkill,
                  sortOrder: action.payload.value.position,
                },
              };
            }

            return skill;
          }),
        } as Pokemon,
      };
    }

    case SET_EDGE_ORDER: {
      const matchingEdge = state.data.edges.find(cap => cap.id === action.payload.value.edgeId);
      const adjustments = determineSortAdjustedPositions(
        matchingEdge.PokemonEdge.sortOrder,
        action.payload.value.position,
        state.data.edges,
        item => item.PokemonEdge.sortOrder,
      );
            
      return {
        ...state,
        data: {
          ...state.data,
          edges: state.data.edges.map(edge => {
            const adjustment = adjustments.find(([item]) => item === edge);

            if (adjustment) {
              return {
                ...edge,
                PokemonEdge: {
                  ...edge.PokemonEdge,
                  sortOrder: adjustment[1],
                },
              };
            } else if (edge.id === action.payload.value.edgeId) {
              return {
                ...edge,
                PokemonEdge: {
                  ...edge.PokemonEdge,
                  sortOrder: action.payload.value.position,
                },
              };
            }

            return edge;
          }),
        } as Pokemon,
      };
    }

    case SAVE_NOTES:
      return {
        ...state,
        data: {
          ...state.data,
          notes: action.payload.value,
        } as Pokemon,
      };

    case SAVE_GM_NOTES:
      return {
        ...state,
        data: {
          ...state.data,
          gmNotes: action.payload.value,
        } as Pokemon,
      };

    default:
      return state;
  }
}

export function setMobileMode(mode: MobileMode): PokemonReducerAction {
  return {
    type: SET_MOBILE_MODE,
    payload: {
      mode,
    }
  };
}

export function loadData(id: number): PokemonReducerAction {
  return {
    type: LOAD_DATA,
    payload: {
      request: {
        url: `/pokemon/${id}`,
      }
    },
  };
}

export function setCombatStage(pokemonId: number, stat: CombatStage, value: number): PokemonReducerAction {
  const clampedValue = Math.max(-6, Math.min(value, 6));

  return {
    type: SET_COMBAT_STAGE,
    payload: {
      value: {
        stat,
        value: clampedValue,
      },
      request: {
        url: `/pokemon/${pokemonId}/combatStage`,
        method: 'POST',
        data: {
          stat,
          value: clampedValue,
        },
      }
    },
  };
}

export function requestDetails(type: ActiveDetailType, id: number): PokemonReducerAction {
  return {
    type: REQUEST_DETAILS,
    payload: {
      value: type,
      request: {
        url: `/${DETAIL_REQUEST_PATHS[type]}/${id}`
      }
    }
  };
};

export function showNotes(): PokemonReducerAction {
  return {
    type: SHOW_NOTES,
  };
};

export function closeDetailsPanel(): PokemonReducerAction {
  return {
    type: CLOSE_DETAILS_PANEL_ACTION,
  };
}

export function setHealth(pokemonId: number, health: number): PokemonReducerAction {
  const safeHealth = Number(health);

  if (!Number.isNaN(safeHealth)) {
    return {
      type: SET_HEALTH,
      payload: {
        value: safeHealth,
        request: {
          url: `/pokemon/${pokemonId}/health`,
          method: 'POST',
          data: {
            health: safeHealth,
          }
        },
      },
    };
  }
}

export function setTempHealth(pokemonId: number, health: number): PokemonReducerAction {
  const safeHealth = Number(health);

  if (!Number.isNaN(safeHealth)) {
    return {
      type: SET_TEMP_HEALTH,
      payload: {
        value: safeHealth,
        request: {
          url: `/pokemon/${pokemonId}/tempHealth`,
          method: 'POST',
          data: {
            health: safeHealth,
          }
        },
      },
    };
  }
}

export function setInjuries(pokemonId: number, injuries: number): PokemonReducerAction {
  const safeInjuries = Number(injuries);

  if (!Number.isNaN(safeInjuries)) {
    return {
      type: SET_INJURIES,
      payload: {
        value: safeInjuries,
        request: {
          url: `/pokemon/${pokemonId}/injuries`,
          method: 'POST',
          data: {
            injuries: safeInjuries,
          }
        },
      },
    };
  }
}

export function setBonusTutorPoints(pokemonId: number, value: number): PokemonReducerAction {
  const safeValue = Number(value);

  if (!Number.isNaN(safeValue)) {
    return {
      type: SET_BONUS_TUTOR_POINTS,
      payload: {
        value: safeValue,
        request: {
          url: `/pokemon/${pokemonId}/bonusTutorPoints`,
          method: 'POST',
          data: {
            value: safeValue,
          }
        },
      },
    };
  }
}

export function setSpentTutorPoints(pokemonId: number, value: number): PokemonReducerAction {
  const safeValue = Number(value);

  if (!Number.isNaN(safeValue)) {
    return {
      type: SET_SPENT_TUTOR_POINTS,
      payload: {
        value: safeValue,
        request: {
          url: `/pokemon/${pokemonId}/spentTutorPoints`,
          method: 'POST',
          data: {
            value: safeValue,
          }
        },
      },
    };
  }
}

export function toggleEditMode(): PokemonReducerAction {
  return {
    type: TOGGLE_EDIT_MODE,
  };
}

export function setPokemonNature(pokemonId: number, natureId: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_NATURE,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/nature`,
        method: 'POST',
        data: {
          natureId,
        },
      },
    },
  };
}

export function addHeldItem(pokemonId: number, heldItemId: number): PokemonReducerAction {
  return {
    type: ADD_HELD_ITEM,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/heldItem`,
        method: 'POST',
        data: {
          heldItemId: heldItemId,
        },
      },
    }
  }
}

export function removeHeldItem(pokemonId: number, heldItem: RulebookHeldItem): PokemonReducerAction {
  return {
    type: REMOVE_HELD_ITEM,
    payload: {
      value: heldItem.id,
      request: {
        url: `/pokemon/${pokemonId}/heldItem`,
        method: 'DELETE',
        data: {
          heldItemId: heldItem.id,
        },
      },
    }
  }
}

export function addAbility(pokemonId: number, abilityId: number): PokemonReducerAction {
  return {
    type: ADD_ABILITY,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/ability`,
        method: 'POST',
        data: {
          abilityId,
        }
      },
    },
  };
}

export function removeAbility(pokemonId: number, ability: RulebookAbility): PokemonReducerAction {
  return {
    type: REMOVE_ABILITY,
    payload: {
      value: ability.id,
      request: {
        url: `/pokemon/${pokemonId}/ability`,
        method: 'DELETE',
        data: {
          abilityId: ability.id,
        },
      },
    },
  };
}

export function updateCapabilityValue(pokemonId: number, capabilityId: number, value: number): PokemonReducerAction {
  const safeValue = Number(value);

  if (!Number.isNaN(safeValue)) {
    return {
      type: UPDATE_CAPABILITY_VALUE,
      payload: {
        value: {
          capabilityId,
          value: safeValue,
        },
        request: {
          url: `/pokemon/${pokemonId}/capability/${capabilityId}/value`,
          method: 'POST',
          data: {
            value: safeValue,
          },
        },
      },
    };
  }
}

export function addCapability(pokemonId: number, capabilityId: number, value: number): PokemonReducerAction {
  return {
    type: ADD_CAPABILITY,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/capability`,
        method: 'POST',
        data: {
          capabilityId,
          value,
        },
      },
    },
  };
}

export function removeCapability(pokemonId: number, capabilityId: number): PokemonReducerAction {
  return {
    type: REMOVE_CAPABILITY,
    payload: {
      value: capabilityId,
      request: {
        url: `/pokemon/${pokemonId}/capability`,
        method: 'DELETE',
        data: {
          capabilityId,
        },
      },
    },
  };
}

export function addEdge(pokemonId: number, edgeId: number, ranks: number): PokemonReducerAction {
  return {
    type: ADD_EDGE,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/edge`,
        method: 'POST',
        data: {
          edgeId,
          ranks,
        },
      },
    },
  };
}

export function updateEdgeRanks(pokemonId: number, edgeId: number, ranks: number): PokemonReducerAction {
  const safeRanks = Number(ranks);

  if (!Number.isNaN(safeRanks)) {
    return {
      type: UPDATE_EDGE_RANKS,
      payload: {
        value: {
          edgeId,
          ranks: safeRanks,
        },
        request: {
          url: `/pokemon/${pokemonId}/edge/${edgeId}/ranks`,
          method: 'POST',
          data: {
            ranks: safeRanks,
          },
        },
      },
    };
  }
}

export function removeEdge(pokemonId: number, edgeId: number): PokemonReducerAction {
  return {
    type: REMOVE_EDGE,
    payload: {
      value: edgeId,
      request: {
        url: `/pokemon/${pokemonId}/edge`,
        method: 'DELETE',
        data: {
          edgeId,
        },
      },
    },
  };
}

export function addSkill(pokemonId: number, skillId: number, level: number, bonus: number): PokemonReducerAction {
  const safeBonus = Number(bonus);
  const safeLevel = Number(level);

  if (!Number.isNaN(safeBonus) && !Number.isNaN(safeLevel)) {
    return {
      type: ADD_SKILL,
      payload: {
        request: {
          url: `/pokemon/${pokemonId}/skill`,
          method: 'POST',
          data: {
            skillId,
            level: safeLevel,
            bonus: safeBonus,
          },
        },
      },
    };
  }
}

export function updateSkillLevel(pokemonId: number, skillId: number, level: number): PokemonReducerAction {
  const safeLevel = Number(level);

  if (!Number.isNaN(safeLevel)) {
    return {
      type: UPDATE_SKILL_LEVEL,
      payload: {
        value: {
          skillId,
          level: safeLevel,
        },
        request: {
          url: `/pokemon/${pokemonId}/skill/${skillId}/level`,
          method: 'POST',
          data: {
            level: safeLevel,
          },
        },
      },
    };
  }
}

export function updateSkillBonus(pokemonId: number, skillId: number, bonus: number): PokemonReducerAction {
  const safeBonus = Number(bonus);

  if (!Number.isNaN(safeBonus)) {
    return {
      type: UPDATE_SKILL_BONUS,
      payload: {
        value: {
          skillId,
          bonus: safeBonus,
        },
        request: {
          url: `/pokemon/${pokemonId}/skill/${skillId}/bonus`,
          method: 'POST',
          data: {
            bonus: safeBonus,
          },
        },
      },
    };
  }
}

export function removeSkill(pokemonId: number, skillId: number): PokemonReducerAction {
  return {
    type: REMOVE_SKILL,
    payload: {
      value: skillId,
      request: {
        url: `/pokemon/${pokemonId}/skill`,
        method: 'DELETE',
        data: {
          skillId,
        },
      },
    },
  };
}

export function addMove(pokemonId: number, moveId: number): PokemonReducerAction {
  return {
    type: ADD_MOVE,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/move`,
        method: 'POST',
        data: {
          moveId,
        }
      },
    },
  };
}

export function removeMove(pokemonId: number, moveId: number): PokemonReducerAction {
  return {
    type: REMOVE_MOVE,
    payload: {
      value: moveId,
      request: {
        url: `/pokemon/${pokemonId}/move`,
        method: 'DELETE',
        data: {
          moveId,
        }
      },
    },
  };
}

export function setMovePPUp(pokemonId: number, moveId: number, enabled: boolean): PokemonReducerAction {
  return {
    type: SET_MOVE_PP_UP,
    payload: {
      value: {
        moveId,
        enabled,
      },
      request: {
        url: `/pokemon/${pokemonId}/move/${moveId}/ppup`,
        method: 'POST',
        data: {
          isPPUpped: enabled,
        },
      },
    },
  };
}

export function setMoveType(pokemonId: number, moveId: number, type: TypeName): PokemonReducerAction {
  return {
    type: SET_MOVE_TYPE,
    payload: {
      value: {
        moveId,
        type,
      },
      request: {
        url: `/pokemon/${pokemonId}/move/${moveId}/type`,
        method: 'POST',
        data: {
          type,
        },
      },
    },
  };
}

export function setMoveIsTutored(pokemonId: number, moveId: number, isTutored: boolean): PokemonReducerAction {
  return {
    type: SET_MOVE_IS_TUTORED,
    payload: {
      value: {
        moveId,
        isTutored,
      },
      request: {
        url: `/pokemon/${pokemonId}/move/${moveId}/tutored`,
        method: 'POST',
        data: {
          isTutored,
        },
      },
    },
  };
}

export function setPokemonType(pokemonId: number, type1: TypeName, type2: TypeName): PokemonReducerAction {
  return {
    type: SET_POKEMON_TYPE,
    payload: {
      value: [type1, type2],
      request: {
        url: `/pokemon/${pokemonId}/types`,
        method: 'POST',
        data: {
          type1,
          type2,
        },
      },
    },
  };
}

export function setPokemonActive(pokemonId: number, active: boolean): PokemonReducerAction {
  return {
    type: SET_POKEMON_ACTIVE,
    payload: {
      value: active,
      request: {
        url: `/pokemon/${pokemonId}/active`,
        method: 'POST',
        data: {
          active,
        },
      },
    },
  };
}

export function setPokemonName(pokemonId: number, name: string): PokemonReducerAction {
  return {
    type: SET_POKEMON_NAME,
    payload: {
      value: name,
      request: {
        url: `/pokemon/${pokemonId}/name`,
        method: 'POST',
        data: {
          name,
        }
      },
    },
  };
}

export function setPokemonSpecies(pokemonId: number, speciesId: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_SPECIES,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/species`,
        method: 'POST',
        data: {
          speciesId,
        }
      },
    },
  };
}

export function setPokemonExperience(pokemonId: number, experience: number): PokemonReducerAction {
  const value = Number(experience);

  if (!Number.isNaN(value)) {
    return {
      type: SET_POKEMON_EXPERIENCE,
      payload: {
        value: experience,
        request: {
          url: `pokemon/${pokemonId}/experience`,
          method: 'POST',
          data: {
            experience: value,
          },
        },
      },
    };
  }
}

export function setPokemonGender(pokemonId: number, value: Gender): PokemonReducerAction {
  return {
    type: SET_POKEMON_GENDER,
    payload: {
      value,
      request: {
        url: `/pokemon/${pokemonId}/gender`,
        method: 'POST',
        data: {
          gender: value,
        }
      },
    },
  };
}

export function setPokemonLoyalty(pokemonId: number, value: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_LOYALTY,
    payload: {
      value,
      request: {
        url: `pokemon/${pokemonId}/loyalty`,
        method: 'POST',
        data: {
          loyalty: value,
        },
      },
    },
  };
}

export function setPokemonTrainer(pokemonId: number, trainerId: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_TRAINER,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}/trainer`,
        method: 'POST',
        data: {
          trainerId,
        }
      },
    },
  };
}

export function setPokemonBaseStat(pokemonId: number, stat: Stat, value: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_BASE_STAT,
    payload: {
      value: {
        stat,
        value: Number(value),
      },
      request: {
        url: `/pokemon/${pokemonId}/stat`,
        method: 'POST',
        data: {
          type: 'base',
          stat,
          value: value || 0,
        },
      },
    },
  };
}

export function setPokemonAddedStat(pokemonId: number, stat: Stat, value: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_ADDED_STAT,
    payload: {
      value: {
        stat,
        value: Number(value),
      },
      request: {
        url: `/pokemon/${pokemonId}/stat`,
        method: 'POST',
        data: {
          type: 'added',
          stat,
          value: value || 0,
        },
      },
    },
  };
}

export function setPokemonVitaminStat(pokemonId: number, stat: Stat, value: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_VITAMIN_STAT,
    payload: {
      value: {
        stat,
        value: Number(value),
      },
      request: {
        url: `/pokemon/${pokemonId}/stat`,
        method: 'POST',
        data: {
          type: 'vitamin',
          stat,
          value: value || 0,
        },
      },
    },
  };
}

export function setPokemonBonusStat(pokemonId: number, stat: Stat, value: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_BONUS_STAT,
    payload: {
      value: {
        stat,
        value: Number(value),
      },
      request: {
        url: `/pokemon/${pokemonId}/stat`,
        method: 'POST',
        data: {
          type: 'bonus',
          stat,
          value: value || 0,
        },
      },
    },
  };
}

export function setMoveOrder(pokemonId: number, moveId: number, position: number): PokemonReducerAction {
  return {
    type: SET_MOVE_ORDER,
    payload: {
      value: {
        moveId,
        position,
      },
      request: {
        url: `/pokemon/${pokemonId}/move/${moveId}/order`,
        method: 'POST',
        data: {
          position,
        },
      },
    },
  };
}

export function setCapabilityOrder(pokemonId: number, capabilityId: number, position: number): PokemonReducerAction {
  return {
    type: SET_CAPABILITY_ORDER,
    payload: {
      value: {
        capabilityId,
        position,
      },
      request: {
        url: `/pokemon/${pokemonId}/capability/${capabilityId}/order`,
        method: 'POST',
        data: {
          position,
        },
      },
    },
  };
}

export function setSkillOrder(pokemonId: number, skillId: number, position: number): PokemonReducerAction {
  return {
    type: SET_SKILL_ORDER,
    payload: {
      value: {
        skillId,
        position,
      },
      request: {
        url: `/pokemon/${pokemonId}/skill/${skillId}/order`,
        method: 'POST',
        data: {
          position,
        },
      },
    },
  };
}

export function setEdgeOrder(pokemonId: number, edgeId: number, position: number): PokemonReducerAction {
  return {
    type: SET_EDGE_ORDER,
    payload: {
      value: {
        edgeId,
        position,
      },
      request: {
        url: `/pokemon/${pokemonId}/edge/${edgeId}/order`,
        method: 'POST',
        data: {
          position,
        },
      },
    },
  };
}

export function saveNotes(pokemonId: number, notes: string): PokemonReducerAction {
  return {
    type: SAVE_GM_NOTES,
    payload: {
      value: notes,
      request: {
        url: `/pokemon/${pokemonId}/notes`,
        method: 'POST',
        data: {
          notes,
        },
      },
    },
  };
}

export function saveGMNotes(pokemonId: number, notes: string): PokemonReducerAction {
  return {
    type: SAVE_GM_NOTES,
    payload: {
      value: notes,
      request: {
        url: `/pokemon/${pokemonId}/gmNotes`,
        method: 'POST',
        data: {
          gmNotes: notes,
        },
      },
    },
  };
}


export function deletePokemon(pokemonId: number): PokemonReducerAction {
  return {
    type: DELETE_POKEMON,
    payload: {
      request: {
        url: `/pokemon/${pokemonId}`,
        method: 'DELETE',
      },
    },
  };
}
