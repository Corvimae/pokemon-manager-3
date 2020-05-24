import { useSelector, TypedUseSelectorHook } from "react-redux";
import { PokemonData, CombatStages, PokemonDataResponse, MoveData, AbilityData, MoveDefinition, AbilityDefinition, CapabilityDefinition, HeldItemDefinition, TypeData, SpeciesData, StatBlock, AlliedPokemon, MobileMode, Gender } from "../utils/types";

export const MOVE = 'MOVE';
export const ABILITY = 'ABILITY';
export const CAPABILITY = 'CAPABILITY';
export const HELD_ITEM = 'HELD_ITEM';

const DETAIL_REQUEST_PATHS = {
  MOVE: 'moves',
  ABILITY: 'abilities',
  CAPABILITY: 'capabilities',
  HELD_ITEM: 'helditems',
};

const LOAD_AUTH_STATUS = 'LOAD_AUTH_STATUS';
const LOAD_AUTH_STATUS_SUCCESS = 'LOAD_AUTH_STATUS_SUCCESS';
const SET_MOBILE_MODE = 'SET_MOBILE_MODE';
const LOAD_TYPE_IDS = 'LOAD_TYPE_IDS';
const LOAD_TYPE_IDS_SUCCESS = 'LOAD_TYPE_IDS_SUCCESS';
const LOAD_DATA = 'LOAD_DATA';
const LOAD_DATA_SUCCESS = 'LOAD_DATA_SUCCESS';
const LOAD_ALLIES = 'LOAD_ALLIES';
const LOAD_ALLIES_SUCCESS = 'LOAD_ALLIES_SUCCESS';
const BUMP_COMBAT_STAGE = 'BUMP_COMBAT_STAGE';
const REQUEST_DETAILS = 'REQUEST_DETAILS';
const REQUEST_DETAILS_SUCCESS = 'REQUEST_DETAILS_SUCCESS';
const SHOW_NOTES = 'SHOW_NOTES';
const CLOSE_DETAILS_PANEL_ACTION = 'CLOSE_DETAILS_PANEL_ACTION';
const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
const SET_HEALTH = 'SET_HEALTH';
const SET_NATURE = 'SET_NATURE';
const SET_HELD_ITEM = 'SET_HELD_ITEM';
const ADD_ABILITY = 'ADD_ABILITY';
const ADD_ABILITY_SUCCESS = 'ADD_ABILITY_SUCCESS';
const REMOVE_ABILITY = 'REMOVE_ABILITY';
const UPDATE_CAPABILITY_VALUE = 'UPDATE_CAPABILITY_VALUE';
const ADD_CAPABILITY = 'ADD_CAPABILITY'
const ADD_CAPABILITY_SUCCESS = 'ADD_CAPABILITY_SUCCESS'
const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';
const ADD_MOVE = 'ADD_MOVE'
const ADD_MOVE_SUCCESS = 'ADD_MOVE_SUCCESS'
const REMOVE_MOVE = 'REMOVE_MOVE';
const SET_MOVE_PP_UP = 'SET_MOVE_PP_UP';
const SET_MOVE_TYPE = 'SET_MOVE_TYPE';
const SET_POKEMON_TYPE = 'SET_POKEMON_TYPE';
const SET_POKEMON_ACTIVE = 'SET_POKEMON_ACTIVE';
const SET_POKEMON_NAME = 'SET_POKEMON_NAME';
const SET_POKEMON_SPECIES = 'SET_POKEMON_SPECIES';
const SET_POKEMON_SPECIES_SUCCESS = 'SET_POKEMON_SPECIES_SUCCESS';
const SET_POKEMON_EXPERIENCE = 'SET_POKEMON_EXPERIENCE';
const SET_POKEMON_GENDER = 'SET_POKEMON_GENDER';
const SET_POKEMON_LOYALTY = 'SET_POKEMON_LOYALTY';
const SET_POKEMON_OWNER = 'SET_POKEMON_OWNER';
const SET_BASE_STAT = 'SET_BASE_STAT';
const SET_ADDED_STAT = 'SET_ADDED_STAT';
const SET_MOVE_ORDER = 'SET_MOVE_ORDER';
const SET_CAPABILITY_ORDER = 'SET_CAPABILITY_ORDER';
const SAVE_NOTES = 'SAVE_NOTES';
const SAVE_GM_NOTES = 'SAVE_GM_NOTES';

