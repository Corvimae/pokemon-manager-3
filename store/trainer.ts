import { Pokemon } from '../server/models/pokemon';
import { Trainer } from '../server/models/trainer';
import { ImmediateUpdateRequestActions, RequestActions } from './types';

function updateTrainerById(state: State, trainerId: number, update: (trainer: Trainer) => Trainer): State {
  return {
    ...state,
    trainers: state.trainers.reduce((acc, trainer) => {
      if (trainer.id === trainerId) {
        return [...acc, update(trainer)];
      }

      return [...acc, trainer];
    }, []),
  }
}

const CREATE_NEW_TRAINER = 'CREATE_NEW_TRAINER';
const CREATE_NEW_TRAINER_SUCCESS = 'CREATE_NEW_TRAINER_SUCCESS';
const FETCH_TRAINERS = 'FETCH_TRAINERS';
const FETCH_TRAINERS_SUCCESS = 'FETCH_TRAINERS_SUCCESS';
const SET_SELECTED_TRAINER = 'SET_SELECTED_TRAINER';
const CREATE_NEW_POKEMON = 'CREATE_NEW_POKEMON';
const CREATE_NEW_POKEMON_SUCCESS = 'CREATE_NEW_POKEMON_SUCCESS';
const SET_TRAINER_CAMPAIGN = 'SET_TRAINER_CAMPAIGN';
const DELETE_TRAINER = 'DELETE_TRAINER';

type CreateNewTrainerActions = RequestActions<typeof CREATE_NEW_TRAINER, Trainer>;
type FetchTrainersActions = RequestActions<typeof FETCH_TRAINERS, Trainer[]>;
type CreateNewPokemonActions = RequestActions<typeof CREATE_NEW_POKEMON, Pokemon>;
type SetTrainerCampaignActions = ImmediateUpdateRequestActions<typeof SET_TRAINER_CAMPAIGN, Trainer, { trainerId: number, campaignId: number; campaignName: string }>
type DeleteTrainerActions = ImmediateUpdateRequestActions<typeof DELETE_TRAINER, {}, { trainerId: number }>

type SetSelectedTrainerAction = {
  type: typeof SET_SELECTED_TRAINER;
  payload: {
    trainerId: number;
  };
}

type TrainerReducerAction =
  CreateNewTrainerActions |
  FetchTrainersActions |
  CreateNewPokemonActions |
  SetTrainerCampaignActions |
  SetSelectedTrainerAction |
  DeleteTrainerActions;

interface State {
  isLoadingTrainers: boolean;
  trainers: Trainer[];
  selectedTrainer: number | undefined;
}

const initialState: State = {
  isLoadingTrainers: true,
  trainers: [],
  selectedTrainer: undefined,
};

export function reducer(state: State = initialState, action: TrainerReducerAction): State {
  switch (action.type) {
    case FETCH_TRAINERS:
      return {
        ...state,
        isLoadingTrainers: true,
      };

    case FETCH_TRAINERS_SUCCESS:
      return {
        ...state,
        isLoadingTrainers: false,
        trainers: action.payload.data,
      };

    case SET_SELECTED_TRAINER:
      return {
        ...state,
        selectedTrainer: action.payload.trainerId,
      };

    case CREATE_NEW_TRAINER_SUCCESS:
      return {
        ...state,
        trainers: [...state.trainers, action.payload.data],
      };

    case CREATE_NEW_POKEMON_SUCCESS:
      return updateTrainerById(state, state.selectedTrainer, trainer => ({
        ...trainer,
        pokemon: [...trainer.pokemon, action.payload.data],
      } as Trainer));

    case SET_TRAINER_CAMPAIGN:
      return updateTrainerById(state, action.payload.value.trainerId, trainer => ({
        ...trainer,
        campaignId: action.payload.value.campaignId,
        campaign: {
          id: action.payload.value.campaignId,
          name: action.payload.value.campaignName,
        }
      } as Trainer));

    case DELETE_TRAINER:
      return {
        ...state,
        trainers: state.trainers.filter(trainer => trainer.id !== action.payload.value.trainerId),
        selectedTrainer: undefined,
      };
      
    default:
      return state;
  }
}

export function createNewTrainer(name: string): TrainerReducerAction {
  return {
    type: CREATE_NEW_TRAINER,
    payload: {
      request: {
        url: '/trainer',
        method: 'POST',
        data: {
          name,
        },
      },
    },
  };
}

export function fetchTrainers(): TrainerReducerAction {
  return {
    type: FETCH_TRAINERS,
    payload: {
      request: {
        url: '/trainer',
        method: 'GET',
      },
    },
  };
}

export function setSelectedTrainer(trainerId: number): TrainerReducerAction {
  return {
    type: SET_SELECTED_TRAINER,
    payload: {
      trainerId,
    },
  };
}

export function createNewPokemon(trainerId: number): TrainerReducerAction {
  return {
    type: CREATE_NEW_POKEMON,
    payload: {
      request: {
        url: '/pokemon',
        method: 'POST',
        data: {
          trainerId,
        },
      },
    },
  };
}

export function setTrainerCampaign(trainerId: number, campaignId: number, campaignName: string): TrainerReducerAction {
  return {
    type: SET_TRAINER_CAMPAIGN,
    payload: {
      value: {
        trainerId,
        campaignId,
        campaignName,
      },
      request: {
        url: `/trainer/${trainerId}/campaign`,
        method: 'POST',
        data: {
          campaignId,
        },
      },
    },
  };
}

export function deleteTrainer(trainerId: number): TrainerReducerAction {
  return {
    type: DELETE_TRAINER,
    payload: {
      value: {
        trainerId,
      },
      request: {
        url: `/trainer/${trainerId}`,
        method: 'DELETE',
      },
    },
  };
}
