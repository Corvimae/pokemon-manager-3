import { useState, useCallback, useMemo } from "react";
import styled from 'styled-components';
import { useDispatch } from "react-redux";
import { SortableContainer } from 'react-sortable-hoc';
import { addEdge } from "../store/pokemon";
import { Button, NumericInput, AddItemButton, DropdownHeader } from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DefinitionLookahead } from "./DefinitionLookahead";
import { DropdownTooltip } from "./DropdownTooltip";
import { Theme } from "../utils/theme";
import { useTypedSelector } from "../store/rootReducer";
import { EdgeIndicator } from "./EdgeIndicator";

export const UnsortableEdgeList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemonId = useTypedSelector(store => store.pokemon.data.id);
  const edges = useTypedSelector(store => store.pokemon.data.edges);
  const editMode = useTypedSelector(state => state.pokemon.editMode);

  const [showEdgeEditor, setShowEdgeEditor] = useState(false);
  const [editorEdgeSelection, setEditorEdgeSelection] = useState(null);
  const [editorEdgeRanks, setEditorEdgeRanks] = useState(1);

  const sortedEdges = useMemo(() => (
    edges.sort((a, b) => a.PokemonEdge.sortOrder - b.PokemonEdge.sortOrder)
  ), [edges]);

  const toggleEdgeEditor = useCallback((event: Event) => {
    event.stopPropagation();
    setShowEdgeEditor(!showEdgeEditor);
  }, [showEdgeEditor]);

  const handleSubmit = useCallback(() => {
    dispatch(addEdge(
      pokemonId,
      editorEdgeSelection.value,
      editorEdgeRanks || 1,
    ));
    setShowEdgeEditor(false);
  }, [dispatch, pokemonId, editorEdgeSelection, editorEdgeRanks]);
  
  const handleSetEditorEdgeRanks = useCallback(event => setEditorEdgeRanks(Number(event.target.value)), []);

  return (
    <Container>
      {sortedEdges.map((edge, index) => (
        <EdgeIndicator key={edge.id} index={index} edge={edge} disabled={!editMode} />
      ))}
      {editMode && (
        <AddEdgeContainer>
          <AddEdgeButton onClick={toggleEdgeEditor}>
            <FontAwesomeIcon icon={faPlus} size="sm" />
            &nbsp;Add Edge
          </AddEdgeButton>

          {showEdgeEditor && (
            <DropdownTooltip visible={showEdgeEditor} onVisibilityChange={setShowEdgeEditor}>
              <AddEdgeDropdownContent>
                <DropdownHeader>Edge</DropdownHeader>
                <DropdownHeader>Ranks (optional)</DropdownHeader>
                <DropdownHeader/>
                <div>
                  <DefinitionLookahead
                    path='reference/edges'
                    onChange={setEditorEdgeSelection}
                  />
                </div>
                <div>
                  <AddEdgeValueInput onChange={handleSetEditorEdgeRanks} />
                </div>
                <div>
                  <AddEdgeSubmitButton onClick={handleSubmit} disabled={editorEdgeSelection === null}>
                    Add
                  </AddEdgeSubmitButton>
                </div>
              </AddEdgeDropdownContent>
            </DropdownTooltip>
          )}
        </AddEdgeContainer>
      )}
    </Container>
  );
};

export const EdgeList = SortableContainer(UnsortableEdgeList);

const Container = styled.div`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.25rem;
  margin-top: 0.5rem;

  @media screen and (max-width: ${Theme.mobileThreshold}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AddEdgeContainer = styled.div`
  position: relative;
  height: 1.75rem;
`;

const AddEdgeDropdownContent = styled.div`
  display: grid;
  grid-template-columns: 15rem 8rem max-content;

  & > div {
    padding: 0 0.5rem;
  }
`;

const AddEdgeValueInput = styled(NumericInput)`
  width: 100%;
`;

const AddEdgeSubmitButton = styled(Button)`
  height: 100%;
  padding: 0.25rem 1rem;
`;

const AddEdgeButton = styled(AddItemButton)`
  height: 1.75rem;
  border-radius: 0.875rem;
  font-weight: 700;
`;