interface ActiveMove {
  type: typeof MOVE;
  value: MoveDefinition | undefined;
}

interface ActiveAbility {
  type: typeof ABILITY;
  value: AbilityDefinition | undefined;
}

interface ActiveCapability {
  type: typeof CAPABILITY;
  value: CapabilityDefinition | undefined;
}

interface ActiveHeldItem {
  type: typeof HELD_ITEM;
  value: HeldItemDefinition;
}

type ActiveDetail = ActiveMove | ActiveAbility | ActiveCapability | ActiveHeldItem;
export type ActiveDetailType = typeof MOVE | typeof ABILITY | typeof CAPABILITY | typeof HELD_ITEM;

interface AxiosRequest {
  request: {
    url: string;
    method?: string;
    data?: Record<string, unknown>;
  };
}

interface AxiosResponse<T> {
  data: T;
}

type SetMobileModeAction = {
  type: typeof SET_MOBILE_MODE;
  payload: {
    mode: MobileMode;
  };
};

type LoadAuthStatusAction = {
  type: typeof LOAD_AUTH_STATUS;
  payload: AxiosRequest;
};

type LoadAuthStatusSuccessAction = {
  type: typeof LOAD_AUTH_STATUS_SUCCESS;
  payload: AxiosResponse<boolean>;
}

type LoadTypeIdsAction = {
  type: typeof LOAD_TYPE_IDS;
  payload: AxiosRequest;
};

type LoadTypeIdsSuccessAction = {
  type: typeof LOAD_TYPE_IDS_SUCCESS;
  payload: {
    data: TypeData[];
  }
};

type LoadDataAction = {
  type: typeof LOAD_DATA;
  payload: AxiosRequest;
};

type LoadDataSuccessAction = {
  type: typeof LOAD_DATA_SUCCESS;
  payload: AxiosResponse<PokemonDataResponse>;
};
 
type LoadAlliesAction = {
  type: typeof LOAD_ALLIES;
  payload: AxiosRequest;
};

type LoadAlliesSuccessAction = {
  type: typeof LOAD_ALLIES_SUCCESS;
  payload: AxiosResponse<AlliedPokemon[]>;
};

type BumpCombatStageAction = {
  type: typeof BUMP_COMBAT_STAGE;
  payload: {
    stat: keyof CombatStages;
    amount: number;
  }
}

type RequestDetailsAction = {
  type: typeof REQUEST_DETAILS;
  payload: {
    type: ActiveDetailType;
  } & AxiosRequest;
};

