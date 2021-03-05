import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { addHeldItem, HELD_ITEM, removeHeldItem } from '../store/pokemon';
import { useDispatch } from 'react-redux';
import { useRequestData } from '../utils/requests';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DefinitionLookahead } from './DefinitionLookahead';
import { StatValue, IconButton, Button } from './Layout';
import { Theme } from '../utils/theme';
import { useTypedSelector } from '../store/rootReducer';
import { RulebookHeldItem } from '../server/models/rulebookHeldItem';

export const HeldItemList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemon = useTypedSelector(store => store.pokemon.data);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const [selectedHeldItem, setSelectedHeldItem] = useState(null);

  const requestHeldItemData = useRequestData(HELD_ITEM);

  const handleAddHeldItem = useCallback(() => {
    dispatch(addHeldItem(pokemon.id, selectedHeldItem.value));
    setSelectedHeldItem(null);
  }, [dispatch, selectedHeldItem]);

  const handleRemoveHeldItem = useCallback((heldItem: RulebookHeldItem) => {
    dispatch(removeHeldItem(pokemon.id, heldItem));
  }, [dispatch, pokemon.id]);

  return (
    <Container>
      {pokemon.heldItems.map(heldItem => (
        <HeldItemListItem key={heldItem.id} onClick={() => !editMode && requestHeldItemData(heldItem.id)}> 
          {heldItem.name}
          {editMode && <HeldItemDeleteButton icon={faTimes} onClick={() => handleRemoveHeldItem(heldItem)}/>}
        </HeldItemListItem>
      ))}
      {editMode && (
        <HeldItemLookaheadItem>
          <DefinitionLookahead
            path='reference/heldItems'
            onChange={setSelectedHeldItem}
            value={selectedHeldItem}
            placeholder="Enter a held item..."
          />
          <DefinitionSelectionButton
            onClick={handleAddHeldItem}
            disabled={selectedHeldItem === null || selectedHeldItem === undefined}
          >
            Add
          </DefinitionSelectionButton>
        </HeldItemLookaheadItem>
      )}
    </Container>
  );
};

const Container = styled(StatValue)`
  flex-direction: column;
  padding: 0;
`;

const HeldItemDeleteButton = styled(IconButton)``;

const HeldItemListItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0.25rem 1rem;

  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }

  & ${HeldItemDeleteButton} {
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

const HeldItemLookaheadItem = styled(HeldItemListItem)`
  & > div {
    width: 100%;
    font-size: 0.875rem;
  }
`;