import { Pokemon } from "../server/models/pokemon";
import { Trainer } from "../server/models/trainer";

const CREATE_NEW_TRAINER = 'CREATE_NEW_TRAINER';
const CREATE_NEW_TRAINER_SUCCESS = 'CREATE_NEW_TRAINER_SUCCESS';
const FETCH_TRAINERS = 'FETCH_TRAINERS';
const FETCH_TRAINERS_SUCCESS = 'FETCH_TRAINERS_SUCCESS';
const SET_SELECTED_TRAINER = 'SET_SELECTED_TRAINER';
const CREATE_NEW_POKEMON = 'CREATE_NEW_POKEMON';
const CREATE_NEW_POKEMON_SUCCESS = 'CREATE_NEW_POKEMON_SUCCESS';

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

type CreateNewTrainerAction = {
  type: typeof CREATE_NEW_TRAINER;
  payload: AxiosRequest;
};

type CreateNewTrainerSuccessAction = {
  type: typeof CREATE_NEW_TRAINER_SUCCESS;
  payload: AxiosResponse<Trainer>;
}

type FetchTrainersAction = {
  type: typeof FETCH_TRAINERS;
  payload: AxiosRequest;
}

type FetchTrainersSuccessAction = {
  type: typeof FETCH_TRAINERS_SUCCESS;
  payload: AxiosResponse<Trainer[]>;
}

type SetSelectedTrainerAction = {
  type: typeof SET_SELECTED_TRAINER;
  payload: {
    trainerId: number;
  };
}

type CreateNewPokemonAction = {
  type: typeof CREATE_NEW_POKEMON;
  payload: AxiosRequest;
}
type CreateNewPokemonSuccessAction = {
  type: typeof CREATE_NEW_POKEMON_SUCCESS;
  payload: AxiosResponse<Pokemon>;
}

type TrainerReducerAction =
  CreateNewTrainerAction | 
  CreateNewTrainerSuccessAction |
  FetchTrainersAction |
  FetchTrainersSuccessAction | 
  SetSelectedTrainerAction |
  CreateNewPokemonAction | 
  CreateNewPokemonSuccessAction;

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

    case CREATE_NEW_POKEMON_SUCCESS:
      return {
        ...state,
        trainers: state.trainers.reduce((acc, trainer) => {
          if (trainer.id === state.selectedTrainer) {
            return [...acc, {
              ...trainer,
              pokemon: [...trainer.pokemon, action.payload.data],
            }];
          }

          return [...acc, trainer];
        }, []),
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
