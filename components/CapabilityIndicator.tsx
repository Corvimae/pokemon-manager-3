import { useCallback } from "react";
import styled from 'styled-components';
import { CAPABILITY, updateCapabilityValue, removeCapability } from "../store/pokemon";
import { useRequestData } from "../utils/requests";
import { Theme } from "../utils/theme";
import { useDispatch } from "react-redux";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./Layout";
import { SortableElement } from "react-sortable-hoc";
import { useTypedSelector } from "../store/rootReducer";
import { JunctionedCapability } from "../server/models/pokemon";

interface CapabilityIndicatorProps {
  capability: JunctionedCapability;
}

export const UnsortableCapabilityIndicator: React.FC<CapabilityIndicatorProps> = ({ capability }) => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const speedCombatStages = useTypedSelector(store => store.pokemon.data.speedCombatStages);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const requestCapabilityData = useRequestData(CAPABILITY);

  const handleEditValueChange = useCallback(event => {
    dispatch(updateCapabilityValue(pokemonId, capability.id, event.target.value));
  }, [dispatch, pokemonId, capability.id]);

  const handleDelete = useCallback(() => {
    dispatch(removeCapability(pokemonId, capability.id));
  }, [dispatch, removeCapability, capability.id]);

  const calculatedValue = capability.PokemonCapability.value + (capability.isMovementCapability ? Math.floor(speedCombatStages / 2) : 0);

  return (
    <Container
      key={capability.id}
      role="button"
      tabIndex={0}
      hasValue={editMode || capability.PokemonCapability.value > 0}
      onClick={() => !editMode && requestCapabilityData(capability.id)}
    >
      {editMode && <DeleteButton icon={faTimes} onClick={handleDelete} inverse />}
      <CapabilityIndicatorName>{capability.name}</CapabilityIndicatorName>
      {(capability.PokemonCapability.value > 0 || editMode) && (
        <CapabilityIndicatorValue editMode={editMode}>
          {editMode && <CapabilityValueInput type="number" defaultValue={capability.PokemonCapability.value} onChange={handleEditValueChange} />}
          {!editMode && calculatedValue}
        </CapabilityIndicatorValue>
      )}
    </Container>
  );
}

export const CapabilityIndicator = SortableElement(UnsortableCapabilityIndicator);

const Container = styled.div<{ hasValue: boolean }>`
  position: relative;
  display: flex;
  height: 1.75rem;
  max-height: 1.75rem;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  border: none;
  margin: 0;
  padding: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #333;
  border-radius: 0.875rem;
  box-shadow: ${Theme.dropShadow};
  padding: 0 ${props => props.hasValue ? 2 : 0}rem 0 0;
  overflow: hidden;
`;

const CapabilityIndicatorName = styled.div`
  display: flex;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-grow: 1;
`;

const CapabilityIndicatorValue = styled.div<{ editMode: boolean }>`
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  width: 2.25rem;
  padding-left: 0.5rem;
  height: 100%;
  background-color: ${({ editMode }) => editMode ? Theme.backgroundStripe : '#dcbb38'};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  clip-path: polygon(30% 0, calc(100% + 1px) 0%, calc(100% + 1px) 100%, 0% 100%);

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    background-color: ${({ editMode }) => editMode ? '#666' : '#dcbb38'};
  }
`;

const CapabilityValueInput = styled.input`
  width: 2rem;
  font-size: 1rem;
  text-align: center;
  padding: 0;
  border: none;
  background-color: transparent;
  border-radius: 0;
  font-family: inherit;
  -moz-appearance: textfield;
  margin: 0 0.25rem 0 0;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const DeleteButton = styled(IconButton)`
  margin: 0 0.5rem;
`;