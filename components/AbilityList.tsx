import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ABILITY, addAbility, removeAbility } from '../store/pokemon';
import { useDispatch } from 'react-redux';
import { useRequestData } from '../utils/requests';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DefinitionLookahead } from './DefinitionLookahead';
import { StatValue, IconButton, Button } from './Layout';
import { Theme } from '../utils/theme';
import { useTypedSelector } from '../store/rootReducer';
import { RulebookAbility } from '../server/models/rulebookAbility';

export const AbilityList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemon = useTypedSelector(store => store.pokemon.data);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const [selectedAbility, setSelectedAbility] = useState(null);

  const requestAbilityData = useRequestData(ABILITY);

  const handleAddAbility = useCallback(() => {
    dispatch(addAbility(pokemon.id, selectedAbility.value));
    setSelectedAbility(null);
  }, [dispatch, selectedAbility]);

  const handleRemoveAbility = useCallback((ability: RulebookAbility) => {
    dispatch(removeAbility(pokemon.id, ability));
  }, [dispatch, pokemon.id]);

  return (
    <Container>
      {pokemon.abilities.map(ability => (
        <AbilityListItem key={ability.id} onClick={() => !editMode && requestAbilityData(ability.id)}> 
          {ability.name}
          {editMode && <AbilityDeleteButton icon={faTimes} onClick={() => handleRemoveAbility(ability)}/>}
        </AbilityListItem>
      ))}
      {editMode && (
        <AbilityLookaheadItem>
          <DefinitionLookahead
            path='reference/abilities'
            onChange={setSelectedAbility}
            value={selectedAbility}
            placeholder="Enter an ability..."
          />
          <DefinitionSelectionButton
            onClick={handleAddAbility}
            disabled={selectedAbility === null || selectedAbility === undefined}
          >
            Add
          </DefinitionSelectionButton>
        </AbilityLookaheadItem>
      )}
    </Container>
  );
};

const Container = styled(StatValue)`
  flex-direction: column;
  padding: 0;
`;

const AbilityDeleteButton = styled(IconButton)``;

const AbilityListItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0.25rem 1rem;

  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }

  & ${AbilityDeleteButton} {
    margin-left: auto;
  }


  @media screen and (max-width: ${Theme.mobileThreshold}) {
    padding: 0.25rem 0;
  }
`;

const DefinitionSelectionButton = styled(Button)`
  height: 2.375rem;
  margin-left: 0.5rem;
  padding: 0.25rem 1rem;

  &:disabled {
    opacity: 0.5;
  }
`;

const AbilityLookaheadItem = styled(AbilityListItem)`
  & > div {
    width: 100%;
    font-size: 0.875rem;
  }
`;