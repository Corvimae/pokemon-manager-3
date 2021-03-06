import { useCallback } from "react";
import styled from 'styled-components';
import { EDGE, updateEdgeRanks, removeEdge } from "../store/pokemon";
import { useRequestData } from "../utils/requests";
import { Theme } from "../utils/theme";
import { useDispatch } from "react-redux";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./Layout";
import { SortableElement } from "react-sortable-hoc";
import { useTypedSelector } from "../store/rootReducer";
import { JunctionedEdge } from "../server/models/pokemon";

interface EdgeIndicatorProps {
  edge: JunctionedEdge;
}

export const UnsortableEdgeIndicator: React.FC<EdgeIndicatorProps> = ({ edge }) => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const requestEdgeData = useRequestData(EDGE);

  const handleEditRanksChange = useCallback(event => {
    dispatch(updateEdgeRanks(pokemonId, edge.id, event.target.value));
  }, [dispatch, pokemonId, edge.id]);

  const handleDelete = useCallback(() => {
    dispatch(removeEdge(pokemonId, edge.id));
  }, [dispatch, edge.id]);

  return (
    <Container
      key={edge.id}
      role="button"
      tabIndex={0}
      hasRanks={editMode || edge.PokemonEdge.ranks > 1}
      onClick={() => !editMode && requestEdgeData(edge.id)}
    >
      {editMode && <DeleteButton icon={faTimes} onClick={handleDelete} inverse />}
      <EdgeIndicatorName>{edge.name}</EdgeIndicatorName>
      {(edge.PokemonEdge.ranks > 1 || editMode) && (
        <EdgeIndicatorRanks editMode={editMode}>
          {editMode && (
            <EdgeIndicatorRankInput
              type="number"
              defaultValue={edge.PokemonEdge.ranks}
              onChange={handleEditRanksChange}
            />
          )}
          {!editMode && edge.PokemonEdge.ranks}
        </EdgeIndicatorRanks>
      )}
    </Container>
  );
}

export const EdgeIndicator = SortableElement(UnsortableEdgeIndicator);

const Container = styled.div<{ hasRanks: boolean }>`
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
  box-shadow: ${Theme.dropShadow};
  border-radius: 0.875rem;
  padding: 0 ${props => props.hasRanks ? 2 : 0}rem 0 0;
  overflow: hidden;
`;

const EdgeIndicatorName = styled.div`
  display: flex;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-grow: 1;
`;

const EdgeIndicatorRanks = styled.div<{ editMode: boolean }>`
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  width: 2.25rem;
  padding-left: 0.5rem;
  height: 100%;
  background-color: ${({ editMode }) => editMode ? Theme.backgroundStripe : '#991f1f'};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  clip-path: polygon(30% 0, calc(100% + 1px) 0%, calc(100% + 1px) 100%, 0% 100%);

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    background-color: ${({ editMode }) => editMode ? '#666' : '#991f1f'};
  }
`;

const EdgeIndicatorRankInput = styled.input`
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