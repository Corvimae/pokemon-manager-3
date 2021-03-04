import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { reducer as pokemonReducer } from "./pokemon";
import { reducer as trainerReducer } from "./trainer";

export const rootReducer = combineReducers({
  trainer: trainerReducer,
  pokemon: pokemonReducer
})

export type RootState = ReturnType<typeof rootReducer>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
