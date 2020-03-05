import styled from 'styled-components';
import { useTypedSelector, MOVE, addMove, removeMove, setMovePPUp, setMoveType, setCapabilityOrder, setMoveOrder } from '../store/store';
import { MoveData } from '../utils/types';
import { Theme } from '../utils/theme';
import { TypeIndicator } from './TypeIndicator';
import { getAttackType } from './moves';
import { useRequestData } from '../utils/requests';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AddItemButton, Button, DropdownHeader, IconButton } from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback } from 'react';
import { DefinitionLookahead } from './DefinitionLookahead';
import { DropdownTooltip } from './DropdownTooltip';
import { useDispatch } from 'react-redux';
import { getMoveFrequency } from '../utils/formula';
import { TypeSelector } from './TypeSelector';
import { CapabilityList } from './CapabilityList';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';

const UnsortableMove: React.FC<{ move: MoveData }> = ({ move }) => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(state => state.editMode);
  const pokemonId = useTypedSelector(state => state.pokemon.id);

  const requestMove = useRequestData(MOVE);

  const handleRemoveMove = useCallback(() => {
    dispatch(removeMove(pokemonId, move.id));
  }, [dispatch, pokemonId, move.id]);
  
  const handleTogglePPUp = useCallback(() => {
    if (editMode) {
      dispatch(setMovePPUp(pokemonId, move.id, !move.ppUp));
    }
  }, [editMode, dispatch, pokemonId, move]);

  const handleSetType = useCallback((id, name) => {
    dispatch(setMoveType(pokemonId, move.id, id, name));
  }, [dispatch, pokemonId, move.id]);

  return (
    <MoveContainer onClick={() => !editMode && requestMove(move.definition.id)}>
      <MoveName>
        {editMode && <RemoveMoveButton icon={faTimes} onClick={handleRemoveMove} />}
        {move.definition.name}
      </MoveName>
      <div>AC {move.definition.accuracy}</div>
      <div>{move.definition.damage}</div>
      <div>{getAttackType(move.definition.attackType)}</div>
      <div>
        <TypeSelector value={move.type.name} onSelect={handleSetType} />
      </div>
      <div>
        <MoveFrequency onClick={handleTogglePPUp} editMode={editMode}>
          {getMoveFrequency(move)}
        </MoveFrequency>
      </div>
    </MoveContainer>
  );
};

const Move = SortableElement(UnsortableMove);

const MoveList = SortableContainer(({ children }) => <MoveListContainer>{children}</MoveListContainer>);

export const PokemonMoveList = () => {
  const dispatch = useDispatch();
  const editMode = useTypedSelector(state => state.editMode);
  const pokemonId = useTypedSelector(state => state.pokemon.id);
  const moves = useTypedSelector(state => state.pokemon.moves);
  const capabilities = useTypedSelector(state => state.pokemon.capabilities);

  const [showMoveSelector, setShowMoveSelector] = useState(false);
  const [editorSelection, setEditorSelection] = useState(null);

  const toggleMoveEditor = useCallback((event: Event) => {
    event.stopPropagation();
    setShowMoveSelector(!showMoveSelector);
  }, [showMoveSelector]);

  const handleSubmit = useCallback(() => {
    dispatch(addMove(pokemonId, editorSelection.value));
    setShowMoveSelector(false);
  }, [dispatch, pokemonId, editorSelection]);

  const handleMoveDrag = useCallback(({ oldIndex, newIndex }) => {
    dispatch(setMoveOrder(pokemonId, moves[oldIndex].id, newIndex));
  }, [dispatch, pokemonId, moves]);

  const handleCapabilityDrag = useCallback(({ oldIndex, newIndex }) => {
    dispatch(setCapabilityOrder(pokemonId, capabilities[oldIndex].id, newIndex));
  }, [dispatch, pokemonId, capabilities]);

  return (
    <Container>
      <MoveList axis="y" onSortEnd={handleMoveDrag} pressDelay={100}>
        {moves.map((move, index) => <Move key={move.id} move={move} index={index} disabled={!editMode} />)}
      </MoveList>

      {editMode && (
        <AddMoveContainer>
          <AddMoveButton onClick={toggleMoveEditor}>
            <FontAwesomeIcon icon={faPlus} />
          </AddMoveButton>

          {showMoveSelector && (
            <DropdownTooltip visible={showMoveSelector} onVisibilityChange={setShowMoveSelector}>
              <AddMoveDropdownContent>
                <DropdownHeader>Move</DropdownHeader>
                <DropdownHeader/>
                <div>
                  <DefinitionLookahead path='moves' onChange={setEditorSelection} />
                </div>
                <div>
                  <AddMoveSubmitButton onClick={handleSubmit} disabled={editorSelection === null}>
                    Add
                  </AddMoveSubmitButton>
                </div>
              </AddMoveDropdownContent>
            </DropdownTooltip>
          )}
        </AddMoveContainer>
      )}

      <CapabilityList axis="xy" onSortEnd={handleCapabilityDrag} pressDelay={100} />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 1rem;
`;

const MoveListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  align-items: flex-start;
`;

const MoveContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 10rem 4rem 5rem 5rem 9rem 5.25rem;
  height: 2.5rem;
  margin-bottom: 0.5rem;
  box-shadow: ${Theme.dropShadow};
  border-radius: 1.25rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  & > div {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    background-color: #fff;
    padding: 0 0.5rem;
    overflow: visible;
  }

  & > div:first-child {
    border-radius: 1.25rem 0 0 1.25rem;

    &::after {
      border-radius: 1.25rem 0 0 1.25rem;
    }
  }

  & > div:last-child {
    padding: 0;
    border-radius: 0 1.25rem 1.25rem 0;

    &::after {
      border-radius: 0 1.25rem 1.25rem 0;
    }
  }
`;

const MoveName = styled.div`
  display: flex;
  font-size: 0.875rem;
  font-weight: 700;

  && {
    padding: 0 1rem;
    justify-content: flex-start;
  }
`;

const MoveFrequency = styled.button<{ editMode: boolean }>`
  display: flex;
  top: 0;
  right: 0;
  width: 5.25rem;
  padding: 0 0.5rem 0 1rem;
  border-radius: 0 1.25rem 1.25rem 0;
  height: 100%;
  background-color: #666;
  color: #fff;
  font-family: inherit;
  font-size: inherit;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 1;
  clip-path: polygon(20% 0, calc(100% + 1px) 0%, calc(100% + 1px) 100%, 0% 100%);

  &:active,
  &:focus {
    outline: ${({ editMode }) => !editMode && 'none'};
  }
`;

const AddMoveContainer = styled.div`
  position: relative;
  height: 2.5rem;
  grid-column: 1 / -1;
`;

const AddMoveButton = styled(AddItemButton)`
  width: 38.25rem;
  height: 100%;
  border-radius: 1.25rem;
`;

const AddMoveDropdownContent = styled.div`
  display: grid;
  grid-template-columns: 20rem max-content;

  & > div {
    padding: 0 0.5rem;
  }
`;

const AddMoveSubmitButton = styled(Button)`
  height: 100%;
  padding: 0.25rem 1rem;
`;

const RemoveMoveButton = styled(IconButton)`
  margin-right: 0.5rem;
`;