type RequestDetailsSuccessAction = {
  type: typeof REQUEST_DETAILS_SUCCESS;
  payload: AxiosResponse<ActiveDetail | { base: ActiveDetail }>;
  meta: {
    previousAction: {
      payload: {
        type: ActiveDetailType;
      }
    }
  }
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

type SetHealthAction = {
  type: typeof SET_HEALTH;
  payload: {
    value: number,
  } & AxiosRequest;
};

type SetNatureAction = {
  type: typeof SET_NATURE;
  payload: {
    id: number;
    name: string;
  } & AxiosRequest;
}

type SetHeldItemAction = {
  type: typeof SET_HELD_ITEM;
  payload: {
    heldItemId: number;
    heldItemName: string;
  } & AxiosRequest;
}

type RemoveAbilityAction = {
  type: typeof REMOVE_ABILITY;
  payload: {
    ability: AbilityData;
  } & AxiosRequest;
}

type AddAbilityAction = {
  type: typeof ADD_ABILITY;
  payload: {
    abilityId: number;
    abilityName: string;
  } & AxiosRequest;
};

type AddAbilitySuccessAction = {
  type: typeof ADD_ABILITY_SUCCESS;
  payload: AxiosResponse<number>;
  meta: {
    previousAction: {
      payload: {
        abilityId: number;
        abilityName: string;
      }
    }
  }
};

type UpdateCapabilityValueAction = {
  type: typeof UPDATE_CAPABILITY_VALUE;
  payload: {
    capabilityId: number;
    value: number;
  } & AxiosRequest;
};

type AddCapabilityAction = {
  type: typeof ADD_CAPABILITY;
  payload: {
    capabilityId: number;
    capabilityName: string;
    value: number;
  } & AxiosRequest;
};


type AddCapabilitySuccessAction = {
  type: typeof ADD_CAPABILITY_SUCCESS;
  payload: AxiosResponse<number>;
  meta: {
    previousAction: {
      payload: {
        capabilityId: number;
        capabilityName: string;
        value: number;
      }
    }
  }
};

type RemoveCapabilityAction = {
  type: typeof REMOVE_CAPABILITY;
  payload: {
    capabilityId: number;
  } & AxiosRequest;
};

type AddMoveAction = {
  type: typeof ADD_MOVE;
  payload: AxiosRequest;
};

type AddMoveSuccessAction = {
  type: typeof ADD_MOVE_SUCCESS;
  payload: {
    data: MoveData;
  };
};

type RemoveMoveAction = {
  type: typeof REMOVE_MOVE;
  payload: {
    moveId: number;
  } & AxiosRequest;
};

type SetMovePPUpAction = {
  type: typeof SET_MOVE_PP_UP;
  payload: {
    moveId: number;
    enabled: boolean;
  } & AxiosRequest;
};

type SetMoveTypeAction = {
  type: typeof SET_MOVE_TYPE;
  payload: {
    moveId: number;
    typeId: number;
    typeName: string;
  } & AxiosRequest;
};

type SetPokemonTypeAction = {
  type: typeof SET_POKEMON_TYPE;
  payload: {
    index: number;
    typeId: number;
    typeName: string;
  } & AxiosRequest;
};

type SetPokemonActiveAction = {
  type: typeof SET_POKEMON_ACTIVE;
  payload: {
    active: boolean;
  } & AxiosRequest;
};

type SetPokemonNameAction = {
  type: typeof SET_POKEMON_NAME;
  payload: {
    value: string;
  } & AxiosRequest;
}

type SetPokemonSpeciesAction = {
  type: typeof SET_POKEMON_SPECIES;
  payload: AxiosRequest;
}

type SetPokemonSpeciesSucessAction = {
  type: typeof SET_POKEMON_SPECIES_SUCCESS;
  payload: AxiosResponse<SpeciesData>;
}

type SetPokemonExperienceAction = {
  type: typeof SET_POKEMON_EXPERIENCE;
  payload: {
    experience: number;
  } & AxiosRequest;
};

type SetPokemonGenderAction = {
  type: typeof SET_POKEMON_GENDER;
  payload: {
    value: string;
  } & AxiosRequest;
};

type SetPokemonLoyaltyAction = {
  type: typeof SET_POKEMON_LOYALTY;
  payload: {
    value: number;
  } & AxiosRequest;
};

type SetPokemonOwnerAction = {
  type: typeof SET_POKEMON_OWNER;
  payload: {
    ownerId: number;
    ownerName: string;
  } & AxiosRequest;
};

type SetBaseStatAction = {
  type: typeof SET_BASE_STAT;
  payload: {
    stat: keyof StatBlock;
    value: number;
  } & AxiosRequest;
};

type SetAddedStatAction = {
  type: typeof SET_ADDED_STAT;
  payload: {
    stat: keyof StatBlock;
    value: number;
  } & AxiosRequest;
};

type SetMoveOrderAction = {
  type: typeof SET_MOVE_ORDER;
  payload: {
    moveId: number;
    position: number;
  } & AxiosRequest;
};

type SetCapabilityOrderAction = {
  type: typeof SET_CAPABILITY_ORDER;
  payload: {
    capabilityId: number;
    position: number;
  } & AxiosRequest;
};

type SaveNotesAction = {
  type: typeof SAVE_NOTES;
  payload: {
    notes: string;
  } & AxiosRequest;
};

type SaveGMNotesAction = {
  type: typeof SAVE_GM_NOTES;
  payload: {
    notes: string;
  } & AxiosRequest;
};

type PokemonReducerAction =
  LoadAuthStatusAction |
  LoadAuthStatusSuccessAction |
  SetMobileModeAction |
  LoadTypeIdsAction |
  LoadTypeIdsSuccessAction |
  LoadDataAction |
  LoadDataSuccessAction |
  LoadAlliesAction | 
  LoadAlliesSuccessAction |
  BumpCombatStageAction |
  RequestDetailsAction |
  RequestDetailsSuccessAction |
  ShowNotesAction |
  CloseDetailsPanelAction |
  ToggleEditModeAction |
  SetHealthAction |
  SetNatureAction |
  SetHeldItemAction |
  AddAbilityAction | 
  AddAbilitySuccessAction |
  RemoveAbilityAction |
  UpdateCapabilityValueAction |
  AddCapabilityAction | 
  AddCapabilitySuccessAction |
  RemoveCapabilityAction |
  AddMoveAction | 
  AddMoveSuccessAction |
  RemoveMoveAction |
  SetMovePPUpAction |
  SetMoveTypeAction |
  SetPokemonTypeAction |
  SetPokemonActiveAction |
  SetPokemonNameAction |
  SetPokemonSpeciesAction |
  SetPokemonSpeciesSucessAction |
  SetPokemonExperienceAction |
  SetPokemonGenderAction |
  SetPokemonLoyaltyAction |
  SetPokemonOwnerAction |
  SetBaseStatAction |
  SetAddedStatAction |
  SetMoveOrderAction |
  SetCapabilityOrderAction |
  SaveNotesAction |
  SaveGMNotesAction;

const initialCombatStagesState: CombatStages = {
  attack: 0,
  defense: 0,
  spattack: 0,
  spdefense: 0,
  speed: 0,
};

interface State {
  isLoggedIn: boolean;
  mobileMode: MobileMode;
  pokemon: PokemonData | undefined;
  allies: AlliedPokemon[];
  typeIds: Record<string, number>;
  combatStages: CombatStages;
  currentHealth: number;
  activeDetails: {
    mode: 'none' | 'notes' | 'description';
    details: ActiveDetail | undefined;
  };
  editMode: boolean;
}

const initialState: State = {
  isLoggedIn: false,
  mobileMode: 'data',
  pokemon: undefined,
  allies: [],
  typeIds: {},
  currentHealth: 0,
  combatStages: { ...initialCombatStagesState },
  activeDetails: {
    mode: 'none',
    details: undefined,
  },
  editMode: false,
};

export function reducer(state: State = initialState, action: PokemonReducerAction): State {
  switch (action.type) {
    case LOAD_AUTH_STATUS_SUCCESS:
      return {
        ...state,
        isLoggedIn: action.payload.data,
      };
      
    case SET_MOBILE_MODE:
      return {
        ...state,
        mobileMode: action.payload.mode,
      };

    case LOAD_TYPE_IDS_SUCCESS:
      return {
        ...state,
        typeIds: action.payload.data.reduce((acc, { id, name }) => ({
          ...acc,
          [name]: id
        }), {}),
      };

    case LOAD_DATA_SUCCESS:
      return {
        ...state,
        pokemon: action.payload.data,
        currentHealth: action.payload.data.currentHealth,
        combatStages: { ...initialCombatStagesState },
      };
    
    case LOAD_ALLIES_SUCCESS:
      return {
        ...state,
        allies: action.payload.data,
      };

    case BUMP_COMBAT_STAGE:
      return {
        ...state,
        combatStages: {
          ...state.combatStages,
          [action.payload.stat]: Math.max(-6, Math.min(state.combatStages[action.payload.stat] + action.payload.amount, 6)),
        },
      };

    case REQUEST_DETAILS:
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          mode: 'description',
        },
      };

    case REQUEST_DETAILS_SUCCESS: 
      return {
        ...state,
        activeDetails: {
          ...state.activeDetails,
          details: {
            type: action.meta.previousAction.payload.type,
            value: ('base' in action.payload.data ? action.payload.data.base : action.payload.data) as any,
          }
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
        currentHealth: action.payload.value,
      };

    case SET_NATURE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          nature: {
            id: action.payload.id,
            name: action.payload.name,
          }
        }
      };

    case SET_HELD_ITEM:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          heldItem: {
            id: action.payload.heldItemId,
            name: action.payload.heldItemName,
          }
        }
      };

    case ADD_ABILITY_SUCCESS: {
      const alreadyHasAbility = state.pokemon.abilities.some(ability => ability.definition.id === action.meta.previousAction.payload.abilityId);

      if (alreadyHasAbility) return state;
      
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          abilities: [
            ...state.pokemon.abilities,
            {
              id: action.payload.data,
              definition: {
                id: action.meta.previousAction.payload.abilityId,
                name: action.meta.previousAction.payload.abilityName,
              },
            },
          ],
        },
      };
    }

    case REMOVE_ABILITY:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          abilities: state.pokemon.abilities.filter(ability => ability.id !== action.payload.ability.id),
        },
      };

    case UPDATE_CAPABILITY_VALUE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          capabilities: state.pokemon.capabilities.map(capability => (
            capability.id === action.payload.capabilityId ? { ...capability, value: action.payload.value } : capability
          )),
        },
      };

    case TOGGLE_EDIT_MODE:
      return {
        ...state,
        editMode: !state.editMode,
      };

    case ADD_CAPABILITY_SUCCESS: {
      const alreadyHasCapability = state.pokemon.capabilities.some(cap => cap.definition.id === action.meta.previousAction.payload.capabilityId);

      if (alreadyHasCapability) return state;
      
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          capabilities: [
            ...state.pokemon.capabilities,
            {
              id: action.payload.data,
              value: action.meta.previousAction.payload.value,
              definition: {
                id: action.meta.previousAction.payload.capabilityId,
                name: action.meta.previousAction.payload.capabilityName,
              },
            },
          ],
        },
      };
    }

    case REMOVE_CAPABILITY:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          capabilities: state.pokemon.capabilities.filter(cap => cap.id !== action.payload.capabilityId),
        },
      };

    case ADD_MOVE_SUCCESS:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          moves: [...state.pokemon.moves, action.payload.data],
        },
      };


    case REMOVE_MOVE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          moves: state.pokemon.moves.filter(move => move.id !== action.payload.moveId),
        },
      };

    case SET_MOVE_PP_UP:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          moves: state.pokemon.moves.map(move => move.id === action.payload.moveId ? { ...move, ppUp: action.payload.enabled } : move),
        },
      };

    case SET_MOVE_TYPE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          moves: state.pokemon.moves.map(move => move.id === action.payload.moveId ? {
            ...move,
            type: {
              id: action.payload.typeId,
              name: action.payload.typeName,
            },
          } : move),
        },
      };

    case SET_POKEMON_TYPE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          types: state.pokemon.types.map((type, index) => index === action.payload.index ? { 
            id: action.payload.typeId,
            name: action.payload.typeName
          } : type),
        },
      };

    case SET_POKEMON_ACTIVE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          isActive: action.payload.active,
        },
      };

    case SET_POKEMON_NAME:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          name: action.payload.value,
        },
      };

    case SET_POKEMON_SPECIES_SUCCESS:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          species: action.payload.data,
        },
      };

    case SET_POKEMON_EXPERIENCE:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          experience: action.payload.experience,
        },
      };

    case SET_POKEMON_GENDER:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          gender: action.payload.value as Gender,
        },
      };

    case SET_POKEMON_LOYALTY:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          loyalty: action.payload.value,
        },
      };

    case SET_POKEMON_OWNER:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          owner: {
            id: action.payload.ownerId,
            name: action.payload.ownerName,
            classes: [] // todo: maybe implement this?
          },
        },
      };

    case SET_BASE_STAT:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          stats: {
            ...state.pokemon.stats,
            base: {
              ...state.pokemon.stats.base,
              [action.payload.stat]: action.payload.value,
            },
          },
        },
      };

    case SET_ADDED_STAT:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          stats: {
            ...state.pokemon.stats,
            added: {
              ...state.pokemon.stats.added,
              [action.payload.stat]: action.payload.value,
            },
          },
        },
      };

    case SET_MOVE_ORDER: {
      const matchingMove = state.pokemon.moves.find(move => move.id === action.payload.moveId);
      const moveSet = [...state.pokemon.moves];
      
      moveSet.splice(moveSet.indexOf(matchingMove), 1);
      moveSet.splice(action.payload.position, 0, matchingMove);

      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          moves: moveSet
        },
      };
    }

    case SET_CAPABILITY_ORDER: {
      const matchingCapability = state.pokemon.capabilities.find(cap => cap.id === action.payload.capabilityId);
      const capabilitySet = [...state.pokemon.capabilities];
      
      capabilitySet.splice(capabilitySet.indexOf(matchingCapability), 1);
      capabilitySet.splice(action.payload.position, 0, matchingCapability);

      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          capabilities: capabilitySet
        },
      };
    }

    case SAVE_NOTES:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          notes: action.payload.notes,
        },
      };

    case SAVE_GM_NOTES:
      return {
        ...state,
        pokemon: {
          ...state.pokemon,
          gmNotes: action.payload.notes,
        },
      };

    default:
      return state;
  }
}

export function loadAuthStatus(): PokemonReducerAction {
  return {
    type: LOAD_AUTH_STATUS,
    payload: {
      request: {
        url: '/v2/authStatus',
      },
    },
  };
}

export function setMobileMode(mode: MobileMode): PokemonReducerAction {
  return {
    type: SET_MOBILE_MODE,
    payload: {
      mode,
    }
  };
}

export function loadTypeIds(): PokemonReducerAction {
  return {
    type: LOAD_TYPE_IDS,
    payload: {
      request: {
        url: '/v2/types',
      }
    },
  };
}

export function loadData(id: number): PokemonReducerAction {
  return {
    type: LOAD_DATA,
    payload: {
      request: {
        url: `/v1/pokemon/${id}`,
      }
    },
  };
}

export function loadAllies(id: number): PokemonReducerAction {
  return {
    type: LOAD_ALLIES,
    payload: {
      request: {
        url: `/v2/pokemon/${id}/allies`,
      }
    },
  }
}

export function bumpCombatStage(stat: keyof CombatStages, amount: number): PokemonReducerAction {
  return {
    type: BUMP_COMBAT_STAGE,
    payload: {
      stat,
      amount,
    },
  };
}

export function requestDetails(type: ActiveDetailType, id: number): PokemonReducerAction {
  return {
    type: REQUEST_DETAILS,
    payload: {
      type: type,
      request: {
        url: `/v1/${DETAIL_REQUEST_PATHS[type]}/${id}`
      }
    }
  };
};

export function requestMove(pokemonId: number, id: number): PokemonReducerAction {
  return {
    type: REQUEST_DETAILS,
    payload: {
      type: 'MOVE',
      request: {
        url: `/v2/pokemon/${pokemonId}/move/${id}`,
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

export function setHealth(pokemonId: number, value: number): PokemonReducerAction {
  return {
    type: SET_HEALTH,
    payload: {
      value,
      request: {
        url: `/v1/pokemon/${pokemonId}/update/health/${value}`,
      },
    },
  };
}

export function toggleEditMode(): PokemonReducerAction {
  return {
    type: TOGGLE_EDIT_MODE,
  };
}

export function setNature(pokemonId: number, id: number, name: string): PokemonReducerAction {
  return {
    type: SET_NATURE,
    payload: {
      id,
      name,
      request: {
        url: `/v1/pokemon/${pokemonId}/update/nature/${name}`,
      },
    },
  };
}

export function setHeldItem(pokemonId: number, heldItemId: number, heldItemName: string): PokemonReducerAction {
  return {
    type: SET_HELD_ITEM,
    payload: {
      heldItemId,
      heldItemName,
      request: {
        url: `/v1/pokemon${pokemonId}/update/helditem/${heldItemName}`,
      },
    }
  }
}

export function addAbility(pokemonId: number, abilityId: number, abilityName: string): PokemonReducerAction {
  return {
    type: ADD_ABILITY,
    payload: {
      abilityId,
      abilityName,
      request: {
        url: `/v1/pokemon/${pokemonId}/insert/ability/${abilityName}`,
      },
    },
  };
}

export function removeAbility(pokemonId: number, ability: AbilityData): PokemonReducerAction {
  return {
    type: REMOVE_ABILITY,
    payload: {
      ability,
      request: {
        url: `/v1/pokemon/${pokemonId}/remove/ability/${ability.definition.id}`,
      },
    },
  };
}

export function updateCapabilityValue(pokemonId: number, capabilityId: number, value: number): PokemonReducerAction {
  return {
    type: UPDATE_CAPABILITY_VALUE,
    payload: {
      capabilityId,
      value,
      request: {
        url: `/v1/pokemon/${pokemonId}/update/capability/${capabilityId}/${value || 0}`,
      },
    },
  };
}

export function addCapability(pokemonId: number, capabilityId: number, capabilityName: string, value: number): PokemonReducerAction {
  return {
    type: ADD_CAPABILITY,
    payload: {
      capabilityId,
      capabilityName,
      value,
      request: {
        url: `/v1/pokemon/${pokemonId}/insert/capability/${capabilityName}/${value || 0}`,
      },
    },
  };
}

export function removeCapability(pokemonId: number, capabilityId: number): PokemonReducerAction {
  return {
    type: REMOVE_CAPABILITY,
    payload: {
      capabilityId,
      request: {
        url: `/v1/pokemon/${pokemonId}/remove/capability/${capabilityId}`,
      },
    },
  };
}

export function addMove(pokemonId: number, moveId: number): PokemonReducerAction {
  return {
    type: ADD_MOVE,
    payload: {
      request: {
        url: `/v2/pokemon/${pokemonId}/moves/add/${moveId}`,
      },
    },
  };
}


export function removeMove(pokemonId: number, moveId: number): PokemonReducerAction {
  return {
    type: REMOVE_MOVE,
    payload: {
      moveId,
      request: {
        url: `/v2/pokemon/${pokemonId}/moves/delete/${moveId}`,
      },
    },
  };
}

export function setMovePPUp(pokemonId: number, moveId: number, enabled: boolean): PokemonReducerAction {
  return {
    type: SET_MOVE_PP_UP,
    payload: {
      moveId,
      enabled,
      request: {
        url: `/v2/pokemon/${pokemonId}/moves/${moveId}/ppUp/${enabled ? 1 : 0}`,
      },
    },
  };
}

export function setMoveType(pokemonId: number, moveId: number, typeId: number, typeName: string): PokemonReducerAction {
  return {
    type: SET_MOVE_TYPE,
    payload: {
      moveId,
      typeId,
      typeName,
      request: {
        url: `/v2/pokemon/${pokemonId}/moves/${moveId}/type/${typeId}`,
      },
    },
  };
}

export function setPokemonType(pokemonId: number, index: number, typeId: number, typeName: string): PokemonReducerAction {
  return {
    type: SET_POKEMON_TYPE,
    payload: {
      index,
      typeId,
      typeName,
      request: {
        url: `/v2/pokemon/${pokemonId}/types/${index + 1}/${typeId}`,
      },
    },
  };
}

export function setPokemonActive(pokemonId: number, active: boolean): PokemonReducerAction {
  return {
    type: SET_POKEMON_ACTIVE,
    payload: {
      active,
      request: {
        url: `/v2/pokemon/${pokemonId}/active/${active ? 1 : 0}`,
      },
    },
  };
}

export function setPokemonName(pokemonId: number, value: string): PokemonReducerAction {
  return {
    type: SET_POKEMON_NAME,
    payload: {
      value,
      request: {
        url: `/v2/pokemon/${pokemonId}/name/${value}`,
      },
    },
  };
}

export function setPokemonSpecies(pokemonId: number, speciesId: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_SPECIES,
    payload: {
      request: {
        url: `/v2/pokemon/${pokemonId}/species/${speciesId}`,
      },
    },
  };
}

export function setPokemonExperience(pokemonId: number, experience: number): PokemonReducerAction {
  return {
    type: SET_POKEMON_EXPERIENCE,
    payload: {
      experience,
      request: {
        url: `/v2/pokemon/${pokemonId}/experience/${experience || 0}`,
      },
    },
  };
}

export function setPokemonGender(pokemonId: number, value: string): PokemonReducerAction {
  return {
    type: SET_POKEMON_GENDER,
    payload: {
      value,
      request: {
        url: `/v2/pokemon/${pokemonId}/gender/${value}`,
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
        url: `/v2/pokemon/${pokemonId}/loyalty/${value || 0}`,
      },
    },
  };
}

export function setPokemonOwner(pokemonId: number, ownerId: number, ownerName: string): PokemonReducerAction {
  return {
    type: SET_POKEMON_OWNER,
    payload: {
      ownerId,
      ownerName,
      request: {
        url: `/v2/pokemon/${pokemonId}/owner/${ownerId}`,
      },
    },
  };
}

export function setBaseStat(pokemonId: number, stat: keyof StatBlock, value: number): PokemonReducerAction {
  return {
    type: SET_BASE_STAT,
    payload: {
      stat,
      value: Number(value),
      request: {
        url: `/v2/pokemon/${pokemonId}/stats/${stat}/base/${value || 0}`,
      },
    },
  };
}

export function setAddedStat(pokemonId: number, stat: keyof StatBlock, value: number): PokemonReducerAction {
  return {
    type: SET_ADDED_STAT,
    payload: {
      stat,
      value: Number(value),
      request: {
        url: `/v2/pokemon/${pokemonId}/stats/${stat}/added/${value || 0}`,
      },
    },
  };
}

export function setMoveOrder(pokemonId: number, moveId: number, position: number): PokemonReducerAction {
  return {
    type: SET_MOVE_ORDER,
    payload: {
      moveId,
      position,
      request: {
        url: `/v2/pokemon/${pokemonId}/moves/${moveId}/order/${position + 1}`,
      },
    },
  };
}

export function setCapabilityOrder(pokemonId: number, capabilityId: number, position: number): PokemonReducerAction {
  return {
    type: SET_CAPABILITY_ORDER,
    payload: {
      capabilityId,
      position,
      request: {
        url: `/v2/pokemon/${pokemonId}/capabilities/${capabilityId}/order/${position + 1}`,
      },
    },
  };
}

export function saveNotes(pokemonId: number, notes: string): PokemonReducerAction {
  return {
    type: SAVE_GM_NOTES,
    payload: {
      notes,
      request: {
        method: 'post',
        url: `/v2/pokemon/${pokemonId}/notes`,
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
      notes,
      request: {
        method: 'post',
        url: `/v2/pokemon/${pokemonId}/gmNotes`,
        data: {
          notes,
        },
      },
    },
  };
}

export const useTypedSelector: TypedUseSelectorHook<State> = useSelector
